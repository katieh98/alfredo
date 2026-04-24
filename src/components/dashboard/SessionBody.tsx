"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Restaurant, Session } from "@/app/dashboard/_data";
import { FilteredCandidatesArea } from "@/components/dashboard/FilteredCandidatesArea";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Header } from "@/components/dashboard/Header";
import { OpsPanel } from "@/components/dashboard/OpsPanel";

gsap.registerPlugin(useGSAP);

/** Width of the detail panel when open. Kept in JS so the GSAP tween can
 * animate `width` to a matching final value without a hard-coded magic
 * number drifting from the panel's own class. */
const PANEL_WIDTH = 416;

interface SessionBodyProps {
  restaurants: Restaurant[];
  session: Session;
}

export function SessionBody({ restaurants, session }: SessionBodyProps) {
  const picked =
    restaurants.find((r) => r.status === "picked") ?? restaurants[0];
  const [selectedId, setSelectedId] = useState<string>(picked.id);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  // Selection persists across filter changes. If the user filters the
  // selected restaurant out of view, the detail panel keeps showing it —
  // less jarring than auto-jumping when a chip toggles.
  const selected =
    restaurants.find((r) => r.id === selectedId) ?? picked;

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Skip the content-change tween on first render so the page doesn't
  // flicker in. Subsequent selection changes animate normally.
  const firstContentPaint = useRef(true);
  // Remember the last rendered id so we can compute slide direction:
  // moving down the list pushes content in from the right; moving up
  // pushes it in from the left — standard carousel/page-nav mapping.
  const prevIdRef = useRef<string>(picked.id);

  // Outer slide — open/close the whole panel.
  // - Open: width 0→416 with fade. power3.out decelerates into rest.
  // - Close: reverse with power3.in, accelerating toward the edge.
  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      if (panelOpen) {
        gsap.to(el, {
          width: PANEL_WIDTH,
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, {
          width: 0,
          opacity: 0,
          x: 24,
          duration: 0.32,
          ease: "power3.in",
        });
      }
    },
    { dependencies: [panelOpen] },
  );

  // Content change — directional horizontal slide keyed off list order.
  // New row BELOW the previous → slide in from the right (direction +1).
  // New row ABOVE the previous → slide in from the left (direction -1).
  // fromTo always restarts from the offscreen-X state so rapid clicks
  // re-trigger cleanly even if the prior tween is still running.
  useGSAP(
    () => {
      if (firstContentPaint.current) {
        firstContentPaint.current = false;
        prevIdRef.current = selectedId;
        return;
      }
      const el = contentRef.current;
      if (!el) return;

      const prevIndex = restaurants.findIndex(
        (r) => r.id === prevIdRef.current,
      );
      const curIndex = restaurants.findIndex((r) => r.id === selectedId);
      const direction =
        prevIndex < 0 || curIndex < 0 || curIndex === prevIndex
          ? 1
          : curIndex > prevIndex
            ? 1
            : -1;
      prevIdRef.current = selectedId;

      gsap.fromTo(
        el,
        { opacity: 0, x: direction * 48 },
        {
          opacity: 1,
          x: 0,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
    },
    { dependencies: [selectedId] },
  );

  function handleSelect(id: string) {
    setSelectedId(id);
    if (!panelOpen) setPanelOpen(true);
  }

  // Dismiss the panel on outside click. Rows are excluded (they have
  // their own open/switch semantics via handleSelect) — everything else
  // outside the panel counts as "outside" and closes it.
  useEffect(() => {
    if (!panelOpen) return;
    function onDown(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest?.("[data-restaurant-row]")) return;
      setPanelOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [panelOpen]);

  return (
    <div className="flex min-w-0 flex-1 gap-3">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header sessionShortId={session.shortId} />
        <main className="dop-no-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2 pb-10 pt-6">
          <SessionHero session={session} />
          <OpsPanel />
          <FilteredCandidatesArea
            restaurants={restaurants}
            selectedId={selected.id}
            onSelect={handleSelect}
          />
        </main>
      </div>
      <div
        ref={panelRef}
        className="shrink-0 overflow-hidden"
        style={{ width: PANEL_WIDTH }}
        aria-hidden={!panelOpen}
      >
        {/* Content-transition target — on selection change, this inner
         * div fades + slides 8px so switching restaurants feels alive
         * instead of snapping. Width is locked so the outer tween clips
         * cleanly rather than squishing content. */}
        <div
          ref={contentRef}
          style={{ width: PANEL_WIDTH }}
          className="h-full"
        >
          <DetailPanel
            restaurant={selected}
            session={session}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

function SessionHero({ session }: { session: Session }) {
  // dateTime is "Sat, Apr 26 · 7:00 PM"; the time slot belongs to the
  // selected reservation, not to the whole night, so strip it for the
  // page header and show only the date.
  const dateOnly = session.dateTime.split(" · ")[0];
  return (
    <section className="flex flex-col gap-6">
      <div className="min-w-0">
        <h1 className="hero-title whitespace-nowrap">
          Tonight
          <span className="text-[var(--color-fg-tertiary)]">
            {" · "}
            {dateOnly}
          </span>
        </h1>
      </div>
    </section>
  );
}

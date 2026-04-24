import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { RestaurantList } from "@/components/dashboard/RestaurantList";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { restaurants, session } from "./_data";

export const metadata: Metadata = {
  title: `Alfredo · ${session.title}`,
  description:
    "Inside Alfredo's decision: which restaurants the agent considered, how it scored them, and why it picked the one it did.",
};

export default function DashboardPage() {
  const picked = restaurants.find((r) => r.status === "picked") ?? restaurants[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#EAEAEA]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header sessionShortId={session.shortId} />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <SessionHero />
            <FiltersRow />
            <section className="px-6 pb-10 pt-4">
              <RestaurantList
                restaurants={restaurants}
                selectedId={picked.id}
              />
            </section>
          </main>
          <DetailPanel restaurant={picked} session={session} />
        </div>
      </div>
    </div>
  );
}

function SessionHero() {
  return (
    <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 pb-5 pt-6">
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
            <span>Session</span>
            <span>·</span>
            <span>{session.shortId}</span>
            <span>·</span>
            <span>created {session.createdAt}</span>
          </div>
          <h1
            className="mt-1.5 font-display text-[40px] leading-none text-[var(--color-fg-strong)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            {session.title} · {session.partySize} people
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--color-fg-muted)]">
            <ChatIcon />
            <span className="italic">{session.chatContext}</span>
          </div>
        </div>

        {/* Party members */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
            Party
          </div>
          <div className="flex items-center -space-x-2">
            {session.members.map((m) => (
              <div
                key={m.id}
                title={`${m.name}${m.dietary?.length ? " · " + m.dietary.join(", ") : ""}`}
                className="flex size-7 items-center justify-center rounded-full border-2 border-[var(--color-surface)] text-[11px] font-semibold text-white"
                style={{ background: m.accentColor }}
              >
                {m.name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-4 gap-px overflow-hidden rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)]">
        {session.pipelineTiming.map((t) => (
          <Stat key={t.label} label={t.label} value={t.value} />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-surface)] px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
        {label}
      </div>
      <div
        className="mt-1 font-display text-[20px] leading-none text-[var(--color-fg-strong)] tabular-nums"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
    </div>
  );
}

function FiltersRow() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
          Filters
        </span>
        {session.filters.map((f) => (
          <FilterChip key={f.label} label={f.label} active={f.active} />
        ))}
        <button
          type="button"
          className="flex h-7 items-center gap-1 rounded-[6px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <PlusIcon />
          Add filter
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <SortButton />
        <ViewToggle />
      </div>
    </div>
  );
}

function FilterChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`flex h-7 items-center gap-1.5 rounded-[6px] border px-2 text-[11px] font-medium transition-colors ${
        active
          ? "border-[var(--color-accent-border)] bg-[var(--color-accent-light)] text-[var(--color-accent)]"
          : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-fg-muted)]"
      }`}
    >
      {active && (
        <span
          className="size-[5px] rounded-full"
          style={{ background: "var(--color-accent)" }}
          aria-hidden
        />
      )}
      {label}
      {active && <XSmallIcon />}
    </span>
  );
}

function SortButton() {
  return (
    <button
      type="button"
      className="flex h-7 items-center gap-1.5 rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-hover)]"
    >
      <SortIcon />
      Best match
      <ChevronDownIcon />
    </button>
  );
}

function ViewToggle() {
  return (
    <div className="flex overflow-hidden rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
      <button
        type="button"
        className="flex h-7 items-center px-2 text-[var(--color-fg-strong)]"
        title="List view"
      >
        <ListIcon />
      </button>
      <span className="w-px bg-[var(--color-border-subtle)]" />
      <button
        type="button"
        className="flex h-7 items-center px-2 text-[var(--color-fg-faint)] hover:text-[var(--color-fg-muted)]"
        title="Grid view"
      >
        <GridIcon />
      </button>
    </div>
  );
}

/* inline icons */

function ChatIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusIcon(): ReactNode {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XSmallIcon(): ReactNode {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SortIcon(): ReactNode {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M7 12h10M11 18h2" />
    </svg>
  );
}

function ChevronDownIcon(): ReactNode {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ListIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function GridIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FaCommentDots } from "react-icons/fa6";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { FilteredCandidatesArea } from "@/components/dashboard/FilteredCandidatesArea";
import { restaurants, session } from "./_data";

export const metadata: Metadata = {
  title: `Alfredo · ${session.title}`,
  description:
    "Inside Alfredo's decision: which restaurants the agent considered, how it scored them, and why it picked the one it did.",
};

export default function DashboardPage() {
  const picked =
    restaurants.find((r) => r.status === "picked") ?? restaurants[0];

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar />
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header sessionShortId={session.shortId} />
          <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2 pb-10 pt-6">
            <SessionHero />
            <FilteredCandidatesArea
              restaurants={restaurants}
              selectedId={picked.id}
            />
          </main>
        </div>
        <DetailPanel restaurant={picked} session={session} />
      </div>
    </div>
  );
}

function SessionHero() {
  return (
    <section className="flex flex-col gap-6">
      {/* Top row: eyebrow + members */}
      <div className="flex items-start justify-between gap-10">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-2">
            <span>Session</span>
            <span className="text-[var(--color-fg-tertiary)]">·</span>
            <span>{session.shortId}</span>
            <span className="text-[var(--color-fg-tertiary)]">·</span>
            <span className="normal-case tracking-normal text-[var(--color-fg-tertiary)]">
              created {session.createdAt}
            </span>
          </div>
          <h1 className="hero-title mt-3 whitespace-nowrap">
            {session.title}
            <span className="text-[var(--color-fg-tertiary)]"> · {session.partySize} people</span>
          </h1>
          <div className="mt-3.5 flex items-center gap-2.5 text-[15px] text-[var(--color-fg-secondary)]">
            <FaCommentDots size={14} className="text-[var(--color-fg-tertiary)]" />
            <span className="italic" style={{ lineHeight: "22px", letterSpacing: "-0.01em" }}>
              {session.chatContext}
            </span>
          </div>
        </div>

        {/* Party avatars */}
        <div className="flex shrink-0 flex-col items-end gap-2.5">
          <div className="eyebrow-strong">Party</div>
          <div className="flex items-center -space-x-2.5">
            {session.members.map((m) => (
              <div
                key={m.id}
                title={`${m.name}${m.dietary?.length ? " · " + m.dietary.join(", ") : ""}`}
                className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--color-bg-alt)] text-[13px] font-semibold text-white"
                style={{
                  background: m.accentColor,
                  fontVariationSettings: "'wght' 600",
                }}
              >
                {m.name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline stats card */}
      <div className="dop-card grid grid-cols-4 overflow-hidden">
        {session.pipelineTiming.map((t, i) => (
          <Stat
            key={t.label}
            label={t.label}
            value={t.value}
            divide={i > 0}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  divide,
}: {
  label: string;
  value: string;
  divide: boolean;
}) {
  return (
    <div
      className={`px-5 py-4 ${divide ? "border-l border-[var(--color-border-subtle)]" : ""}`}
    >
      <div className="eyebrow-strong">{label}</div>
      <div className="stat-num mt-2.5">{value}</div>
    </div>
  );
}

export type { ReactNode };

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FaCommentDots } from "react-icons/fa6";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { FilteredCandidatesArea } from "@/components/dashboard/FilteredCandidatesArea";
import { getSessionsDb, getUsersDb } from "@/lib/db";
import { restaurants, session as mockSession } from "./_data";
import type { Session, PartyMember, Restaurant } from "./_data";

export const metadata: Metadata = {
  title: "Alfredo · Dashboard",
  description: "Real-time booking dashboard powered by Alfredo.",
};

const ACCENT_COLORS = [
  "#F04E55", "#6840FF", "#2ECC71", "#F59E0B", "#1132F5",
  "#E91E8C", "#00BCD4", "#FF5722",
];

async function getLatestSession(): Promise<{ session: Session; picked: Restaurant } | null> {
  const sessDb = getSessionsDb();
  const usrDb = getUsersDb();
  if (!sessDb || !usrDb) return null;

  const sessionResult = await sessDb.query(
    `SELECT * FROM sessions WHERE status IN ('booked', 'fallback', 'processing')
     ORDER BY created_at DESC LIMIT 1`,
  );
  if (sessionResult.rows.length === 0) return null;

  const row = sessionResult.rows[0];
  const taggedIds: string[] = row.tagged_users ?? [];

  const usersResult = await usrDb.query(
    `SELECT discord_id, booking_name, dietary_restrictions FROM users WHERE discord_id = ANY($1)`,
    [taggedIds],
  );

  const userMap = new Map(
    usersResult.rows.map((u: { discord_id: string; booking_name: string; dietary_restrictions: string[] }) => [
      u.discord_id,
      u,
    ]),
  );

  const members: PartyMember[] = taggedIds.map((id, i) => {
    const u = userMap.get(id);
    return {
      id,
      name: u?.booking_name ?? `User ${i + 1}`,
      host: id === row.invoker_id,
      dietary: u?.dietary_restrictions ?? [],
      accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
    };
  });

  const invoker = userMap.get(row.invoker_id);
  const shortId = row.id.slice(0, 6).toUpperCase();
  const createdAt = new Date(row.created_at).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  const session: Session = {
    id: row.id,
    shortId,
    title: "Group booking",
    createdAt,
    pickedAt: createdAt,
    dateTime: "this weekend",
    partySize: taggedIds.length,
    location: "San Francisco, CA",
    chatContext: row.context?.slice(0, 200) ?? "",
    members,
    filters: [],
    pipelineTiming: [
      { label: "Session ID", value: shortId },
      { label: "Party size", value: String(taggedIds.length) },
      { label: "Status", value: row.status },
      { label: "Confirmation", value: row.confirmation ?? "—" },
    ],
  };

  const picked: Restaurant = {
    ...restaurants[0],
    confirmation: row.confirmation ?? undefined,
    confirmationState: row.status === "booked" ? "confirmed" : "pending",
    bookingId: row.confirmation ?? shortId,
    whenLabel: "this weekend",
    hostName: invoker?.booking_name ?? "—",
    source: "Alfredo / Discord",
    partySize: taggedIds.length,
  };

  return { session, picked };
}

export default async function DashboardPage() {
  const data = await getLatestSession();
  const session = data?.session ?? mockSession;
  const picked = data?.picked ?? (restaurants.find((r) => r.status === "picked") ?? restaurants[0]);

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar />
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header sessionShortId={session.shortId} />
          <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-2 pb-10 pt-6">
            <SessionHero session={session} />
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

function SessionHero({ session }: { session: Session }) {
  return (
    <section className="flex flex-col gap-6">
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
          {session.chatContext && (
            <div className="mt-3.5 flex items-center gap-2.5 text-[15px] text-[var(--color-fg-secondary)]">
              <FaCommentDots size={14} className="text-[var(--color-fg-tertiary)]" />
              <span className="italic" style={{ lineHeight: "22px", letterSpacing: "-0.01em" }}>
                {session.chatContext.slice(0, 120)}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2.5">
          <div className="eyebrow-strong">Party</div>
          <div className="flex items-center -space-x-2.5">
            {session.members.map((m) => (
              <div
                key={m.id}
                title={`${m.name}${m.dietary?.length ? " · " + m.dietary.join(", ") : ""}`}
                className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--color-bg-alt)] text-[13px] font-semibold text-white"
                style={{ background: m.accentColor, fontVariationSettings: "'wght' 600" }}
              >
                {m.name[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dop-card grid grid-cols-4 overflow-hidden">
        {session.pipelineTiming.map((t, i) => (
          <Stat key={t.label} label={t.label} value={t.value} divide={i > 0} />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value, divide }: { label: string; value: string; divide: boolean }) {
  return (
    <div className={`px-5 py-4 ${divide ? "border-l border-[var(--color-border-subtle)]" : ""}`}>
      <div className="eyebrow-strong">{label}</div>
      <div className="stat-num mt-2.5">{value}</div>
    </div>
  );
}

export type { ReactNode };

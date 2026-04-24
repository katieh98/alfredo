"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSessionsDb, getUsersDb } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";
import { FaUtensils, FaHotel, FaClock } from "react-icons/fa6";
import type { ReactNode } from "react";

interface SessionRow {
  id: string;
  invoker_id: string;
  tagged_users: string[];
  status: string;
  created_at: string;
  booking_type: string;
}

interface UserRow {
  discord_id: string;
  booking_name: string;
}

async function getUpcomingSessions(discordId: string) {
  const sessDb = getSessionsDb();
  const usrDb = getUsersDb();
  if (!sessDb || !usrDb) return [];

  const result = await sessDb.query(
    `SELECT id, invoker_id, tagged_users, status, created_at, booking_type
     FROM sessions
     WHERE (invoker_id = $1 OR $1 = ANY(tagged_users))
       AND status IN ('collecting', 'processing', 'fallback')
     ORDER BY created_at DESC
     LIMIT 20`,
    [discordId],
  );

  const rows: SessionRow[] = result.rows;
  if (rows.length === 0) return [];

  const allIds = [...new Set(rows.flatMap((r) => [r.invoker_id, ...r.tagged_users]))];
  const usersResult = await usrDb.query(
    `SELECT discord_id, booking_name FROM users WHERE discord_id = ANY($1)`,
    [allIds],
  );
  const nameMap = new Map<string, string>(
    usersResult.rows.map((u: UserRow) => [u.discord_id, u.booking_name]),
  );

  return rows.map((row) => ({
    id: row.id,
    shortId: row.id.slice(0, 6).toUpperCase(),
    status: row.status,
    bookingType: row.booking_type ?? "restaurants",
    createdAt: new Date(row.created_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    partySize: row.tagged_users.length,
    members: row.tagged_users.map((id) => nameMap.get(id) ?? `User …${id.slice(-4)}`),
    invokerName: nameMap.get(row.invoker_id) ?? `User …${row.invoker_id.slice(-4)}`,
    isInvoker: row.invoker_id === discordId,
  }));
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string; icon: ReactNode }> = {
    collecting: { bg: "rgba(225,225,225,0.08)", text: "rgba(225,225,225,0.6)", label: "Waiting on crew",    icon: <FaClock size={10} /> },
    processing: { bg: "rgba(104,64,255,0.12)",  text: "#6840ff",               label: "Alfredo is on it",  icon: <FaClock size={10} /> },
    fallback:   { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b",               label: "Call in progress",  icon: <FaClock size={10} /> },
  };
  const s = map[status] ?? map.collecting;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

export default async function UpcomingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const discordId =
    (session.user as { discordId?: string }).discordId ??
    (session.user as { id?: string }).id ??
    "";
  const userName = session.user.name ?? undefined;
  const userHandle = userName?.toLowerCase().replace(/\s+/g, "") ?? undefined;
  const upcoming = await getUpcomingSessions(discordId);

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="upcoming" variant="user" userName={userName} userHandle={userHandle} />

      <main className="flex flex-1 flex-col overflow-y-auto rounded-[14px] bg-[var(--color-surface-raised)] p-6">
        <h1
          className="font-display text-[28px] font-normal"
          style={{ letterSpacing: "-0.03em", color: "var(--color-fg-strong)" }}
        >
          Upcoming
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--color-fg-muted)" }}>
          Plans in progress — waiting on your crew or being worked on by Alfredo.
        </p>

        {upcoming.length === 0 ? (
          <div
            className="mt-12 flex flex-col items-center gap-3 text-center"
            style={{ color: "var(--color-fg-faint)" }}
          >
            <FaClock size={32} />
            <p className="text-[15px]">Nothing in the pipeline right now.</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {upcoming.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-4 rounded-[12px] p-4"
                style={{
                  background: "var(--color-surface)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-[10px]"
                  style={{
                    background: r.bookingType === "hotels" ? "rgba(104,64,255,0.12)" : "rgba(240,78,85,0.12)",
                    color: r.bookingType === "hotels" ? "#6840ff" : "#f04e55",
                  }}
                >
                  {r.bookingType === "hotels" ? <FaHotel size={16} /> : <FaUtensils size={16} />}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-[15px]"
                      style={{ fontWeight: 510, color: "var(--color-fg-strong)" }}
                    >
                      {r.bookingType === "hotels" ? "SF trip" : "Night out"} · {r.partySize} people
                    </span>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="text-[13px]" style={{ color: "var(--color-fg-muted)" }}>
                    Started {r.createdAt} · organized by {r.isInvoker ? "you" : r.invokerName}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {r.members.map((name) => (
                      <span
                        key={name}
                        className="rounded-full px-2 py-0.5 text-[12px]"
                        style={{
                          background: "rgba(225,225,225,0.06)",
                          color: "var(--color-fg-muted)",
                        }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  {r.status === "collecting" && (
                    <p className="mt-1 text-[12px]" style={{ color: "var(--color-fg-faint)" }}>
                      Waiting for everyone to respond via Discord DM
                    </p>
                  )}
                </div>

                <span
                  className="shrink-0 font-mono text-[12px]"
                  style={{ color: "var(--color-fg-faint)" }}
                >
                  #{r.shortId}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

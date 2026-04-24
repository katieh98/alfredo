"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSessionsDb, getUsersDb } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";
import { FaUtensils, FaHotel, FaCircleCheck, FaCircleXmark, FaClock } from "react-icons/fa6";
import type { ReactNode } from "react";

interface SessionRow {
  id: string;
  invoker_id: string;
  tagged_users: string[];
  status: string;
  confirmation: string | null;
  created_at: string;
  booking_type: string;
  context: string | null;
}

interface UserRow {
  discord_id: string;
  booking_name: string;
}

async function getUserSessions(discordId: string) {
  const sessDb = getSessionsDb();
  const usrDb = getUsersDb();
  if (!sessDb || !usrDb) return [];

  const result = await sessDb.query(
    `SELECT id, invoker_id, tagged_users, status, confirmation, created_at, booking_type, context
     FROM sessions
     WHERE invoker_id = $1 OR $1 = ANY(tagged_users)
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
    confirmation: row.confirmation,
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: ReactNode; label: string }> = {
    booked:     { bg: "rgba(46,204,113,0.12)",   text: "#2ecc71",                  icon: <FaCircleCheck size={11} />, label: "Booked" },
    fallback:   { bg: "rgba(245,158,11,0.12)",   text: "#f59e0b",                  icon: <FaClock size={11} />,       label: "Call in progress" },
    processing: { bg: "rgba(104,64,255,0.12)",   text: "#6840ff",                  icon: <FaClock size={11} />,       label: "Processing" },
    collecting: { bg: "rgba(225,225,225,0.08)",  text: "rgba(225,225,225,0.55)",   icon: <FaClock size={11} />,       label: "Waiting on crew" },
    failed:     { bg: "rgba(240,78,85,0.12)",    text: "#f04e55",                  icon: <FaCircleXmark size={11} />, label: "Failed" },
  };
  const s = styles[status] ?? styles.collecting;
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

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const discordId =
    (session.user as { discordId?: string }).discordId ??
    (session.user as { id?: string }).id ??
    "";
  const reservations = await getUserSessions(discordId);

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="tonight" variant="user" />

      <main className="flex flex-1 flex-col overflow-y-auto rounded-[14px] bg-[var(--color-surface-raised)] p-6">
        <h1
          className="font-display text-[28px] font-normal"
          style={{ letterSpacing: "-0.03em", color: "var(--color-fg-strong)" }}
        >
          Your reservations
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--color-fg-muted)" }}>
          Every group plan Alfredo ran for you or with you.
        </p>

        {reservations.length === 0 ? (
          <div
            className="mt-12 flex flex-col items-center gap-3 text-center"
            style={{ color: "var(--color-fg-faint)" }}
          >
            <FaUtensils size={32} />
            <p className="text-[15px]">
              No reservations yet — tag your friends in Discord to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {reservations.map((r) => (
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
                    background:
                      r.bookingType === "hotels"
                        ? "rgba(104,64,255,0.12)"
                        : "rgba(240,78,85,0.12)",
                    color: r.bookingType === "hotels" ? "#6840ff" : "#f04e55",
                  }}
                >
                  {r.bookingType === "hotels" ? (
                    <FaHotel size={16} />
                  ) : (
                    <FaUtensils size={16} />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-[15px]"
                      style={{ fontWeight: 510, color: "var(--color-fg-strong)" }}
                    >
                      {r.bookingType === "hotels" ? "SF trip" : "Night out"} ·{" "}
                      {r.partySize} people
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-[13px]" style={{ color: "var(--color-fg-muted)" }}>
                    {r.createdAt} · organized by{" "}
                    {r.isInvoker ? "you" : r.invokerName}
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
                  {r.confirmation && (
                    <div
                      className="mt-1 text-[12px]"
                      style={{ color: "var(--color-fg-faint)" }}
                    >
                      Confirmation <code>{r.confirmation}</code>
                    </div>
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

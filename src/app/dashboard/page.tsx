import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SessionBody } from "@/components/dashboard/SessionBody";
import { getSessionsDb, getUsersDb } from "@/lib/db";
import { restaurants, session as mockSession } from "./_data";
import type { PartyMember, Restaurant, Session } from "./_data";

export const metadata: Metadata = {
  title: "Alfredo · Dashboard",
  description: "Real-time booking dashboard powered by Alfredo.",
};

const ACCENT_COLORS = [
  "#F04E55",
  "#6840FF",
  "#2ECC71",
  "#F59E0B",
  "#1132F5",
  "#E91E8C",
  "#00BCD4",
  "#FF5722",
];

/**
 * Pull the most recent booked/fallback/processing session from Ghost DB.
 * Returns null if the DB isn't configured (local dev without creds) or
 * there are no matching rows — callers fall back to the mock session.
 */
async function getLatestSession(): Promise<{
  session: Session;
  picked: Restaurant;
} | null> {
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
    usersResult.rows.map(
      (u: {
        discord_id: string;
        booking_name: string;
        dietary_restrictions: string[];
      }) => [u.discord_id, u],
    ),
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
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

  // Overlay real DB data on the mocked Cotogna row so the detail panel
  // (which still reads restaurant-metadata fields like cuisine/rating)
  // keeps its visual richness while the operational fields come from DB.
  const picked: Restaurant = {
    ...restaurants[0],
    confirmation: row.confirmation ?? undefined,
    confirmationState: row.status === "booked" ? "confirmed" : "pending",
    bookingId: row.confirmation ?? shortId,
    whenLabel: "this weekend",
    hostName: invoker?.booking_name ?? "—",
    source: "Alfredo",
    partySize: taggedIds.length,
  };

  return { session, picked };
}

export default async function DashboardPage() {
  const data = await getLatestSession();
  const session = data?.session ?? mockSession;
  // If real data arrived, swap its picked row into the list so the
  // reservations table keeps the other mock rows for demo texture.
  const displayRestaurants = data?.picked
    ? restaurants.map((r) => (r.status === "picked" ? data.picked : r))
    : restaurants;

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="tonight" />
      <SessionBody restaurants={displayRestaurants} session={session} />
    </div>
  );
}

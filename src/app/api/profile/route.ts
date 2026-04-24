import { NextRequest, NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUsersDb } from "@/lib/db";

function getDiscordId(session: Session | null): string | null {
  if (!session?.user) return null;
  return (session.user as { id?: string }).id ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const discordId = getDiscordId(session);
  if (!discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getUsersDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const result = await db.query(
    "SELECT booking_name, booking_phone, booking_email, dietary_restrictions, cuisine_preferences, price_range FROM users WHERE discord_id = $1",
    [discordId],
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ profile: null });
  }

  const row = result.rows[0];
  return NextResponse.json({
    profile: {
      booking_name: row.booking_name,
      booking_phone: row.booking_phone,
      booking_email: row.booking_email,
      dietary: (row.dietary_restrictions as string[]).join(", "),
      cuisine: (row.cuisine_preferences as string[]).join(", "),
      price_range: row.price_range,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const discordId = getDiscordId(session);
  if (!discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getUsersDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { booking_name, booking_phone, booking_email, dietary, cuisine, price_range } = body;

  if (!booking_name || !booking_phone || !booking_email) {
    return NextResponse.json({ error: "Name, phone, and email are required" }, { status: 400 });
  }

  const dietaryRestrictions = dietary
    ? String(dietary).split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];
  const cuisinePreferences = cuisine
    ? String(cuisine).split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  await db.query(
    `INSERT INTO users (discord_id, booking_name, booking_phone, booking_email,
      dietary_restrictions, cuisine_preferences, price_range)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (discord_id) DO UPDATE
     SET booking_name = $2, booking_phone = $3, booking_email = $4,
         dietary_restrictions = $5, cuisine_preferences = $6, price_range = $7`,
    [
      discordId,
      booking_name,
      booking_phone,
      booking_email,
      dietaryRestrictions,
      cuisinePreferences,
      price_range ?? "mid",
    ],
  );

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getUsersDb, getSessionsDb } from "@/lib/db";
import { getBotClient } from "@/lib/bot-client";
import { buildAvailabilityRow } from "@/bot/availability";

export async function POST(req: NextRequest) {
  const db = getUsersDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { token, booking_name, booking_phone, booking_email, dietary, cuisine, price_range } = body;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  if (!booking_name || !booking_phone || !booking_email) {
    return NextResponse.json(
      { error: "Name, phone, and email are required" },
      { status: 400 },
    );
  }

  const tokenResult = await db.query(
    "SELECT discord_id, expires_at FROM setup_tokens WHERE token = $1",
    [token],
  );

  if (tokenResult.rows.length === 0) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  const { discord_id, expires_at } = tokenResult.rows[0];

  if (new Date(expires_at) < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
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
      discord_id,
      booking_name,
      booking_phone,
      booking_email,
      dietaryRestrictions,
      cuisinePreferences,
      price_range ?? "mid",
    ],
  );

  await db.query("DELETE FROM setup_tokens WHERE token = $1", [token]);

  // Send availability DM if there's an active session waiting on this user
  try {
    const sessDb = getSessionsDb();
    const botClient = getBotClient();
    if (sessDb && botClient) {
      const activeSessions = await sessDb.query(
        `SELECT id FROM sessions WHERE status = 'collecting' AND $1 = ANY(tagged_users)`,
        [discord_id],
      );
      for (const row of activeSessions.rows) {
        const user = await botClient.users.fetch(discord_id);
        await user.send({
          content: `you're all set! now pick when you're free this weekend 👇`,
          components: [buildAvailabilityRow(row.id)],
        });
      }
    }
  } catch (err) {
    console.error("Failed to send post-registration availability DM:", err);
  }

  return NextResponse.json({ success: true });
}

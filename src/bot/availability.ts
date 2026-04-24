import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type User as DiscordUser,
} from "discord.js";
import { getUsersDb } from "@/lib/db";
import crypto from "crypto";

export function buildAvailabilityRow(sessionId: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`avail:sat_afternoon:${sessionId}`)
      .setLabel("Saturday afternoon")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sat_evening:${sessionId}`)
      .setLabel("Saturday evening")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sun_afternoon:${sessionId}`)
      .setLabel("Sunday afternoon")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sun_evening:${sessionId}`)
      .setLabel("Sunday evening")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:none:${sessionId}`)
      .setLabel("Can't make it")
      .setStyle(ButtonStyle.Danger),
  );
}

export function buildHotelAvailabilityRow(sessionId: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`avail:fri_night:${sessionId}`)
      .setLabel("Friday night")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sat_night:${sessionId}`)
      .setLabel("Saturday night")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:full_weekend:${sessionId}`)
      .setLabel("Full weekend")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail:none:${sessionId}`)
      .setLabel("Can't make it")
      .setStyle(ButtonStyle.Danger),
  );
}

export async function dmUser(
  user: DiscordUser,
  sessionId: string,
  invokerName: string,
  bookingType: "restaurants" | "hotels" = "restaurants",
) {
  const db = getUsersDb();
  if (!db) throw new Error("Users DB not configured");

  const existing = await db.query(
    "SELECT discord_id FROM users WHERE discord_id = $1",
    [user.id],
  );
  const isNew = existing.rows.length === 0;

  if (isNew) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await db.query(
      `INSERT INTO setup_tokens (token, discord_id, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (token) DO UPDATE SET discord_id = $2, expires_at = $3`,
      [token, user.id, expiresAt],
    );

    const setupUrl = `${process.env.APP_URL}/setup?token=${token}`;

    const verb = bookingType === "hotels" ? "planning a weekend trip to SF" : "planning a night out";
    await user.send(
      `hey ${user.username}! 🍝 **${invokerName}** is ${verb} and wants you there.\n\nset up your profile first and we'll ask when you're free:\n${setupUrl}`,
    );
  } else if (bookingType === "hotels") {
    await user.send({
      content: `hey ${user.username}! 🏨 **${invokerName}** is planning a SF trip and wants you along.\n\nwhich nights work for you? 👇`,
      components: [buildHotelAvailabilityRow(sessionId)],
    });
  } else {
    await user.send({
      content: `hey ${user.username}! 🍝 **${invokerName}** is planning a night out and wants you there.\n\nwhen are you free this weekend? 👇`,
      components: [buildAvailabilityRow(sessionId)],
    });
  }
}

import {
  Client,
  GatewayIntentBits,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
} from "discord.js";
import crypto from "crypto";
import { getSessionsDb } from "@/lib/db";
import { dmUser } from "./availability";
import { runAgentPipeline } from "./pipeline";

const MENTION_REGEX = /<@!?(\d+)>/g;

async function handleAlfredoCommand(interaction: ChatInputCommandInteraction) {
  const db = getSessionsDb();
  if (!db) {
    await interaction.reply({
      content: "Database not configured yet.",
      ephemeral: true,
    });
    return;
  }

  const friendsInput = interaction.options.getString("friends", true);

  const taggedIds: string[] = [];
  let match;
  while ((match = MENTION_REGEX.exec(friendsInput)) !== null) {
    taggedIds.push(match[1]);
  }
  MENTION_REGEX.lastIndex = 0;

  if (taggedIds.length === 0) {
    await interaction.reply({
      content: "Tag at least one friend! Example: `/alfredo @alice @bob`",
      ephemeral: true,
    });
    return;
  }

  const messages = await interaction.channel!.messages.fetch({ limit: 5 });
  const context = messages
    .filter((m) => !m.interaction)
    .map((m) => `${m.author.username}: ${m.content}`)
    .join("\n");

  await interaction.reply("Alfredo is on it! Checking in with your crew...");

  const sessionId = crypto.randomUUID();
  await db.query(
    `INSERT INTO sessions (id, channel_id, guild_id, invoker_id, tagged_users, context)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      sessionId,
      interaction.channelId,
      interaction.guildId,
      interaction.user.id,
      taggedIds,
      context,
    ],
  );

  console.log(`Session ${sessionId} created, DMing ${taggedIds.length} users`);

  for (const userId of taggedIds) {
    try {
      const user = await interaction.client.users.fetch(userId);
      console.log(`DMing user ${user.username} (${userId})`);
      await dmUser(user, sessionId, interaction.user.username);
      console.log(`DM sent to ${user.username}`);
    } catch (err) {
      console.error(`Failed to DM user ${userId}:`, err);
    }
  }
}

async function handleAvailabilityButton(interaction: ButtonInteraction) {
  const db = getSessionsDb();
  if (!db) return;

  const [prefix, slot, sessionId] = interaction.customId.split(":");
  if (prefix !== "avail" || !sessionId) return;

  await db.query(
    `INSERT INTO availability_responses (session_id, discord_id, slots)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_id, discord_id) DO UPDATE SET slots = $3`,
    [sessionId, interaction.user.id, [slot]],
  );

  await interaction.update({ content: "Got it!", components: [] });

  const sessionResult = await db.query(
    "SELECT tagged_users FROM sessions WHERE id = $1",
    [sessionId],
  );
  const responsesResult = await db.query(
    "SELECT discord_id FROM availability_responses WHERE session_id = $1",
    [sessionId],
  );

  const taggedUsers: string[] = sessionResult.rows[0].tagged_users;
  const respondedIds = responsesResult.rows.map(
    (r: { discord_id: string }) => r.discord_id,
  );
  const allResponded = taggedUsers.every((id) => respondedIds.includes(id));

  if (allResponded) {
    await runAgentPipeline(interaction.client, sessionId);
  }
}

export function startBot() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.warn("DISCORD_TOKEN not set, skipping bot startup");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  client.on("ready", () => {
    console.log(`Alfredo bot logged in as ${client.user?.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    try {
      if (
        interaction.isChatInputCommand() &&
        interaction.commandName === "alfredo"
      ) {
        await handleAlfredoCommand(interaction);
      } else if (interaction.isButton()) {
        await handleAvailabilityButton(interaction);
      }
    } catch (error) {
      console.error("Interaction error:", error);
    }
  });

  client.login(token);
}

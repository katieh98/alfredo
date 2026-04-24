import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const command = new SlashCommandBuilder()
  .setName("alfredo")
  .setDescription("Find and book a restaurant for your group")
  .addStringOption((option) =>
    option
      .setName("friends")
      .setDescription("Tag your friends with @mentions")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("What are you booking?")
      .setRequired(false)
      .addChoices(
        { name: "restaurants", value: "restaurants" },
        { name: "hotels", value: "hotels" },
      ),
  )
  .addBooleanOption((option) =>
    option
      .setName("demo")
      .setDescription("Skip TinyFish and call to book instantly")
      .setRequired(false),
  );

async function register() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId || !guildId) {
    console.error(
      "Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or DISCORD_GUILD_ID",
    );
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(token);

  console.log("Registering /alfredo command...");
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [command.toJSON()],
  });
  console.log("Done! /alfredo is now available in your test server.");
}

register().catch(console.error);

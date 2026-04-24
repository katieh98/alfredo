import type { Client } from "discord.js";

declare global {
  // eslint-disable-next-line no-var
  var __discordClient: Client | undefined;
}

export function setBotClient(client: Client) {
  globalThis.__discordClient = client;
}

export function getBotClient(): Client | null {
  return globalThis.__discordClient ?? null;
}

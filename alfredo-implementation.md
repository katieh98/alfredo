# Alfredo 🍝
### Ship to Prod Hackathon | Apr 24, 2026

> A Discord bot that reads your group chat, checks tagged friends availability, and finds (and books) the perfect restaurant no app switching, no coordination overhead.

**Scope:** Backend only. The /setup page is a bare functional form — no styling needed. Discord bot messages are the only user-facing output that matters for the demo.

---

## How It Works

```
/alfredo @alice @bob @carol
```

1. Bot reads the last 5 messages in the channel for context (cuisine vibes, budget mentions, etc.)
2. Bot DMs each tagged user with availability buttons
3. Once all tagged users respond, the agent queries restaurants against group preferences + overlapping slots
4. TinyFish attempts to book on OpenTable autonomously under the invoker name
5. Bot posts result back to the original channel confirmation number if booked, best pick + direct link if fallback

---

## Accounts: How Discord ID Becomes the Account

There is no separate "Alfredo account". Discord IS the account. The Discord user ID (a unique number like 281624215) is the primary key in your Ghost DB users table. Everything ties back to it.

The full identity chain:

```
/alfredo @alice
  Discord gives you Alice user ID: "281624215"
  Bot queries Ghost DB: SELECT * FROM users WHERE discord_id = '281624215'
  Row exists?  returning user, skip setup, send availability buttons
  No row?      new user, generate setup token, DM setup link
      |
      v
  Alice clicks link -> Discord OAuth on your web app
  Discord own screen: "Authorize Alfredo to know who you are"
  Alice clicks Authorize
  Discord returns her user ID "281624215" to your callback
  Web app saves her preferences to Ghost DB under discord_id = '281624215'
      |
      v
  Next time @alice is tagged -> Ghost row exists -> no setup needed
```

There is no email login, no password, no separate Alfredo account. Discord OAuth is the only auth. The web app /setup page is just a form for food preferences - identity always comes from Discord.

---

## Architecture

```
Discord Channel
  /alfredo @alice @bob
         |
         | discord.js interaction event
         v
Discord Bot (Node.js / Railway)
  1. interaction.channel.messages.fetch({ limit: 5 })
     extract context string from recent messages

  2. Parse @mentions from string option
     regex: /<@!?(\d+)>/g  -> array of Discord user IDs
     for each ID: SELECT * FROM users WHERE discord_id = ?
     if no row: DM with setup link + availability buttons
     if row exists: DM with availability buttons only

  3. Listen for button interactions
     write slot response to Ghost DB availability_responses
     when all tagged_users have a row: fire agent pipeline

  4. Post result back to channel
         |                        |
         | read/write             | fire when all responded
         v                        v
Ghost DB (ghost.build)       Agent Pipeline
  users table                  1. computeOverlap(responses)
  sessions table                  -> concrete date/time strings
  availability_responses       2. WunderGraph supergraph query
  setup_tokens                    -> users prefs + restaurants
                               3. Claude API: pick + reasoning
                               4. TinyFish: book on OpenTable
                               5. Return result to bot
                                        |
                                        v
                               WunderGraph Cosmo Supergraph
                                 users-subgraph -> Ghost DB
                                 restaurants-subgraph -> Yelp + TinyFish
```

---

## Sponsor Stack

### WunderGraph Cosmo
Federates two subgraphs into one GraphQL supergraph. The agent makes a single query and gets back group preferences + restaurant options in one response. No N+1 calls, no manual stitching.

- users-subgraph: wraps Ghost DB, exposes dietary restrictions, cuisine preferences, booking contact info
- restaurants-subgraph: wraps Yelp API for the candidate list + TinyFish for enrichment (vibe, dishes, OpenTable availability)

### TinyFish (Node.js SDK only, no CLI needed)
```bash
npm install @tinyfish-io/agentql
```
Used for two things: enriching restaurant data by scraping OpenTable pages (run in parallel with Promise.all), and autonomously completing the OpenTable booking form under the invokers details.

### Ghost (ghost.build)
Postgres database platform built for AI agents. Native MCP support lets Claude Code create tables and run migrations directly without touching psql. Stores all persistent state: user profiles, booking contact info, setup tokens, sessions, availability responses.

---

## Tech Stack

```
Discord Bot        discord.js
Backend            Node.js / TypeScript
Database           Ghost (ghost.build) - Postgres
Supergraph         WunderGraph Cosmo
  users-subgraph          -> Ghost DB
  restaurants-subgraph    -> Yelp Fusion API + TinyFish SDK
AI                 Claude API (claude-sonnet-4-6)
Auth               Discord OAuth via next-auth
Web app            Next.js on Railway (/setup page - unstyled functional form only, no design needed)
Hosting            Railway (Next.js service + bot service)
```

---

## Step-by-Step Implementation

### Step 0 - Discord App Setup

1. Go to https://discord.com/developers/applications -> New Application -> name it "Alfredo"

2. Bot tab -> Add Bot -> Reset Token -> copy immediately -> save as DISCORD_TOKEN (only shown once)
   Enable under Privileged Gateway Intents: Message Content Intent

3. OAuth2 -> General:
   Copy Client ID -> DISCORD_CLIENT_ID
   Copy Client Secret -> DISCORD_CLIENT_SECRET

4. OAuth2 -> URL Generator -> scopes: bot + applications.commands
   Permissions: Send Messages, Read Message History, Use Slash Commands
   Copy URL, open in browser, add bot to your test server

5. Register the slash command as a GUILD command (not global - guild is instant, global takes 1 hour)
   Get Guild ID: right-click test server name in Discord -> Copy Server ID -> DISCORD_GUILD_ID

```typescript
// run once: npx ts-node register-commands.ts
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const command = new SlashCommandBuilder()
  .setName('alfredo')
  .setDescription('Find and book a restaurant for your group')
  .addStringOption(option =>
    option
      .setName('friends')
      .setDescription('Tag your friends with @mentions')
      .setRequired(true)
  );

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

await rest.put(
  Routes.applicationGuildCommands(
    process.env.DISCORD_CLIENT_ID!,
    process.env.DISCORD_GUILD_ID!
  ),
  { body: [command.toJSON()] }
);
```

6. Verify with a minimal bot:

```typescript
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ]
});

client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`));
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'alfredo') return;
  await interaction.reply('Alfredo is alive!');
});

client.login(process.env.DISCORD_TOKEN);
```

Type /alfredo in your test server. If it replies, you are done.

Env vars from this step:
```
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
```

---

### Step 1 - Repo + Infra Scaffold

Monorepo: apps/bot (discord.js) and apps/web (Next.js). Two Railway services.

Ghost DB setup:
```bash
ghost db create alfredo-users
ghost db create alfredo-sessions
```
Each command returns a postgresql:// connection string. Save both to .env.

Ghost MCP config for Claude Code - add to .claude/mcp.json so Claude Code manages DB schema:
```json
{
  "mcpServers": {
    "ghost-users": {
      "command": "ghost",
      "args": ["mcp", "--db", "alfredo-users"],
      "env": { "GHOST_TOKEN": "<your-ghost-token>" }
    },
    "ghost-sessions": {
      "command": "ghost",
      "args": ["mcp", "--db", "alfredo-sessions"],
      "env": { "GHOST_TOKEN": "<your-ghost-token>" }
    }
  }
}
```

WunderGraph Cosmo setup:
```bash
npm install -g wgc@latest
wgc auth login

wgc federated-graph create alfredo \
  --namespace default \
  --routing-url http://localhost:3002/graphql

wgc subgraph create users \
  --namespace default \
  --routing-url http://localhost:3003/graphql

wgc subgraph create restaurants \
  --namespace default \
  --routing-url http://localhost:3004/graphql

# Run after each schema change:
wgc subgraph publish users --namespace default --schema ./subgraphs/users/schema.graphql
wgc subgraph publish restaurants --namespace default --schema ./subgraphs/restaurants/schema.graphql
```

Full .env:
```
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
GHOST_USERS_DB_URL=postgresql://ghost:...@alfredo-users.ghost.build/postgres
GHOST_SESSIONS_DB_URL=postgresql://ghost:...@alfredo-sessions.ghost.build/postgres
GHOST_TOKEN=
YELP_API_KEY=
TINYFISH_API_KEY=
ANTHROPIC_API_KEY=
NEXTAUTH_SECRET=
APP_URL=https://alfredo.up.railway.app
WUNDERGRAPH_ROUTER_URL=http://localhost:3002/graphql
```

---

### Step 2 - Ghost DB Schema

Tell Claude Code via MCP: "create these tables". It runs DDL directly against Ghost, no psql needed.

```sql
-- alfredo-users database
CREATE TABLE users (
  discord_id           TEXT PRIMARY KEY,
  display_name         TEXT,
  booking_name         TEXT NOT NULL,
  booking_phone        TEXT NOT NULL,
  booking_email        TEXT NOT NULL,
  dietary_restrictions TEXT[] DEFAULT '{}',
  cuisine_preferences  TEXT[] DEFAULT '{}',
  price_range          TEXT DEFAULT 'mid',
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE setup_tokens (
  token       TEXT PRIMARY KEY,
  discord_id  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL
);

-- alfredo-sessions database
CREATE TABLE sessions (
  id            TEXT PRIMARY KEY,
  channel_id    TEXT NOT NULL,
  guild_id      TEXT NOT NULL,
  invoker_id    TEXT NOT NULL,
  tagged_users  TEXT[] NOT NULL,
  context       TEXT,
  status        TEXT DEFAULT 'collecting',
  confirmation  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE availability_responses (
  session_id   TEXT NOT NULL,
  discord_id   TEXT NOT NULL,
  slots        TEXT[] NOT NULL,
  PRIMARY KEY (session_id, discord_id)
);
```

Do a test insert + select on each table to confirm connection strings work before moving on.

---

### Step 3 - Discord Bot: Mention Parsing + Session Creation

Discord slash command string options containing @mentions arrive as raw text like "<@281624215> and <@394872016>". Parse the user IDs with a regex:

```typescript
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'alfredo') return;

  const friendsInput = interaction.options.getString('friends', true);

  // Discord mention format: <@USER_ID> or <@!USER_ID> (with nickname)
  const mentionRegex = /<@!?(\d+)>/g;
  const taggedIds: string[] = [];
  let match;
  while ((match = mentionRegex.exec(friendsInput)) !== null) {
    taggedIds.push(match[1]); // raw Discord user ID
  }

  if (taggedIds.length === 0) {
    await interaction.reply({ content: 'Tag at least one friend!', ephemeral: true });
    return;
  }

  // Read last 5 messages, exclude the slash command itself
  const messages = await interaction.channel!.messages.fetch({ limit: 5 });
  const context = messages
    .filter(m => !m.interaction)
    .map(m => `${m.author.username}: ${m.content}`)
    .join('\n');

  // Discord requires a response within 3 seconds
  await interaction.reply('Alfredo is on it! Checking in with your crew...');

  const sessionId = crypto.randomUUID();
  await sessionsDb.query(
    `INSERT INTO sessions (id, channel_id, guild_id, invoker_id, tagged_users, context)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [sessionId, interaction.channelId, interaction.guildId,
     interaction.user.id, taggedIds, context]
  );

  for (const userId of taggedIds) {
    const user = await client.users.fetch(userId);
    await dmUser(user, sessionId, interaction.user.username);
  }
});
```

---

### Step 4 - Web App + Discord OAuth + Setup Token Flow

The /setup page is a bare functional form. No styling, no design. It just needs to work. Users will only see it once when setting up their profile for the first time.

next-auth Discord provider - Discord user ID comes back as token.sub after OAuth:

```typescript
// pages/api/auth/[...nextauth].ts
export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) token.discordId = (profile as any).id;
      return token;
    },
    async session({ session, token }) {
      (session as any).discordId = token.discordId;
      return session;
    }
  }
});
```

Bot DMs new users with a one-time token. The token tells the web app which Discord user is setting up before they have OAuth'd:

```typescript
async function dmUser(user: DiscordUser, sessionId: string, invokerName: string) {
  const existing = await usersDb.query(
    'SELECT discord_id FROM users WHERE discord_id = $1', [user.id]
  );
  const isNew = existing.rows.length === 0;

  if (isNew) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await usersDb.query(
      `INSERT INTO setup_tokens (token, discord_id, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (discord_id) DO UPDATE SET token = $1, expires_at = $3`,
      [token, user.id, expiresAt]
    );

    const setupUrl = `${process.env.APP_URL}/setup?token=${token}`;

    await user.send({
      content: `Hey ${user.username}! ${invokerName} is planning a night out.\n\nSet up your food profile:\n${setupUrl}\n\nThen pick your availability:`,
      components: [buildAvailabilityRow(sessionId)]
    });
  } else {
    await user.send({
      content: `Hey ${user.username}! ${invokerName} is planning a night out.\nYour profile is all set.\n\nWhen are you free?`,
      components: [buildAvailabilityRow(sessionId)]
    });
  }
}
```

On the /setup page: validate token -> get discord_id -> trigger Discord OAuth.
After OAuth callback: you have the Discord ID from OAuth AND the token from cookie.
Save user row, delete token:

```typescript
// Save preferences after OAuth completes
await usersDb.query(
  `INSERT INTO users (discord_id, display_name, booking_name, booking_phone, booking_email,
    dietary_restrictions, cuisine_preferences, price_range)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   ON CONFLICT (discord_id) DO UPDATE
   SET dietary_restrictions = $6, cuisine_preferences = $7, price_range = $8`,
  [discordId, displayName, bookingName, bookingPhone, bookingEmail,
   dietaryRestrictions, cuisinePreferences, priceRange]
);

await usersDb.query('DELETE FROM setup_tokens WHERE token = $1', [token]);
```

The /setup page form itself is just bare HTML inputs — no components, no styling:

```tsx
// pages/setup.tsx - functional only, no design needed
export default function Setup({ token }: { token: string }) {
  return (
    <form method="POST" action="/api/save-profile">
      <input type="hidden" name="token" value={token} />
      
      <p>Dietary restrictions (comma separated):<br/>
      <input name="dietary" placeholder="vegetarian, gluten-free" /></p>
      
      <p>Cuisine preferences (comma separated):<br/>
      <input name="cuisine" placeholder="Mexican, Japanese, Italian" /></p>
      
      <p>Price range:<br/>
      <select name="price_range">
        <option value="budget">Budget</option>
        <option value="mid" selected>Mid</option>
        <option value="upscale">Upscale</option>
      </select></p>
      
      <p>Full name (for reservations):<br/>
      <input name="booking_name" required /></p>
      
      <p>Phone number (for reservations):<br/>
      <input name="booking_phone" required /></p>
      
      <p>Email:<br/>
      <input name="booking_email" type="email" required /></p>
      
      <button type="submit">Save and continue to Discord</button>
    </form>
  );
}
```

That is the entire frontend. No components, no Tailwind, no design. Just needs to save to Ghost DB correctly.

---

### Step 5 - Availability DM Buttons

customId encodes the slot key and sessionId so you know what was pressed and for which session:

```typescript
function buildAvailabilityRow(sessionId: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`avail:sat_afternoon:${sessionId}`)
      .setLabel('Saturday afternoon')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sat_evening:${sessionId}`)
      .setLabel('Saturday evening')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sun_afternoon:${sessionId}`)
      .setLabel('Sunday afternoon')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:sun_evening:${sessionId}`)
      .setLabel('Sunday evening')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`avail:none:${sessionId}`)
      .setLabel("Can't make it")
      .setStyle(ButtonStyle.Danger),
  );
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const [prefix, slot, sessionId] = interaction.customId.split(':');
  if (prefix !== 'avail') return;

  await sessionsDb.query(
    `INSERT INTO availability_responses (session_id, discord_id, slots)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_id, discord_id) DO UPDATE SET slots = $3`,
    [sessionId, interaction.user.id, [slot]]
  );

  await interaction.update({ content: 'Got it!', components: [] });

  // Check if all tagged users have responded
  const session = await sessionsDb.query(
    'SELECT tagged_users FROM sessions WHERE id = $1', [sessionId]
  );
  const responses = await sessionsDb.query(
    'SELECT discord_id FROM availability_responses WHERE session_id = $1', [sessionId]
  );

  const allResponded = session.rows[0].tagged_users.every((id: string) =>
    responses.rows.some((r: any) => r.discord_id === id)
  );

  if (allResponded) await runAgentPipeline(sessionId);
});
```

---

### Step 6 - WunderGraph Subgraphs

Install the WunderGraph federation skill in Claude Code before writing any schema.

Users subgraph schema (wraps Ghost DB):
```graphql
type User @key(fields: "discordId") {
  discordId: ID!
  dietaryRestrictions: [String!]!
  cuisinePreferences: [String!]!
  priceRange: String!
  bookingName: String!
  bookingPhone: String!
  bookingEmail: String!
}

type Query {
  users(ids: [ID!]!): [User!]!
}
```

Restaurants subgraph schema (wraps Yelp + TinyFish):
```graphql
type Restaurant {
  id: ID!
  name: String!
  cuisine: String!
  priceRange: String!
  rating: Float!
  openTableId: String
  availableSlots: [TimeSlot!]!
  enrichment: RestaurantEnrichment!
}

type TimeSlot { date: String!, time: String! }

type RestaurantEnrichment {
  topDishes: [String!]!
  vibeSummary: String!
  transitInfo: String!
}

input TimeSlotInput { date: String!, startTime: String!, endTime: String! }

type Query {
  restaurants(near: String!, partySize: Int!, availableIn: [TimeSlotInput!]!): [Restaurant!]!
}
```

Restaurants resolver - Yelp for candidates, TinyFish for enrichment in parallel:
```typescript
restaurants: async ({ near, partySize, availableIn }) => {
  const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });
  const yelpResults = await fetchYelp(near, availableIn);

  // Enrich top 5 in parallel - never sequential, too slow
  const enriched = await Promise.all(
    yelpResults.slice(0, 5).map(async (restaurant) => {
      const page = await tf.fetch(
        `https://www.opentable.com/r/${restaurant.openTableId}`,
        { format: 'json' }
      );
      return {
        ...restaurant,
        availableSlots: parseAvailability(page, availableIn),
        enrichment: {
          topDishes: parseTopDishes(page),
          vibeSummary: page.description,
          transitInfo: page.address,
        }
      };
    })
  );

  return enriched;
}
```

---

### Step 7 - Slot Computation + Agent Pipeline

Convert abstract slot keys (sat_evening) into concrete date strings before passing to TinyFish or WunderGraph:

```typescript
function buildSlots() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
  const daysUntilSat = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);

  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);
  const sun = new Date(now);
  sun.setDate(now.getDate() + daysUntilSat + 1);

  const makeSlot = (base: Date, startHour: number, endHour: number, label: string) => {
    const start = new Date(base); start.setHours(startHour, 0, 0, 0);
    const end = new Date(base);   end.setHours(endHour, 0, 0, 0);
    return {
      label,
      start,
      end,
      date: start.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      }),
      // e.g. "Saturday, April 26, 2026"
      startTime: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      endTime: end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      // e.g. "5:00 PM"
    };
  };

  return {
    sat_afternoon: makeSlot(sat, 12, 16, 'Saturday afternoon'),
    sat_evening:   makeSlot(sat, 17, 22, 'Saturday evening'),
    sun_afternoon: makeSlot(sun, 12, 16, 'Sunday afternoon'),
    sun_evening:   makeSlot(sun, 17, 21, 'Sunday evening'),
  };
}

function computeOverlap(responses: Array<{ slots: string[] }>) {
  const allSlots = buildSlots();
  return Object.entries(allSlots)
    .filter(([key]) => responses.every(r => r.slots.includes(key)))
    .map(([key, slot]) => ({ key, ...slot }));
}

async function runAgentPipeline(sessionId: string) {
  const [session, responses] = await Promise.all([
    sessionsDb.query('SELECT * FROM sessions WHERE id = $1', [sessionId]),
    sessionsDb.query('SELECT discord_id, slots FROM availability_responses WHERE session_id = $1', [sessionId])
  ]);

  const overlappingSlots = computeOverlap(responses.rows);

  if (overlappingSlots.length === 0) {
    const ch = await client.channels.fetch(session.rows[0].channel_id) as TextChannel;
    await ch.send("Couldn't find a time that works for everyone this weekend.");
    return;
  }

  const { data } = await wgClient.query({
    operationName: 'FindRestaurants',
    input: {
      userIds: session.rows[0].tagged_users,
      slots: overlappingSlots.map(s => ({ date: s.date, startTime: s.startTime, endTime: s.endTime })),
      location: 'San Francisco, CA',
      partySize: session.rows[0].tagged_users.length + 1,
    }
  });

  const pick = await pickRestaurant({
    restaurants: data.restaurants,
    users: data.users,
    context: session.rows[0].context,
    slots: overlappingSlots,
  });

  const invoker = await usersDb.query(
    'SELECT * FROM users WHERE discord_id = $1',
    [session.rows[0].invoker_id]
  );

  const booking = await bookRestaurant(pick, invoker.rows[0]);
  await postResult(session.rows[0].channel_id, pick, booking);
}
```

Claude scoring prompt:
```typescript
async function pickRestaurant({ restaurants, users, context, slots }) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Pick the best restaurant for this group and which time slot to book.

Group preferences: ${JSON.stringify(users, null, 2)}

Recent chat context (use for vibe/cuisine hints): ${context}

Available time slots:
${slots.map(s => `- ${s.label}: ${s.date} from ${s.startTime} to ${s.endTime}`).join('\n')}

Available restaurants: ${JSON.stringify(restaurants, null, 2)}

Rules:
- Dietary restrictions are HARD constraints
- Cuisine preferences and chat context are soft signals
- Pick the slot with the most restaurant availability

Return ONLY valid JSON, no markdown:
{
  "restaurantId": "...",
  "slotKey": "sat_evening",
  "date": "Saturday, April 26, 2026",
  "time": "7:00 PM",
  "reasoning": "One or two sentences explaining why this fits this specific group."
}`
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

---

### Step 8 - TinyFish Booking + Fallback

```typescript
import TinyFish from '@tinyfish-io/agentql';

async function bookRestaurant(pick: any, invoker: any) {
  const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });

  try {
    const result = await tf.agent({
      url: 'https://www.opentable.com',
      goal: `
        Search for "${pick.restaurant.name}" in San Francisco, CA.
        Book a table for ${pick.partySize} people on ${pick.date} at ${pick.time}.
        If that exact time is not available, try 30 minutes earlier or 30 minutes later.
        Name: ${invoker.booking_name}
        Email: ${invoker.booking_email}
        Phone: ${invoker.booking_phone}
        Do NOT proceed if a credit card is required. Return an error instead.
        Return only the confirmation number when complete.
      `
    });

    return { success: true, confirmation: result.confirmationNumber };

  } catch (err) {
    return {
      success: false,
      directUrl: `https://www.opentable.com/r/${pick.restaurant.openTableId}`
    };
  }
}
```

---

### Step 9 - Post Result to Discord

```typescript
async function postResult(channelId: string, pick: any, booking: any) {
  const channel = await client.channels.fetch(channelId) as TextChannel;

  if (booking.success) {
    await channel.send(
      `Booked!\n\n` +
      `${pick.restaurant.name} - ${pick.restaurant.neighborhood}\n` +
      `${pick.date} - ${pick.time} - ${pick.partySize} people\n` +
      `Confirmation #${booking.confirmation}\n\n` +
      `Why Alfredo picked it:\n${pick.reasoning}`
    );
  } else {
    await channel.send(
      `${pick.restaurant.name} - ${pick.restaurant.neighborhood}\n` +
      `${pick.date} - ${pick.time} - ${pick.partySize} people\n\n` +
      `Alfredo found the perfect spot but could not grab the reservation automatically.\n` +
      `Book it here: ${booking.directUrl}\n\n` +
      `Why Alfredo picked it:\n${pick.reasoning}`
    );
  }
}
```

---

### Step 10 - End-to-End Test

Run through the full happy path with real Discord accounts before the demo:

- Type /alfredo @realuser1 @realuser2 in test server
- Confirm both users get DMs with availability buttons
- Confirm button press writes to Ghost DB and updates message to "Got it!"
- Confirm agent fires when all tagged users have responded
- Confirm WunderGraph query returns real Yelp restaurants
- Confirm TinyFish enrichment adds vibe and dishes
- Confirm Claude picks a restaurant and writes reasoning
- Confirm bot posts result back to the channel

Pre-seed demo accounts: one user with vegetarian restrictions, one with Mexican cuisine preference. This makes the reasoning output interesting during the demo.

---

*Built at Ship to Prod - AWS Builder Loft - San Francisco - April 24, 2026*

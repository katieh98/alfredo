# Alfredo 🍝

Alfredo is a Discord bot that coordinates group restaurant bookings. Tag your friends, let everyone pick their availability, and Alfredo finds the perfect spot and books it — automatically.

Built for [Ship to Prod](https://shiptoprod.dev) hackathon, April 2026.

---

## How it works

### The full flow

1. Someone runs `/alfredo @friend1 @friend2` in Discord
2. Alfredo DMs each tagged person asking when they're free this weekend
3. New users are sent a profile setup link first (dietary restrictions, cuisine preferences, price range)
4. Once everyone responds, Alfredo finds overlapping availability
5. It queries Yelp for top SF restaurants, picks the best fit using OpenAI, and attempts to book
6. First it tries TinyFish (browser automation on OpenTable) — 2 minute timeout
7. If that fails, it falls back to a VAPI phone call to the restaurant
8. The result is posted back to the Discord channel

### Demo mode

Run `/alfredo @friend demo:True` to skip TinyFish entirely and go straight to the VAPI call. Useful for demos where you don't want to wait 2 minutes for browser automation.

---

## Architecture

Everything runs as a single Next.js app deployed on Railway. The Discord bot boots via `src/instrumentation.ts` on server start (nodejs runtime only).

```
Discord
  └── /alfredo command
        ├── DMs tagged users for availability
        └── On all responses → Agent Pipeline
              ├── Users subgraph    (Ghost DB)
              ├── Restaurants subgraph (Yelp + TinyFish enrichment)
              ├── OpenAI picks best restaurant
              ├── TinyFish books on OpenTable (2min timeout)
              └── VAPI phone call fallback
                    └── Webhook → Discord result
```

---

## Sponsor integrations

### Ghost (ghost.build) — Database

Ghost provides two managed Postgres databases (Timescale-backed):

- **Users DB** — stores Discord user profiles: booking name, email, phone, dietary restrictions, cuisine preferences, price range. Also stores one-time setup tokens used to authenticate the profile setup page.
- **Sessions DB** — tracks each `/alfredo` invocation: who invoked it, which channel, who was tagged, availability responses, booking status, and VAPI call ID for webhook correlation.

Ghost's MCP server is used to manage the schema and run ad-hoc queries during development.

### WunderGraph Cosmo — Federated GraphQL

The restaurant and user data are served via Apollo Federation v2 subgraphs, composed with WunderGraph Cosmo:

- `src/app/api/subgraph/users/route.ts` — exposes user profiles from Ghost DB
- `src/app/api/subgraph/restaurants/route.ts` — queries Yelp Fusion API for SF restaurants (coordinates + 8km radius, best_match sort), enriches with TinyFish

The agent pipeline queries both subgraphs in parallel via `Promise.all`. WunderGraph Cosmo handles schema composition and federation — the subgraphs are fully spec-compliant Apollo Federation v2.

### TinyFish — Browser automation

TinyFish handles the actual restaurant booking. `tf.agent.run()` navigates OpenTable, searches for the restaurant, and fills in the reservation form with the party size, date, time, and contact details. Has a 2-minute timeout before falling back to a VAPI phone call.

### VAPI — AI phone calls

When TinyFish fails or in demo mode, VAPI makes an outbound call to the restaurant. The call follows a strict script:

- Opens: *"Hi, I'd like to make a reservation for X people at TIME on DATE under NAME. Is that possible?"*
- If confirmed: *"Perfect, thank you so much! Goodbye!"* → ends call
- If unavailable: *"No problem, thank you anyway! Goodbye!"* → ends call

VAPI fires a webhook to `/api/vapi-webhook` when the call ends. The webhook looks up the session by VAPI call ID and posts the outcome to Discord.

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── subgraph/
│   │   │   ├── users/route.ts          # Apollo Federation users subgraph
│   │   │   └── restaurants/route.ts    # Apollo Federation restaurants subgraph
│   │   ├── save-profile/route.ts       # Profile setup form submission
│   │   └── vapi-webhook/route.ts       # VAPI call completion webhook
│   └── setup/page.tsx                  # Profile setup page
├── bot/
│   ├── index.ts                        # Discord bot: slash commands + button handlers
│   ├── availability.ts                 # DM availability buttons
│   ├── pipeline.ts                     # Agent pipeline: subgraphs → OpenAI → booking → Discord
│   └── register-commands.ts            # One-time slash command registration
├── lib/
│   ├── db.ts                           # Lazy Ghost DB pool getters
│   ├── slots.ts                        # Weekend time slot generation + overlap computation
│   ├── claude.ts                       # OpenAI restaurant picker
│   ├── booking.ts                      # TinyFish + VAPI booking logic
│   └── bot-client.ts                   # Global Discord client singleton
└── instrumentation.ts                  # Boots Discord bot on Next.js server start
```

---

## Environment variables

```env
# Discord
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=

# Ghost DB
GHOST_USERS_DB_URL=
GHOST_SESSIONS_DB_URL=

# APIs
YELP_API_KEY=
TINYFISH_API_KEY=
OPENAI_API_KEY=
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=

# Auth + App
NEXTAUTH_SECRET=
NEXTAUTH_URL=
APP_URL=
```

---

## Running locally

```bash
npm install
npm run dev
```

Register the Discord slash command (one-time):

```bash
npx tsx src/bot/register-commands.ts
```

## Deployment

Deployed on Railway. Pushes to `main` auto-deploy.

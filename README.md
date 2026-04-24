# Alfredo

> Group restaurant booking, automated. Tag your friends in Discord — Alfredo handles the rest.

Built for [Ship to Prod](https://shiptoprod.dev) · April 2026

---

## What it does

Someone runs `/alfredo @alice @bob` in a Discord channel. Alfredo DMs each tagged person asking when they're free this weekend. Once everyone responds, it finds the overlapping time slots, queries Yelp for top SF restaurants, uses AI to pick the best fit for the group's dietary restrictions and preferences, and books the reservation — either via browser automation or a live phone call. The confirmation is posted back to the Discord channel.

No app to download. No coordination overhead. One slash command.

---

## The flow

```
/alfredo @alice @bob
  │
  ├── DM each tagged user → availability buttons (Sat/Sun morning/afternoon/evening)
  │     └── New users → profile setup link (dietary restrictions, cuisine prefs, price range)
  │
  ├── All responded (or 2hr timeout) → Agent Pipeline
  │     ├── Compute overlapping time slots
  │     ├── Query subgraphs in parallel (WunderGraph Cosmo)
  │     │     ├── Users subgraph  → dietary restrictions + booking contact (Ghost DB)
  │     │     └── Restaurants subgraph → Yelp Fusion top SF picks + TinyFish enrichment
  │     ├── OpenAI picks best restaurant for the group
  │     ├── TinyFish books on OpenTable (browser automation, 2min timeout)
  │     └── VAPI phone call fallback if TinyFish fails or demo mode
  │
  └── Result posted to Discord channel
```

---

## Sponsor integrations

### Ghost · Database
Two managed Postgres databases (Timescale-backed):
- **Users DB** — Discord profiles: booking name, email, phone, dietary restrictions, cuisine preferences, price range. Also stores one-time setup tokens for the profile setup page. Accessible at `/profile` after logging in.
- **Sessions DB** — every `/alfredo` invocation: who invoked it, which channel, who was tagged, availability responses, booking status, VAPI call ID for webhook correlation.

The restaurant operator dashboard (`/dashboard`) reads live session and user data directly from Ghost — party members, dietary flags, confirmation codes, and booking status all pulled in real time.

Ghost's MCP server was used entirely from within Claude Code to provision both databases, manage schema, run ad-hoc queries, and clear test data during development — no web console needed.

### WunderGraph Cosmo · Federated GraphQL
Two Apollo Federation v2 subgraphs composed by Cosmo:
- **Users subgraph** (`/api/subgraph/users`) — serves user profiles from Ghost DB
- **Restaurants subgraph** (`/api/subgraph/restaurants`) — queries Yelp Fusion for SF restaurants (lat/lng + 8km radius, best_match sort), enriches top picks with TinyFish

The agent pipeline queries both subgraphs in parallel via `Promise.all`, getting user preferences and restaurant options in a single round trip.

### TinyFish · Browser automation
Used for two things:
- **Booking** — `tf.agent.run()` navigates OpenTable, finds the restaurant, and fills in the reservation form (party size, date, time, contact). 2-minute timeout before falling back.
- **Enrichment** — `tf.fetch.getContents()` scrapes OpenTable restaurant pages for dish descriptions and vibe summaries, giving the AI richer context when picking.

### VAPI · AI phone calls
When TinyFish times out or in demo mode, VAPI makes an outbound call to the restaurant. The assistant follows a tight script: ask for the reservation, confirm or accept rejection, hang up. VAPI fires a webhook to `/api/vapi-webhook` when the call ends — the webhook correlates by call ID, reads the transcript, and posts the outcome to Discord.

---

## Tech stack

| Layer | Technology |
|---|---|
| Bot | Discord.js (slash commands, button interactions, DMs) |
| Web app | Next.js 16 (App Router), deployed on Railway |
| Database | Ghost (managed Postgres / Timescale) |
| GraphQL | WunderGraph Cosmo (Apollo Federation v2) |
| Restaurant data | Yelp Fusion API |
| Browser automation | TinyFish |
| AI selection | OpenAI gpt-4o |
| Phone booking | VAPI |
| Auth | NextAuth v4 + Discord OAuth |

---

## Demo mode

Run `/alfredo @friend demo:True` to skip TinyFish and go straight to the VAPI phone call — useful when you don't want to wait up to 2 minutes for browser automation during a live demo.

---

## Web app

| Route | Purpose |
|---|---|
| `/` | Marketing landing page |
| `/login` | Sign in |
| `/dashboard` | Restaurant operator view — live session data, party members, dietary flags, confirmation status pulled from Ghost |
| `/profile` | Update dietary restrictions, cuisine preferences, and booking contact info |
| `/setup?token=...` | One-time profile setup for new users (linked from Discord DM) |

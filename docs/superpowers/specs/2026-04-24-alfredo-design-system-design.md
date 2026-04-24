# Alfredo Design System & Screen Inventory — Design Spec

**Date:** 2026-04-24
**Status:** Draft (pending user review)
**Deliverable:** Figma file (Mochi, key `b5aMUZrylQNRSKtt6IXoWP`) containing a design system page and 15 screen frames for the Alfredo product.

---

## 1. Purpose

Alfredo is a Discord-first agent that books dinner for groups. The original hackathon spec treated web surfaces as functional-only. This spec defines the visual and structural design for:

- A **user-facing web surface** that extends Alfredo beyond Discord (landing, invite/share, web availability voting, profile, history, booking confirmation, fallback).
- A **restaurant-facing dashboard** — a new product surface enabling restaurants to sign up, onboard, and manage a listing that Alfredo's agent can surface.
- A shared **design system** (tokens + components) underpinning both surfaces.

The design system and screens must feel cohesive with the existing Alfredo brand (red-dot mark, editorial rhythm) while adopting a **Partiful-inspired playful register**: warm cream/cherry palette, display serif, pill CTAs, hard-offset shadows, emoji-as-stickers, grain texture. Dinner/food-themed, not party-themed — the feeling is *Italian osteria meets Partiful invite*.

---

## 2. Non-goals

- Implementation code (this spec is design-only; the following `writing-plans` step produces an implementation plan).
- Dark mode (light mode only for v1).
- Mobile breakpoints (desktop-first, 1440w reference; responsive is a later concern).
- Multi-state screens (empty / loading / error) — happy path only for v1.
- Restaurant-side features beyond profile + menu (no inbound bookings, analytics, or paid promotion in v1).
- Motion / animation specs (static frames only).
- Accessibility audit (AA contrast is a self-check during design, but formal audit is out of scope).

---

## 3. Brand direction

One-sentence north star: **Italian osteria meets Partiful invite.** Warm, tactile, emoji-as-sticker, display serif headlines, flat surfaces with hard-offset shadows, cherry-red CTAs on peach cream.

**Feeling spectrum** (where Alfredo sits):

| Dimension | Not this ← | → This |
|---|---|---|
| Temperature | Cool / slate | **Warm / cream** |
| Formality | SaaS dashboard | **Invitation / stationery** |
| Corners | Sharp | **Rounded / pill** |
| Accents | Single-color neutral | **Emoji stickers, rotated** |
| Shadows | Soft blur elevation | **Hard-offset solid (retro)** |
| Typography | All-sans utility | **Display serif + sans + mono** |
| Density | Dense admin | **Spacious, editorial** |

---

## 4. Token system (light mode only)

### 4.1 Color

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#FBF2EC` | Page background (peach cream) |
| `bg-raised` | `#FFFFFF` | Cards, modals, form surfaces |
| `bg-muted` | `#F5E7DD` | Alt sections, form field fills |
| `ink-primary` | `#1A0F0B` | Headlines, body (warm near-black) |
| `ink-secondary` | `#6B5F55` | Support text |
| `ink-tertiary` | `#A89B8F` | Meta labels, placeholders |
| `accent-primary` | `#E6194B` | Primary CTA, red dot, Alfredo mark |
| `accent-warm` | `#FFB800` | Highlight blocks, callouts |
| `accent-peach` | `#FFD4C2` | Soft fills, tag backgrounds |
| `accent-mint` | `#00B67A` | Success state (“booked”) |
| `accent-grape` | `#7B5EA7` | Decorative, theme accents |
| `border` | `#E8D9CD` | Hairlines, dividers |

Contrast targets: `ink-primary` on `bg-base` must meet WCAG AA (≥4.5:1). All chip label + fill combos must meet ≥4.5:1.

### 4.2 Typography

- **Display** — `Fraunces` (variable serif; weights 400/600/900; optical sizing enabled).
- **UI / Body** — `Inter` (weights 400/500/600).
- **Mono** — `JetBrains Mono` (weights 400/500) — reserved for meta labels and confirmation numbers (referencing Discord/terminal heritage).

Type scale:

| Style | Size / LH | Tracking | Font |
|---|---|---|---|
| `display-xl` | 80 / 84 | -0.02em | Fraunces 900 |
| `display-lg` | 56 / 60 | -0.015em | Fraunces 900 |
| `display-md` | 40 / 44 | -0.01em | Fraunces 600 |
| `heading` | 28 / 32 | 0 | Fraunces 600 |
| `title` | 20 / 28 | 0 | Inter 600 |
| `body-lg` | 18 / 28 | 0 | Inter 400 |
| `body` | 16 / 24 | 0 | Inter 400 |
| `caption` | 14 / 20 | 0 | Inter 500 |
| `meta` | 12 / 16 | 0.08em UPPER | JetBrains Mono 500 |

### 4.3 Radius

- `radius-sm` 8 — inputs, small chips
- `radius-md` 12 — buttons (non-pill), form blocks
- `radius-lg` 20 — cards, modals
- `radius-pill` 9999 — CTAs, filter chips, avatars

### 4.4 Spacing (4px base)

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

### 4.5 Shadow / elevation

- Default: flat.
- `shadow-card` — `3px 3px 0 rgba(26,15,11,1)` — hard-offset solid, sticker/zine feel.
- `shadow-cta-hover` — `5px 5px 0 rgba(26,15,11,1)` — nudges up on hover.
- No soft blurs. No glassmorphism.

### 4.6 Texture

- `grain-overlay` — 2% opacity noise PNG, applied optionally to `bg-muted` sections and callout blocks. Adds tactility without being busy.

### 4.7 Sticker ornaments

First-class system element, not icons. Emoji rendered at 32–64px, rotated ±4–8°, placed loose near headlines or over cards. Approved set for v1:

- 🍝 🍷 🥗 🍕 🌶️ — food
- 🎉 🔥 ⭐️ 💌 — celebration / invite
- 🟢 🔴 🟣 — theme dots (group color coding)

---

## 5. Component library

Designed in Figma as components with variants. Implementation contract: each maps 1:1 to a shadcn primitive where one exists, else a custom component.

### 5.1 Buttons

- `Button / primary` — cherry fill, white text, pill, `shadow-card`. Sizes: sm 36h · md 44h · lg 56h.
- `Button / secondary` — `ink-primary` outline 1.5px, `bg-raised` fill, pill.
- `Button / ghost` — no fill, underline on hover, `ink-primary` text.
- `IconButton` — 44 square, `radius-md`, icon center.

### 5.2 Form

- `Input` — 12r, `bg-muted` fill, no border, 48h, `ink-primary` text, `ink-tertiary` placeholder.
- `Textarea` — same treatment, 120h min.
- `Select` — chevron right, same treatment.
- `Label` — `caption` style, `ink-secondary`.
- `Helper` — `caption`, `ink-tertiary`.
- `Checkbox` — 20sq, 4r, cherry fill when checked.
- `Toggle` — pill, 44×24, cherry fill on.
- `FormRow` — Label + Input + Helper stack (vertical, 8 gap).

### 5.3 Data display

- `Tag / Chip` — pill, 28h, `accent-peach` fill, `ink-primary` text, emoji slot left, optional close-X right.
- `Badge` — inline, 20h, `caption`, colored dot + label (mint for booked, cherry for urgent, grape for event).
- `Avatar` — circle, 32/48/64, subject photo or color-dot initial.
- `AvatarStack` — overlapping -8px spacing.
- `Divider` — dotted 1.5px, `border` color.

### 5.4 Containers

- `Card` — 20r, `bg-raised`, `shadow-card`, 24 padding.
- `CalloutBlock` — `accent-warm` fill (butter-yellow), 12r, 20 padding, for "why Alfredo picked it" style explainers.
- `StickerBlock` — grape or peach card with a rotated emoji sticker overlap.
- `MetadataRow` — horizontal strip of `meta` style tokens separated by middle-dot (·).

### 5.5 Navigation

- `TopBar` — logo mark (Alfredo wordmark + red dot) + breadcrumb meta + right-aligned action, 72h.
- `Footer` — simple link list, `meta` style.

### 5.6 Domain-specific

- `AvailabilityChip` — pill button; default state outlined, selected state `accent-primary` fill, disabled state `bg-muted` + strikethrough.
- `PartyMemberRow` — Avatar + name + dietary `Tag` inline (e.g., "Alice · 🥗 vegetarian").
- `RestaurantCard` — image top (aspect 4:3, 20r), name (`title`), metadata row, tag row — used in listings and confirmation.
- `ConfirmationBlock` — dark `ink-primary` card, cherry accent label, oversized mono confirmation number — reuses the visual treatment from the existing `screenshot-booked.png` but with updated palette.
- `PromoSticker` — rotated StickerBlock for "NEW", "TRENDING", dietary-friendly callouts.

---

## 6. Screen inventory

All frames designed at **1440w**, happy-path state, light mode, desktop only.

### 6.1 User surface (9 screens)

| # | Screen | Purpose | Key components |
|---|---|---|---|
| U1 | Landing | Marketing hero; explain what Alfredo does; CTA to Discord | Display-xl hero, stickers, 3-step how-it-works strip, footer |
| U2 | Invite / Share | Shareable session page (Partiful-style invite card) | StickerBlock, PartyMemberRow, AvailabilityChip row, CTA |
| U3 | Web availability voting | Pick time slots (alt to Discord button) | AvailabilityChips, group progress indicator |
| U4 | Setup (token-gated) | First-time dietary + booking info form | FormRow stack, dietary/cuisine chips, CTA |
| U5 | Profile editor | Returning user edits same fields | Same as Setup, with "Last updated" meta |
| U6 | Booking confirmation | "Cotogna is booked" detail view | ConfirmationBlock, CalloutBlock (reasoning), PartyMemberRows, action row |
| U7 | Fallback | Alfredo couldn't auto-book; direct link | RestaurantCard, CalloutBlock (reasoning), prominent OpenTable CTA |
| U8 | Dinner history | List of past sessions | TopBar, stack of compact session cards |
| U9 | Token landing / OAuth handoff | Validates magic link, then redirects to Discord OAuth | Centered card, single CTA, "What happens next" helper |

### 6.2 Restaurant dashboard (6 screens)

| # | Screen | Purpose | Key components |
|---|---|---|---|
| R1 | Signup / OAuth | Restaurant creates account (email + OAuth) | Centered card, trust microcopy |
| R2 | Onboarding wizard — 3 adjacent frames (R2a, R2b, R2c) representing steps 1/3, 2/3, 3/3 of the same flow | Cuisine, vibe, hours, photos | Step indicator, FormRow stacks, chip pickers |
| R3 | Restaurant profile editor | Primary dashboard landing | Two-column: editor + live preview card |
| R4 | Menu editor | Dishes list (name, dietary tags, price) | Repeating FormRow with delete, dietary chip picker, add-dish CTA |
| R5 | Settings | Account, notifications, booking contacts | Settings section list, FormRow stacks |
| R6 | Agent preview card | "How Alfredo sees your restaurant" — renders the actual RestaurantCard as the agent would see it, with annotations explaining each field | RestaurantCard + annotation callouts |

---

## 7. Figma file structure

File: `b5aMUZrylQNRSKtt6IXoWP` (Mochi).

| Page | Contents |
|---|---|
| `00 — Cover` | Title, summary, palette swatches, date |
| `01 — Foundations` | Color variables, type styles, radius, spacing, shadow, grain, sticker library |
| `02 — Components` | Full library with variants |
| `03 — User Screens` | Frames U1–U9 in row order |
| `04 — Restaurant Dashboard` | Frames R1–R6 in row order |

Each frame: 1440w × auto height, `bg-base` fill, `grain-overlay` optional, frame name format `U1 / Landing`.

Color tokens defined as Figma variables using slash-nested namespaces (`Color/bg/base`, `Color/ink/primary`, `Color/accent/primary`). When exported to CSS for shadcn consumption, translate to kebab-case (`--bg-base`, `--ink-primary`, `--accent-primary`). Section 4 uses the kebab form as the canonical token identifier.

Type styles defined as Figma text styles matching the scale table.

---

## 8. Execution plan

1. Commit this spec. Run spec-document-reviewer subagent loop until approved.
2. User reviews spec and approves.
3. `writing-plans` skill produces the implementation plan.
4. Implementation plan executes against Figma MCP (`use_figma`) building pages in order: 01 Foundations → 02 Components → 03 User Screens (Landing first as reference) → 04 Restaurant Dashboard → 00 Cover.

Estimated implementation session: ~2.5 hours of agent work at the Figma MCP layer, not counting review iterations.

---

## 9. Dependencies & references

- Existing Alfredo screens in repo root (`screenshot-landing.png`, `screenshot-booked.png`, `s-flows.png`, `s-setup.png`, `s-fallback.png`, `s-tokens.png`) — visual reference for prior editorial direction. These will be *replaced*, not preserved.
- `HafferXHRegular` fonts in repo root — no longer used (Fraunces replaces).
- Partiful homepage (`https://partiful.com/`) — visual reference for playful register (researched via WebFetch during brainstorming).
- Figma libraries already subscribed to the Mochi file: Simple Design System, Material 3, iOS 26, Mobile Wireframe UI Kit. May be referenced but Alfredo's component library is custom.
- `alfredo-implementation.md` — backend spec; informs data fields shown in screens (dietary restrictions, cuisine preferences, price range, booking contact info, confirmation numbers, tagged users, sessions).

---

## 10. Open questions (to resolve before or during implementation)

1. **Restaurant auth method** — OAuth with Google/email magic link? (Discord OAuth doesn't fit the restaurant operator persona.) Default assumption for design: email + Google OAuth buttons on R1.
2. **Dinner history data source** — is this user-scoped (Alice sees her dinners) or session-scoped (everyone in session 7A3F sees that dinner)? Default for design: user-scoped.
3. **Web availability voting auth** — magic link or Discord OAuth? Default: signed URL (no auth required to vote).
4. **"Preview card" for restaurants (R6)** — does Alfredo expose this data contract publicly, or is it an internal artifact? Default for design: shown to restaurants for transparency, with annotations.
5. **Menu editor depth** — just name + price + dietary tags, or also descriptions, photos, categories? Default: name + price + dietary tags only in v1 (matches "Profile + Menu only" scope).

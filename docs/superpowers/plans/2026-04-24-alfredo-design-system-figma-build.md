# Alfredo Design System — Figma Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the full Alfredo design system and 15 product screens inside the existing Figma file `b5aMUZrylQNRSKtt6IXoWP` ("Mochi"), following the approved spec at `docs/superpowers/specs/2026-04-24-alfredo-design-system-design.md`.

**Architecture:** Each task is one Figma MCP `use_figma` invocation that creates a specific artifact (variables, text styles, components, or screen frames) on a dedicated page. Verification after each task uses `get_screenshot` against the node just created; screenshots are saved to `docs/design-screenshots/` for progress tracking. No git commits of Figma state itself — Figma is the source of truth; we checkpoint by capturing screenshots into the repo at logical milestones.

**Tech Stack:** Figma Plugin API (via `mcp__figma__use_figma`), Figma MCP verification (`get_screenshot`, `get_metadata`, `get_design_context`). No app code.

---

## Spec Reference

Authoritative spec: `docs/superpowers/specs/2026-04-24-alfredo-design-system-design.md`.
All token values, component specs, and screen inventories come from there — this plan is the execution sequence, not a restatement.

## File Structure

Target Figma file: `b5aMUZrylQNRSKtt6IXoWP` (Mochi). Final page layout:

| Page | Artifact | Built in Phase |
|---|---|---|
| `00 — Cover` | Title card, palette strip, summary | Phase 6 |
| `01 — Foundations` | Color variables, text styles, effects, visual reference (swatches, specimen, radius/spacing/shadow, stickers) | Phase 1 |
| `02 — Components` | Figma components with variants for every entry in spec §5 | Phase 2 |
| `03 — User Screens` | Frames U1–U9 | Phases 3–4 |
| `04 — Restaurant Dashboard` | Frames R1–R6 | Phase 5 |

Screenshot output directory: `docs/design-screenshots/` (created during Phase 0).

## Checkpoint Strategy

After each phase: run `get_screenshot` on the full page, save PNG to `docs/design-screenshots/<phase>-<page>.png`, commit that screenshot with message `design: checkpoint <phase> <page>`. This gives us a scrollable history of the design even though the Figma file itself isn't in git.

## Gotchas (from Figma MCP tool descriptions)

- Font "Inter" style name is **"Semi Bold"** with a space (not "SemiBold"); same for "Extra Bold".
- Do NOT set `figma.currentPage` directly — use `await figma.setCurrentPageAsync(page)`.
- `getPluginData` is NOT supported — use `getSharedPluginData(namespace, key)`. Namespace for this project: `alfredo`.
- Before creating components, run `search_design_system` to see if the Mochi file's subscribed libraries (Simple Design System, Material 3) already have matches — use them via `importComponentByKeyAsync` rather than recreating. **Exception:** Alfredo's custom components (AvailabilityChip, ConfirmationBlock, etc.) are bespoke and should be built fresh.
- All coordinates are absolute in Figma's canvas. Use explicit `x`/`y` on every frame or lay out with auto-layout.

---

## Phase 0 — Preflight

### Task 0: File + directory preflight

**Files:**
- Create: `docs/design-screenshots/` (directory)

- [ ] **Step 1: Create the screenshots output directory**

```bash
mkdir -p /Users/vicky/Documents/Github/alfredo/docs/design-screenshots
```

- [ ] **Step 2: Verify Figma file access and list existing pages**

Tool: `mcp__figma__get_metadata`
- `fileKey`: `b5aMUZrylQNRSKtt6IXoWP`
- `nodeId`: `0:1`

Expected: response lists the Mochi file's pages. Currently only "Page 1" should exist (empty canvas per brainstorming exploration). Any new pages we create will be additions.

- [ ] **Step 3: Create the five target pages**

Tool: `mcp__figma__use_figma`
- `fileKey`: `b5aMUZrylQNRSKtt6IXoWP`
- `description`: "Create the 5 Alfredo design pages and delete the empty Page 1"
- `code`:

```javascript
const pageNames = [
  "00 — Cover",
  "01 — Foundations",
  "02 — Components",
  "03 — User Screens",
  "04 — Restaurant Dashboard"
];
const created = [];
for (const name of pageNames) {
  const page = figma.createPage();
  page.name = name;
  created.push({ id: page.id, name: page.name });
}
// Delete empty Page 1 if still empty (safety check)
const pageOne = figma.root.children.find(p => p.name === "Page 1");
if (pageOne && pageOne.children.length === 0) pageOne.remove();
return created;
```

Expected: response returns an array of 5 pages with their IDs. Record the ID of `01 — Foundations` — subsequent tasks need it.

- [ ] **Step 4: Verify page creation**

Tool: `mcp__figma__get_metadata` with `nodeId: "0:1"`. Response should list all 5 new pages.

---

## Phase 1 — Foundations page

### Task 1: Create color variables

**Files:**
- Target: Page `01 — Foundations` in file `b5aMUZrylQNRSKtt6IXoWP`

- [ ] **Step 1: Create a color variable collection "Alfredo / Color" with all 12 tokens**

Tool: `mcp__figma__use_figma`
- `description`: "Create Alfredo color variable collection with 12 named variables"
- `code`:

```javascript
const collection = figma.variables.createVariableCollection("Alfredo / Color");
const modeId = collection.modes[0].modeId;
collection.renameMode(modeId, "Light");

const hex = (h) => {
  const n = h.replace("#","");
  return {
    r: parseInt(n.slice(0,2),16)/255,
    g: parseInt(n.slice(2,4),16)/255,
    b: parseInt(n.slice(4,6),16)/255
  };
};

const tokens = [
  ["bg/base",          "#FBF2EC"],
  ["bg/raised",        "#FFFFFF"],
  ["bg/muted",         "#F5E7DD"],
  ["ink/primary",      "#1A0F0B"],
  ["ink/secondary",    "#6B5F55"],
  ["ink/tertiary",     "#A89B8F"],
  ["accent/primary",   "#E6194B"],
  ["accent/warm",      "#FFB800"],
  ["accent/peach",     "#FFD4C2"],
  ["accent/mint",      "#00B67A"],
  ["accent/grape",     "#7B5EA7"],
  ["border/default",   "#E8D9CD"],
];

const created = [];
for (const [name, value] of tokens) {
  const v = figma.variables.createVariable(name, collection, "COLOR");
  v.setValueForMode(modeId, hex(value));
  created.push({ name: v.name, id: v.id });
}
return { collectionId: collection.id, variables: created };
```

Expected: response returns a collection ID and 12 variable IDs. Store these mentally — later tasks bind them via `figma.variables.getVariableById(id)`.

- [ ] **Step 2: Verify variables exist**

Tool: `mcp__figma__use_figma`
- `code`: `return figma.variables.getLocalVariableCollections().map(c => ({ name: c.name, vars: c.variableIds.length }));`

Expected: response includes `{ name: "Alfredo / Color", vars: 12 }`.

### Task 2: Create text styles

- [ ] **Step 1: Load fonts**

Tool: `mcp__figma__use_figma`
- `description`: "Load Fraunces, Inter, and JetBrains Mono fonts"
- `code`:

```javascript
await Promise.all([
  figma.loadFontAsync({ family: "Fraunces", style: "Regular" }),
  figma.loadFontAsync({ family: "Fraunces", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "Fraunces", style: "Black" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "JetBrains Mono", style: "Medium" }),
]);
return "fonts loaded";
```

Expected: response is `"fonts loaded"`. If a font fails, the error will indicate which — Alfredo type stack requires all three families.

- [ ] **Step 2: Create the 9 text styles from spec §4.2**

Tool: `mcp__figma__use_figma`
- `description`: "Create Alfredo text styles matching the type scale"
- `code`:

```javascript
const styles = [
  ["Alfredo/Display/xl",   { family: "Fraunces", style: "Black" },     80, 84, -0.02],
  ["Alfredo/Display/lg",   { family: "Fraunces", style: "Black" },     56, 60, -0.015],
  ["Alfredo/Display/md",   { family: "Fraunces", style: "Semi Bold" }, 40, 44, -0.01],
  ["Alfredo/Heading",      { family: "Fraunces", style: "Semi Bold" }, 28, 32, 0],
  ["Alfredo/Title",        { family: "Inter",    style: "Semi Bold" }, 20, 28, 0],
  ["Alfredo/Body/lg",      { family: "Inter",    style: "Regular" },   18, 28, 0],
  ["Alfredo/Body",         { family: "Inter",    style: "Regular" },   16, 24, 0],
  ["Alfredo/Caption",      { family: "Inter",    style: "Medium" },    14, 20, 0],
  ["Alfredo/Meta",         { family: "JetBrains Mono", style: "Medium" }, 12, 16, 0.08],
];
const created = [];
for (const [name, font, size, lh, tracking] of styles) {
  const s = figma.createTextStyle();
  s.name = name;
  s.fontName = font;
  s.fontSize = size;
  s.lineHeight = { unit: "PIXELS", value: lh };
  s.letterSpacing = { unit: "PERCENT", value: tracking * 100 };
  // Uppercase transform only on Meta
  if (name.endsWith("Meta")) s.textCase = "UPPER";
  created.push({ name: s.name, id: s.id });
}
return created;
```

Expected: 9 text styles created. Verify with `figma.getLocalTextStylesAsync()` returning `>= 9`.

### Task 3: Create effect styles (shadows)

- [ ] **Step 1: Create shadow effect styles**

Tool: `mcp__figma__use_figma`
- `description`: "Create hard-offset shadow effect styles"
- `code`:

```javascript
const ink = { r: 26/255, g: 15/255, b: 11/255, a: 1 };
const mk = (name, x, y) => {
  const s = figma.createEffectStyle();
  s.name = name;
  s.effects = [{
    type: "DROP_SHADOW",
    color: ink,
    offset: { x, y },
    radius: 0,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];
  return { name: s.name, id: s.id };
};
return [
  mk("Alfredo/Shadow/card", 3, 3),
  mk("Alfredo/Shadow/cta-hover", 5, 5),
];
```

Expected: 2 effect styles created.

### Task 4: Build visual swatch grid on Foundations page

- [ ] **Step 1: Navigate to Foundations page and draw the color swatch grid**

Tool: `mcp__figma__use_figma`
- `description`: "Build color swatch grid on Foundations page"
- `code`:

```javascript
const page = figma.root.children.find(p => p.name === "01 — Foundations");
await figma.setCurrentPageAsync(page);

// Section frame
const section = figma.createFrame();
section.name = "Color Swatches";
section.resize(1200, 560);
section.x = 80; section.y = 80;
section.fills = []; // transparent
page.appendChild(section);

// Helper: find variable by name
const col = figma.variables.getLocalVariableCollections().find(c => c.name === "Alfredo / Color");
const vById = Object.fromEntries(col.variableIds.map(id => {
  const v = figma.variables.getVariableById(id);
  return [v.name, v];
}));

await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "JetBrains Mono", style: "Medium" });

const order = [
  "bg/base","bg/raised","bg/muted",
  "ink/primary","ink/secondary","ink/tertiary",
  "accent/primary","accent/warm","accent/peach",
  "accent/mint","accent/grape","border/default"
];

let x = 0, y = 0;
const SWATCH = 180, GAP = 20;
for (let i = 0; i < order.length; i++) {
  const name = order[i];
  const v = vById[name];
  const swatch = figma.createFrame();
  swatch.name = name;
  swatch.resize(SWATCH, SWATCH);
  swatch.cornerRadius = 20;
  swatch.x = (i % 6) * (SWATCH + GAP);
  swatch.y = Math.floor(i / 6) * (SWATCH + 80 + GAP);
  swatch.fills = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    v
  )];
  section.appendChild(swatch);

  const label = figma.createText();
  label.fontName = { family: "JetBrains Mono", style: "Medium" };
  label.fontSize = 12;
  label.characters = `--${name.replace("/","-")}`;
  label.x = swatch.x;
  label.y = swatch.y + SWATCH + 8;
  section.appendChild(label);
}
return section.id;
```

Expected: response returns the section's node ID. Store it for verification.

- [ ] **Step 2: Screenshot and save**

Tool: `mcp__figma__get_screenshot`
- `fileKey`: `b5aMUZrylQNRSKtt6IXoWP`
- `nodeId`: (section id from previous step)

Save the returned image to `docs/design-screenshots/phase1-colors.png`. Visually verify: 12 colored rounded squares with token names beneath.

### Task 5: Build type specimen block

- [ ] **Step 1: Create the type specimen below the color grid**

Tool: `mcp__figma__use_figma`
- `description`: "Build type specimen demonstrating each text style"
- `code`:

```javascript
const page = figma.root.children.find(p => p.name === "01 — Foundations");
const section = figma.createFrame();
section.name = "Type Specimen";
section.resize(1200, 800);
section.x = 80; section.y = 800;
section.fills = [];
section.layoutMode = "VERTICAL";
section.itemSpacing = 24;
section.paddingTop = 24; section.paddingBottom = 24;
page.appendChild(section);

const styles = await figma.getLocalTextStylesAsync();
const order = [
  "Alfredo/Display/xl",
  "Alfredo/Display/lg",
  "Alfredo/Display/md",
  "Alfredo/Heading",
  "Alfredo/Title",
  "Alfredo/Body/lg",
  "Alfredo/Body",
  "Alfredo/Caption",
  "Alfredo/Meta",
];
const samples = {
  "Alfredo/Display/xl": "Dinner, handled.",
  "Alfredo/Display/lg": "Dinner, handled.",
  "Alfredo/Display/md": "Dinner, handled.",
  "Alfredo/Heading": "Tonight at Cotogna",
  "Alfredo/Title": "Saturday, 7:00 PM",
  "Alfredo/Body/lg": "Alfredo handled the booking so you don't have to.",
  "Alfredo/Body": "Confirmation sent to your Discord channel.",
  "Alfredo/Caption": "Last updated 2 min ago",
  "Alfredo/Meta": "SESSION / 7A3F — BOOKED",
};

for (const sn of order) {
  const ts = styles.find(s => s.name === sn);
  if (!ts) continue;
  await figma.loadFontAsync(ts.fontName);
  const t = figma.createText();
  t.textStyleId = ts.id;
  t.characters = samples[sn];
  section.appendChild(t);
}
return section.id;
```

- [ ] **Step 2: Screenshot and save to `docs/design-screenshots/phase1-type.png`.**

### Task 6: Radius / spacing / shadow / sticker reference

- [ ] **Step 1: Draw a single combined reference section**

Tool: `mcp__figma__use_figma`
- `description`: "Build radius + spacing + shadow + sticker visual reference"
- `code`: (Full code: creates 4 sub-sections arranged horizontally. Radius shows 4 rounded squares labeled 8/12/20/pill. Spacing shows 9 vertical bars scaled to 4/8/12/16/24/32/48/64/96 with px labels. Shadow shows 3 cards labeled "flat", "card (3,3)", "cta-hover (5,5)". Stickers shows 11 emoji text nodes rotated ±8°.)

Complete code pattern — agent should follow this structure:

```javascript
const page = figma.root.children.find(p => p.name === "01 — Foundations");
const root = figma.createFrame();
root.name = "Radius / Spacing / Shadow / Stickers";
root.resize(1200, 420);
root.x = 80; root.y = 1680;
root.fills = [];
root.layoutMode = "HORIZONTAL";
root.itemSpacing = 48;
page.appendChild(root);

// ── Radius sub-section ──
const radiusSec = figma.createFrame();
radiusSec.name = "radius";
radiusSec.layoutMode = "HORIZONTAL";
radiusSec.itemSpacing = 16;
radiusSec.fills = [];
root.appendChild(radiusSec);
for (const [label, r] of [["8",8],["12",12],["20",20],["pill",9999]]) {
  const sq = figma.createFrame();
  sq.resize(64, 64);
  sq.cornerRadius = r;
  sq.fills = [{type:"SOLID", color:{r:1, g:0.09, b:0.29}}]; // cherry
  radiusSec.appendChild(sq);
}

// ── Spacing sub-section ──
const spacingSec = figma.createFrame();
spacingSec.name = "spacing";
spacingSec.layoutMode = "HORIZONTAL";
spacingSec.counterAxisAlignItems = "MAX"; // bottom-align
spacingSec.itemSpacing = 12;
spacingSec.fills = [];
root.appendChild(spacingSec);
for (const px of [4,8,12,16,24,32,48,64,96]) {
  const bar = figma.createFrame();
  bar.resize(12, px);
  bar.fills = [{type:"SOLID", color:{r:26/255, g:15/255, b:11/255}}];
  spacingSec.appendChild(bar);
}

// ── Shadow sub-section ──
const shadowSec = figma.createFrame();
shadowSec.name = "shadow";
shadowSec.layoutMode = "HORIZONTAL";
shadowSec.itemSpacing = 24;
shadowSec.fills = [];
root.appendChild(shadowSec);
const shadowStyles = await figma.getLocalEffectStylesAsync();
const cardStyle = shadowStyles.find(s => s.name === "Alfredo/Shadow/card");
for (const [label, styleId] of [["flat", null], ["card", cardStyle && cardStyle.id]]) {
  const c = figma.createFrame();
  c.resize(96, 96);
  c.cornerRadius = 20;
  c.fills = [{type:"SOLID", color:{r:1,g:1,b:1}}];
  if (styleId) c.effectStyleId = styleId;
  shadowSec.appendChild(c);
}

// ── Stickers sub-section ──
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
const stickerSec = figma.createFrame();
stickerSec.name = "stickers";
stickerSec.layoutMode = "HORIZONTAL";
stickerSec.itemSpacing = 12;
stickerSec.fills = [];
root.appendChild(stickerSec);
for (const e of ["🍝","🍷","🥗","🍕","🌶️","🎉","🔥","⭐️","💌"]) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: "Regular" };
  t.fontSize = 40;
  t.characters = e;
  t.rotation = (Math.random() * 16) - 8;
  stickerSec.appendChild(t);
}

return root.id;
```

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase1-misc.png`.**

### Task 7: Commit Phase 1 screenshots

- [ ] **Step 1: Stage and commit**

```bash
git add docs/design-screenshots/phase1-*.png
git commit -m "design: checkpoint phase 1 foundations (colors, type, misc)"
```

---

## Phase 2 — Components page

Each task below builds one component set via `use_figma`. Place them on `02 — Components` in a 1200-wide auto-layout column, 64 vertical gap. Each component gets a section header (Heading text style) above the variants row.

### Task 8: Button component set

- [ ] **Step 1: Build primary / secondary / ghost / icon button variants**

Tool: `mcp__figma__use_figma`
- `description`: "Build Button component set with 4 type variants × 3 size variants"
- Code outline (agent writes full body):
  - Create a component set at x=80, y=80 on page `02 — Components`.
  - Create 12 component variants named `type=primary, size=sm` ... `type=icon, size=lg`.
  - Variant properties: `type ∈ {primary, secondary, ghost, icon}`, `size ∈ {sm, md, lg}`.
  - Apply: pill radius, `accent/primary` fill for primary, `ink/primary` outline for secondary, `bg-transparent` + underline for ghost, 44×44 for icon with centered emoji placeholder.
  - Typography: sm = `Alfredo/Caption`, md = `Alfredo/Body`, lg = `Alfredo/Title`.
  - Primary has `Alfredo/Shadow/card` effect style.

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-01-buttons.png`.**

### Task 9: Form primitives component set

- [ ] **Step 1: Build Input, Textarea, Select, Checkbox, Toggle, FormRow**

Tool: `mcp__figma__use_figma`
- `description`: "Build Form component sets: Input, Textarea, Select, Checkbox, Toggle, FormRow"
- Place below Buttons.
- Input: 12r, `bg/muted` fill, 48h, 400w default, Inter Body text; variants `state ∈ {default, focused, filled, disabled}`.
- Textarea: same treatment, 120h min, resizable indicator.
- Select: Input + trailing chevron (ChevronDown icon as vector).
- Checkbox: 20×20, 4r, unchecked = 1.5px `ink-primary` border, checked = `accent/primary` fill with white checkmark vector. Variants `state ∈ {unchecked, checked}`.
- Toggle: 44×24 pill, off = `bg/muted`, on = `accent/primary`. Variants `state ∈ {off, on}`.
- FormRow: auto-layout vertical 8 gap → Label (Alfredo/Caption ink-secondary) + Input + Helper (Alfredo/Caption ink-tertiary).

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-02-forms.png`.**

### Task 10: Data display components

- [ ] **Step 1: Build Tag/Chip, Badge, Avatar, AvatarStack, Divider**

Tool: `mcp__figma__use_figma`
- Place below Forms.
- Tag: pill 28h, `accent/peach` fill, `ink/primary` Caption text. Variants: `emoji ∈ {none, leading}`, `close ∈ {false, true}`. Emoji slot 16×16.
- Badge: inline row — 8×8 colored dot + Meta text. Variants `tone ∈ {booked, urgent, event, info}` mapping to mint / primary / grape / ink-secondary.
- Avatar: circle 32 / 48 / 64. Variants `size` and `content ∈ {image, initials, dot}`. Initials in Inter Semi Bold centered.
- AvatarStack: auto-layout horizontal with -8 gap. Placeholder for 3 avatars.
- Divider: 1.5 dashed line `border/default`, horizontal and vertical variants.

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-03-data.png`.**

### Task 11: Container components

- [ ] **Step 1: Build Card, CalloutBlock, StickerBlock, MetadataRow**

Tool: `mcp__figma__use_figma`
- Card: 400×240 default, `radius-lg`, `bg/raised` fill, `Alfredo/Shadow/card`, 24 padding, auto-layout vertical slot.
- CalloutBlock: `accent/warm` fill at 12r, 20 padding, auto-layout vertical. Intended for "why Alfredo picked it" copy.
- StickerBlock: like Card but with a rotated emoji overlap positioned absolutely at top-right (−12 x offset, −12 y offset from card corner, rotation 8°).
- MetadataRow: auto-layout horizontal 8 gap, alternating Meta text + middle-dot `·` separator; create with 3 slots.

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-04-containers.png`.**

### Task 12: Navigation components

- [ ] **Step 1: Build TopBar, Footer**

Tool: `mcp__figma__use_figma`
- TopBar: 1440×72, `bg/base` fill, horizontal auto-layout space-between, 32 side padding. Left slot: wordmark "Alfredo" in Heading style + 8×8 cherry dot (circle, `accent/primary`). Middle slot: Meta text breadcrumb placeholder. Right slot: 44×44 icon button placeholder.
- Footer: 1440×96, horizontal auto-layout, Meta text link list, `ink/tertiary` text, 24 gap, `bg/base`.

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-05-nav.png`.**

### Task 13: Domain components

- [ ] **Step 1: Build AvailabilityChip, PartyMemberRow, RestaurantCard, ConfirmationBlock, PromoSticker**

Tool: `mcp__figma__use_figma`
- AvailabilityChip: pill 44h, 16 horizontal padding. Variants `state ∈ {default, selected, disabled}`. default = 1.5 `ink-primary` outline on `bg/raised`. selected = `accent/primary` fill with white text. disabled = `bg/muted` with strikethrough.
- PartyMemberRow: horizontal auto-layout 12 gap — Avatar (32) + Body text name + Tag (dietary, emoji leading).
- RestaurantCard: 320×380 fixed. Image top (aspect 4:3, 20r), Title name, MetadataRow (cuisine · neighborhood · price), AvatarStack of 3 dietary Tags. Card treatment from Task 11.
- ConfirmationBlock: 520×220 card with `ink/primary` fill, padding 32. Inside: Meta "CONFIRMATION NUMBER" in `accent/mint`, below it Display/lg in `accent/mint` placeholder `"A47X9KLM"`, below that Meta `bg/muted` tinted line "Issued 2:14 PM · OpenTable". Inspired by existing `screenshot-booked.png` — implementer should load that screenshot as layout reference before building.
- PromoSticker: StickerBlock variant with "NEW" / "TRENDING" / "LOVED" Meta text centered, rotated −6°, with `accent/grape` fill.

- [ ] **Step 2: Screenshot, save to `docs/design-screenshots/phase2-06-domain.png`.**

### Task 14: Commit Phase 2 screenshots

- [ ] **Step 1: Stage and commit**

```bash
git add docs/design-screenshots/phase2-*.png
git commit -m "design: checkpoint phase 2 components"
```

---

## Phase 3 — Landing reference screen (U1)

### Task 15: Build U1 Landing

**Purpose:** This is the reference screen that validates the entire token + component system before cascading. If it doesn't feel right, fix it here before building the remaining 14 screens.

- [ ] **Step 1: Build the Landing frame on `03 — User Screens`**

Tool: `mcp__figma__use_figma`
- `description`: "Build U1 Landing screen on 03 — User Screens page, 1440w"
- Layout spec:
  - Frame `U1 / Landing` 1440×1080, `bg/base` fill, vertical auto-layout (no gap, free positioning within).
  - TopBar at top.
  - Hero section: 1440×720. Left column (760w, starts at x=80): Meta label `A DISCORD BOT FOR PEOPLE WHO ACTUALLY WANT TO EAT DINNER` in `accent/primary`. Below, a 3-line Display/xl headline: `"Dinner,\nhandled."` in `ink/primary`. A rotated 🍝 sticker at 72px rotated −6° absolutely positioned near the period of "handled."
  - Right column (560w): Meta `WHAT IT DOES` in `accent/primary`, then Body/lg copy: "Tag your friends in Discord with /alfredo. Alfredo reads your chat, DMs each friend for availability, picks a restaurant that fits your group's dietary prefs and budget, and books it autonomously via OpenTable. No app switching. No 'what are you craving' text threads. No coordination overhead." Then a primary Button lg "Try /alfredo on Discord" with trailing arrow emoji.
  - How-it-works strip: 1440×240 at `bg/muted`. 3 columns "01 / Type /alfredo @friends", "02 / Friends vote availability", "03 / Alfredo picks + books". Each with Display/md number in `accent/primary`, Title heading in `ink/primary`, Body copy in `ink/secondary`.
  - Footer at bottom.

- [ ] **Step 2: Screenshot and save to `docs/design-screenshots/phase3-u1-landing.png`.**

- [ ] **Step 3: CHECKPOINT — user review gate**

Pause. Present the landing screenshot to the user. Ask: "Does the landing feel right as the reference screen? I'll pattern the remaining 14 on this. Any adjustments to tokens, typography, or layout rhythm before we cascade?"

Only proceed to Phase 4 on explicit approval. If adjustments are requested, loop back to Phase 1/2/3 as needed and re-screenshot.

- [ ] **Step 4: Commit**

```bash
git add docs/design-screenshots/phase3-u1-landing.png
git commit -m "design: checkpoint phase 3 landing reference"
```

---

## Phase 4 — Remaining user screens (U2–U9)

Each task: one `use_figma` call creating one frame on `03 — User Screens`, followed by a screenshot and save. Place frames left-to-right at y=1200, y=2400, etc., in rows of 2 separated by 120px gap.

Frame naming convention: `U2 / Invite`, `U3 / Availability`, etc.

### Task 16: U2 Invite / Share

- [ ] **Step 1: Build U2 frame**

Layout: 1440×1080. Centered invite card 720w on `bg/base`.
Card contents:
- Large StickerBlock: `accent/warm` butter fill, rotated 🍝 sticker top-left. Meta "FRIDAY NIGHT" + Display/lg `"Alfredo's picking."`
- PartyMemberRow list (5 members: host + 4 tagged), showing status dots (🟢 responded, 🟡 pending).
- AvailabilityChip preview (4 options, none selected yet — this is the share view, not the voting view).
- Primary Button lg "Join the vote" full-width.
- Meta footer: "Powered by Alfredo · Expires in 23:41"

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u2-invite.png`.**

### Task 17: U3 Web availability voting

- [ ] **Step 1: Build U3**

Layout: 1440×1080. TopBar with breadcrumb `SESSION / 7A3F · VOTING`.
- Centered Heading `When are you free, Alice?` (Fraunces Semi Bold 40).
- Body Body/lg `Tap all the slots that work. We'll match against your crew.`
- 2×2 grid of AvailabilityChips (large, 180w × 120h version — create as a one-off frame matching the component's selected/unselected states but upscaled for landing).
- Below: progress strip `3 of 5 friends voted` + AvatarStack of respondents.
- Primary Button lg "Submit".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u3-availability.png`.**

### Task 18: U4 Setup (token-gated first-time form)

- [ ] **Step 1: Build U4**

Layout: 1440×1280. TopBar with breadcrumb `SETUP · ALICE`.
- Heading `Set your dinner profile` + Body/lg subtitle.
- Two-column: left 760 form / right 480 live preview card showing how Alfredo will see you.
- Form sections: Dietary restrictions (Tag multi-select with emoji), Cuisine preferences (Tag multi-select), Price range (3-option toggle: Budget / Mid / Upscale), Booking contact (FormRow Name / Phone / Email).
- Primary Button lg "Save and back to Discord".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u4-setup.png`.**

### Task 19: U5 Profile editor (returning user)

- [ ] **Step 1: Build U5**

Same layout as U4, but:
- TopBar breadcrumb `PROFILE · ALICE`.
- Heading `Your dinner profile`.
- Body/lg subtitle `Last updated April 18`.
- Fields pre-filled with example data (🥗 vegetarian, 🌶️ spicy-ok, cuisine tags: Italian / Japanese / Mexican, price: Mid).
- Secondary "Cancel" + Primary "Save changes" button pair at bottom.

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u5-profile.png`.**

### Task 20: U6 Booking confirmation

- [ ] **Step 1: Build U6**

Layout: 1440×1080. TopBar with breadcrumb `SESSION / 7A3F · BOOKED`.
- Badge `●  BOOKED · CONFIRMED VIA OPENTABLE` (mint tone).
- Display/xl `Cotogna.` with period emphasis (Fraunces Black 80).
- MetadataRow `Saturday · April 26 · 7:00 PM · 5 people · Jackson Square`.
- Two-column: left ConfirmationBlock (reuses component), right CalloutBlock "Why Alfredo picked it" with Body copy.
- PartyMemberRow list (5 members with dietary tags).
- Action row: Primary Button "+ Add to calendar", Secondary Button "View on OpenTable", Ghost Button "Share".
- Load existing `screenshot-booked.png` as visual reference before building.

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u6-booking.png`.**

### Task 21: U7 Fallback (couldn't auto-book)

- [ ] **Step 1: Build U7**

Layout: 1440×1080. TopBar with breadcrumb `SESSION / 7A3F · READY`.
- Badge `●  READY TO BOOK · OPENTABLE LINK READY` (warm/butter tone).
- Display/lg `Cotogna.`
- MetadataRow (same as U6).
- Primary Button lg "Book on OpenTable →" (cherry, prominent).
- CalloutBlock "Alfredo found the perfect spot but couldn't grab the reservation automatically — tap through to finish."
- Below: CalloutBlock "Why Alfredo picked it" reasoning.

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u7-fallback.png`.**

### Task 22: U8 Dinner history

- [ ] **Step 1: Build U8**

Layout: 1440×1200. TopBar with breadcrumb `ALICE · HISTORY`.
- Heading `4 dinners, 0 arguments.` (Fraunces Semi Bold 40).
- Compact session card list: 4 cards stacked vertically, each 1280w × 120h horizontal auto-layout:
  - Restaurant image thumbnail (80×80, 16r, left).
  - Title restaurant name + Meta date.
  - Body "Booked via OpenTable · 5 people" with dietary Tag row.
  - Right: Badge (mint for booked, warm for fallback) + chevron icon.

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u8-history.png`.**

### Task 23: U9 Token landing / OAuth handoff

- [ ] **Step 1: Build U9**

Layout: 1440×1080. No TopBar (bare flow).
- Centered card 560w: Meta "ALFREDO · SETUP" + Display/md `Hey Alice 👋`.
- Body/lg `Victoria tagged you for dinner Friday night. Takes ~60 seconds to set up your food profile so Alfredo can pick something you'll actually enjoy.`
- Primary Button lg "Continue with Discord" (Discord-blue-tinted, with Discord emoji 🎮 or logo placeholder).
- Meta helper "We use Discord just to confirm who you are. Zero access to your messages."

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase4-u9-token.png`.**

### Task 24: Phase 4 commit

- [ ] **Step 1: Commit all phase 4 screenshots**

```bash
git add docs/design-screenshots/phase4-*.png
git commit -m "design: checkpoint phase 4 user screens (U2-U9)"
```

---

## Phase 5 — Restaurant dashboard screens (R1–R6)

Frames on `04 — Restaurant Dashboard` page, same layout conventions as Phase 4.

### Task 25: R1 Signup / OAuth

- [ ] **Step 1: Build R1**

Layout: 1440×1080. No TopBar.
- Left 720-col: `bg/muted` fill, padded. Display/lg `"List your restaurant.\nLet Alfredo send you full tables."`. Body/lg supporting copy. Meta `NO SETUP FEE · NO PER-BOOKING FEE`.
- Right 720-col: `bg/base`. Centered card 480w, Heading `Create your account`, form: Email Input, Password Input, Primary Button "Create account". Secondary Button "Continue with Google" (with Google logo placeholder).

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase5-r1-signup.png`.**

### Task 26: R2a/R2b/R2c Onboarding wizard (3 frames)

- [ ] **Step 1: Build 3 adjacent frames representing steps 1, 2, 3 of the wizard**

Each frame 1440×1080. Common elements: TopBar with breadcrumb `ONBOARDING · STEP N/3`, horizontal step indicator (3 dots, current one cherry).
- **R2a (Step 1/3 — Basics):** Heading `Tell us about your restaurant`. Form: Name Input, Neighborhood Input, Cuisine Tag multi-select (12 options with emoji), Vibe Tag multi-select (chill / date / business / celebration).
- **R2b (Step 2/3 — Hours):** Heading `When are you open?`. Day-row grid: each row has day label + open/closed toggle + two time Inputs (open/close). Plus "Lunch / Dinner split" toggle.
- **R2c (Step 3/3 — Photos):** Heading `Show off your space`. Photo upload area (4 slots arranged 2×2, dashed border, `bg/muted`, Meta "Drag photo or click to upload"). Progress text "0 of 4 uploaded".

- [ ] **Step 2: Screenshot all three frames together → `docs/design-screenshots/phase5-r2-onboarding.png` (use page-level screenshot).**

### Task 27: R3 Restaurant profile editor

- [ ] **Step 1: Build R3**

Layout: 1440×1280. TopBar with breadcrumb `COTOGNA · PROFILE`.
- Heading `Your Alfredo listing` + Meta "Saved 2 minutes ago".
- Two-column: left 860 editor, right 520 sticky live preview.
- Editor sections (stacked, 48 gap): Basics (name, neighborhood, address), Cuisine + Vibe tags, Hours (compact version of R2b), Price range toggle (Budget / Mid / Upscale).
- Right column: live RestaurantCard showing current values.
- Sticky bottom action bar: Secondary "Discard" + Primary "Save changes".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase5-r3-profile.png`.**

### Task 28: R4 Menu editor

- [ ] **Step 1: Build R4**

Layout: 1440×1280. TopBar with breadcrumb `COTOGNA · MENU`.
- Heading `Menu highlights` + Body subtitle "Alfredo uses these to reason about dietary fit."
- Dish list: 6 repeating rows, each 1280w × 80h card.
  - Row contents (horizontal auto-layout): 56×56 dish image thumbnail, Title dish name + Meta cuisine category, Tag row (🥗 vegetarian, 🌶️ spicy), Price Body/lg right-aligned, IconButton trash.
- Below list: Primary Button lg "+ Add dish".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase5-r4-menu.png`.**

### Task 29: R5 Settings

- [ ] **Step 1: Build R5**

Layout: 1440×1080. TopBar with breadcrumb `COTOGNA · SETTINGS`.
- Heading `Settings`.
- Left sidebar 240w (Inter Semi Bold Tag-style links): Account · Notifications · Booking contacts · Billing placeholder · Delete.
- Right content 1040w: shown panel = Account. FormRows: Email (read-only Meta), Password change link (ghost button), Two-factor Toggle.
- Divider · "Danger zone" Heading · Secondary Button in cherry outline "Deactivate restaurant".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase5-r5-settings.png`.**

### Task 30: R6 Agent preview card

- [ ] **Step 1: Build R6**

Layout: 1440×1080. TopBar with breadcrumb `COTOGNA · AGENT VIEW`.
- Heading `This is what Alfredo sees.`
- Body/lg "Every field below is used by the agent when matching your restaurant to a group. Annotations explain which field influences which signal."
- Centered RestaurantCard (upscaled to 480w), with 4 annotation callouts positioned absolutely: dotted arrows pointing to fields, each ending in a CalloutBlock with Caption-size copy.
  - Annotation 1 (points to cuisine tags): "Hard match with group cuisine preference"
  - Annotation 2 (points to dietary tags): "Strict filter — vegetarian / gluten-free etc. are hard constraints"
  - Annotation 3 (points to price): "Matched against group budget signal"
  - Annotation 4 (points to vibe): "Soft match from recent chat context"
- Below: Ghost Button "Learn how Alfredo ranks restaurants".

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase5-r6-preview.png`.**

### Task 31: Phase 5 commit

- [ ] **Step 1: Commit**

```bash
git add docs/design-screenshots/phase5-*.png
git commit -m "design: checkpoint phase 5 restaurant dashboard (R1-R6)"
```

---

## Phase 6 — Cover page

### Task 32: Build Cover

- [ ] **Step 1: Build cover frame on `00 — Cover`**

Tool: `mcp__figma__use_figma`
- Layout: 1440×900 frame, `bg/base`.
- Top-left: Meta `ALFREDO · DESIGN SYSTEM + SCREENS` in `accent/primary`.
- Center: Display/xl `"Dinner,\nhandled."` with red dot next to "handled."
- Below: Meta row — date (e.g., `APR 24 2026`), version (`v1.0`), author (`Built via Claude Code`).
- Strip along bottom: 12 color swatches in a row (64×64 each, matching token order from Phase 1 Task 4).
- Rotated 🍝 sticker top-right corner.

- [ ] **Step 2: Screenshot → `docs/design-screenshots/phase6-cover.png`.**

### Task 33: Phase 6 commit

- [ ] **Step 1: Commit**

```bash
git add docs/design-screenshots/phase6-cover.png
git commit -m "design: checkpoint phase 6 cover"
```

---

## Phase 7 — QA sweep

### Task 34: Full-file screenshot sweep

- [ ] **Step 1: Screenshot each page at page level, save final artifacts**

For each of the 5 pages, call `get_screenshot` at the page's root node (get node ID via `get_metadata` on `0:1`), save to `docs/design-screenshots/final-<page>.png`.

- [ ] **Step 2: Commit final screenshot set**

```bash
git add docs/design-screenshots/final-*.png
git commit -m "design: final page screenshots"
```

### Task 35: Token consistency audit

- [ ] **Step 1: Run an automated audit via `use_figma`**

Tool: `mcp__figma__use_figma`
- `description`: "Audit all fills in all frames to ensure they bind to color variables, not raw hex"
- `code`:

```javascript
const pages = figma.root.children.filter(p => p.name.startsWith("0"));
const issues = [];
function walk(node) {
  if ("fills" in node && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.type === "SOLID" && !fill.boundVariables?.color) {
        // Acceptable exceptions: pure white, pure transparent, decorative overrides
        const {r,g,b} = fill.color;
        const isWhite = r === 1 && g === 1 && b === 1;
        if (!isWhite) {
          issues.push({
            page: node.parent?.name,
            name: node.name,
            color: `rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`
          });
        }
      }
    }
  }
  if ("children" in node) node.children.forEach(walk);
}
pages.forEach(walk);
return { issuesCount: issues.length, sample: issues.slice(0, 20) };
```

Expected: `issuesCount` should be ≤5 (some decorative stickers and one-offs may legitimately use raw colors). If >5, the agent reviews the sample and converts raw fills to variable bindings on subsequent `use_figma` calls before closing out.

- [ ] **Step 2: Final commit**

```bash
git add docs/design-screenshots/
git commit -m "design: QA sweep complete"
```

---

## Completion

At the end of Task 35, the Figma file `b5aMUZrylQNRSKtt6IXoWP` contains:
- 5 pages with all artifacts per spec
- Color variable collection (12 tokens), 9 text styles, 2 effect styles
- Component library for 14 component sets
- 15 screen frames (9 user + 6 restaurant)
- A cover page

The repo `docs/design-screenshots/` contains phase checkpoints + final page screenshots, committed across ~7 commits.

The implementation skill terminates here. Next logical step (outside this plan's scope): generate shadcn token exports from the Figma variables and scaffold a Next.js + shadcn app that consumes them — but that is a separate implementation plan.

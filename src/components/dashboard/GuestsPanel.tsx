import {
  FaCircle,
  FaEnvelope,
  FaStar,
  FaUser,
  FaUtensils,
  FaWallet,
  FaCalendar,
  FaClockRotateLeft,
} from "react-icons/fa6";
import type { ReactNode } from "react";

type GuestTier = "vip" | "regular" | "new";

type DietarySeverity = "critical" | "warning" | "info" | "none";

interface Guest {
  id: string;
  name: string;
  email: string;
  accentColor: string;
  visits: number;
  lastVisit: string;
  lifetimeSpend: number;
  dietary?: string[];
  tier: GuestTier;
}

// Hardcoded demo guestbook — real version reads from the Ghost DB guests
// table, joined to session.tagged_users and aggregated by name+email.
const GUESTS: Guest[] = [
  {
    id: "g-001",
    name: "Victoria Wang",
    email: "victoria@tuilux.tech",
    accentColor: "#F04E55",
    visits: 14,
    lastVisit: "Apr 22, 2026",
    lifetimeSpend: 2480,
    dietary: ["Pescatarian"],
    tier: "vip",
  },
  {
    id: "g-002",
    name: "Marcus Chen",
    email: "marcus.c@hey.com",
    accentColor: "#1132F5",
    visits: 9,
    lastVisit: "Apr 18, 2026",
    lifetimeSpend: 1640,
    tier: "vip",
  },
  {
    id: "g-003",
    name: "Priya Mehta",
    email: "priya.mehta@fastmail.com",
    accentColor: "#6840FF",
    visits: 7,
    lastVisit: "Apr 12, 2026",
    lifetimeSpend: 1280,
    dietary: ["Gluten-free"],
    tier: "regular",
  },
  {
    id: "g-004",
    name: "Jordan Kim",
    email: "jordan@kim.studio",
    accentColor: "#D8A14A",
    visits: 5,
    lastVisit: "Apr 09, 2026",
    lifetimeSpend: 920,
    tier: "regular",
  },
  {
    id: "g-005",
    name: "Emma Thompson",
    email: "emma.t@proton.me",
    accentColor: "#6840FF",
    visits: 4,
    lastVisit: "Apr 05, 2026",
    lifetimeSpend: 760,
    dietary: ["Tree-nut allergy"],
    tier: "regular",
  },
  {
    id: "g-006",
    name: "David Park",
    email: "d.park@gmail.com",
    accentColor: "#F59E0B",
    visits: 4,
    lastVisit: "Apr 04, 2026",
    lifetimeSpend: 690,
    tier: "regular",
  },
  {
    id: "g-007",
    name: "Sophia Reyes",
    email: "sophia.reyes@icloud.com",
    accentColor: "#2ECC71",
    visits: 3,
    lastVisit: "Mar 29, 2026",
    lifetimeSpend: 540,
    dietary: ["Vegetarian"],
    tier: "regular",
  },
  {
    id: "g-008",
    name: "Chen Wei",
    email: "chen.wei@outlook.com",
    accentColor: "#1132F5",
    visits: 2,
    lastVisit: "Mar 25, 2026",
    lifetimeSpend: 380,
    tier: "regular",
  },
  {
    id: "g-009",
    name: "Isabella García",
    email: "isabella.g@posteo.net",
    accentColor: "#F04E55",
    visits: 2,
    lastVisit: "Mar 21, 2026",
    lifetimeSpend: 340,
    dietary: ["Dairy-free"],
    tier: "regular",
  },
  {
    id: "g-010",
    name: "Marcus Okafor",
    email: "marcus@okafor.co",
    accentColor: "#C45538",
    visits: 1,
    lastVisit: "Apr 20, 2026",
    lifetimeSpend: 1120,
    tier: "new",
  },
  {
    id: "g-011",
    name: "Lena Müller",
    email: "lena.mueller@mailbox.org",
    accentColor: "#D8A14A",
    visits: 1,
    lastVisit: "Apr 17, 2026",
    lifetimeSpend: 240,
    dietary: ["Shellfish allergy"],
    tier: "new",
  },
  {
    id: "g-012",
    name: "Ben Sato",
    email: "ben.sato@hey.com",
    accentColor: "#8AB14B",
    visits: 1,
    lastVisit: "Apr 15, 2026",
    lifetimeSpend: 310,
    tier: "new",
  },
  {
    id: "g-013",
    name: "Amara Okonkwo",
    email: "amara@okonkwo.design",
    accentColor: "#6B8B71",
    visits: 1,
    lastVisit: "Apr 11, 2026",
    lifetimeSpend: 180,
    tier: "new",
  },
];

// Columns: guest (avatar + name), email, visits, last visit, lifetime
// spend, dietary, tier. Same grid is shared by the header and every
// data row so cells line up under their captions. Email gets its own
// flex column instead of sharing a subtitle with the name.
const GRID_COLUMNS =
  "minmax(0,1fr) minmax(0,1fr) 64px 108px 88px 180px 88px";

/**
 * Guestbook — flat list of everyone who has booked with the restaurant,
 * sorted by visits desc then lifetime spend desc. Shares the same table
 * grammar as Tonight's Reservations (dop-card + hairline rows + pastel
 * pills) so operators can pattern-match between the two surfaces.
 */
export function GuestsPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main className="dop-no-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-16 pt-10">
        <header className="flex shrink-0 flex-col gap-3">
          <h1 className="hero-title">Guestbook</h1>
        </header>

        {/* shrink-0 stops the flex-col ancestor from compressing the card
         *  below its natural content height; without it the last guest
         *  row gets clipped and reads as a phantom divider line. */}
        <section className="dop-card shrink-0 overflow-hidden">
          <div
            className="grid items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-5 py-3 text-[14px]"
            style={{
              gridTemplateColumns: GRID_COLUMNS,
              fontWeight: 600,
              fontVariationSettings: "'wght' 600",
              letterSpacing: "-0.005em",
              color: "var(--color-fg-tertiary)",
            }}
          >
            <HeaderCell icon={<FaUser size={11} />} label="Guest" />
            <HeaderCell icon={<FaEnvelope size={11} />} label="Email" />
            <HeaderCell icon={<FaCalendar size={11} />} label="Visits" />
            <HeaderCell
              icon={<FaClockRotateLeft size={11} />}
              label="Last visit"
            />
            <HeaderCell icon={<FaWallet size={11} />} label="Spend" />
            <HeaderCell icon={<FaUtensils size={11} />} label="Dietary" />
            <HeaderCell icon={<FaStar size={11} />} label="Tier" />
          </div>

          <div>
            {GUESTS.map((g, i) => (
              <GuestRow
                key={g.id}
                guest={g}
                isLast={i === GUESTS.length - 1}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function GuestRow({ guest: g, isLast }: { guest: Guest; isLast: boolean }) {
  const severity = dietarySeverity(g.dietary);
  const dotColor = severityColor(severity);
  return (
    <div
      className={`grid items-center gap-2 px-5 py-4 transition-colors hover:bg-[var(--color-surface-hover)] ${
        isLast ? "" : "border-b border-[var(--color-border-subtle)]"
      }`}
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      {/* Guest — avatar + name. Name is the only cell at weight 510;
       *  every other cell is 14px / normal weight so the eye doesn't
       *  have to step across a mixed-weight row. */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{
            background: g.accentColor,
            fontVariationSettings: "'wght' 600",
          }}
          aria-hidden
        >
          {initials(g.name)}
        </div>
        <span
          className="truncate text-[14px] text-[var(--color-fg-strong)]"
          style={{
            fontWeight: 510,
            fontVariationSettings: "'wght' 510",
            letterSpacing: "-0.005em",
          }}
        >
          {g.name}
        </span>
      </div>

      {/* Email */}
      <span
        className="min-w-0 truncate text-[14px] text-[var(--color-fg-secondary)]"
        style={{
          fontWeight: 400,
          fontVariationSettings: "'wght' 400",
          letterSpacing: "-0.005em",
        }}
        title={g.email}
      >
        {g.email}
      </span>

      {/* Visits */}
      <span
        className="text-[14px] tabular-nums text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 400,
          fontVariationSettings: "'wght' 400",
          letterSpacing: "-0.005em",
        }}
      >
        {g.visits}
      </span>

      {/* Last visit */}
      <span
        className="truncate text-[14px] tabular-nums text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 400,
          fontVariationSettings: "'wght' 400",
          letterSpacing: "-0.005em",
        }}
      >
        {g.lastVisit}
      </span>

      {/* Lifetime spend */}
      <span
        className="text-[14px] tabular-nums text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 400,
          fontVariationSettings: "'wght' 400",
          letterSpacing: "-0.005em",
        }}
      >
        {formatMoney(g.lifetimeSpend)}
      </span>

      {/* Dietary — pastel tag (category shape) or dashed em-dash */}
      <div className="flex items-center">
        {dotColor && g.dietary ? (
          <span
            className="inline-flex h-[22px] items-center gap-1.5 rounded-[2px] px-2 text-[11px]"
            style={{
              background: DIETARY_BG[severity] ?? "#E3E2E0",
              color: "var(--color-fg-strong)",
              fontWeight: 510,
              fontVariationSettings: "'wght' 510",
              letterSpacing: "-0.005em",
            }}
          >
            <FaCircle size={6} style={{ color: dotColor }} />
            <span className="truncate">{g.dietary.join(", ")}</span>
          </span>
        ) : (
          <span className="text-[13px] text-[var(--color-fg-faint)]">—</span>
        )}
      </div>

      {/* Tier — live state pill (rounded-full) */}
      <div className="flex items-center">
        <TierPill tier={g.tier} />
      </div>
    </div>
  );
}

const TIER_STYLES: Record<GuestTier, { label: string; bg: string; dot: string }> =
  {
    vip: {
      label: "VIP",
      bg: "#FDECC8",
      dot: "var(--color-status-amber)",
    },
    regular: {
      label: "Regular",
      bg: "#DBEDDB",
      dot: "var(--color-status-green)",
    },
    new: {
      label: "New",
      bg: "#D8E2FE",
      dot: "var(--color-accent)",
    },
  };

function TierPill({ tier }: { tier: GuestTier }) {
  const { label, bg, dot } = TIER_STYLES[tier];
  return (
    <span
      className="inline-flex h-[22px] items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[12px]"
      style={{
        background: bg,
        color: "var(--color-fg-strong)",
        fontWeight: 510,
        fontVariationSettings: "'wght' 510",
        letterSpacing: "-0.005em",
      }}
    >
      <FaCircle size={6} style={{ color: dot }} />
      {label}
    </span>
  );
}

// Allergy risk classifier — shares the rubric with DetailPanel.tsx so a
// guest flagged "critical" in the guestbook reads the same as in the
// reservation panel.
function dietarySeverity(dietary: string[] | undefined): DietarySeverity {
  if (!dietary || dietary.length === 0) return "none";
  const joined = dietary.join(" ").toLowerCase();
  if (/peanut|tree[- ]?nut|\bnut\b|shellfish|fish allergy|sesame/.test(joined))
    return "critical";
  if (/gluten|celiac|dairy|lactose|egg allergy|soy allergy/.test(joined))
    return "warning";
  return "info";
}

function severityColor(s: DietarySeverity): string | null {
  if (s === "critical") return "var(--color-status-red)";
  if (s === "warning") return "var(--color-status-amber)";
  if (s === "info") return "var(--color-status-green)";
  return null;
}

const DIETARY_BG: Record<DietarySeverity, string | undefined> = {
  critical: "#FBE4E4",
  warning: "#FDECC8",
  info: "#DBEDDB",
  none: undefined,
};

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

interface HeaderCellProps {
  icon: ReactNode;
  label: string;
}

function HeaderCell({ icon, label }: HeaderCellProps) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="flex shrink-0 items-center text-[var(--color-fg-faint)]"
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}

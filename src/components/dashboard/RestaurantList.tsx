import type { ReactNode } from "react";
import {
  FaChevronRight,
  FaHashtag,
  FaClock,
  FaUsers,
  FaUser,
  FaArrowRightArrowLeft,
  FaCircleDot,
  FaCircle,
} from "react-icons/fa6";
import type {
  BookingSource,
  ConfirmationState,
  Restaurant,
} from "@/app/dashboard/_data";

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedId: string;
  onSelect?: (id: string) => void;
}

// Columns: booking · owner · party · when · source · confirmation · chevron
// Everything in a single row — no stacked text inside a cell. Owner takes
// the flex (`1fr`) so names don't clip; every other column is sized to its
// content so the table fits the middle pane at 1440w without horizontal
// scroll. Gap tightened to 8px so Owner has room for "Victoria Wang"-length
// names after the avatar.
const GRID_COLUMNS =
  "88px minmax(0,1fr) 56px 96px 84px 88px 14px";

export function RestaurantList({
  restaurants,
  selectedId,
  onSelect,
}: RestaurantListProps) {
  // Active bookings first, cancelled appended. Same grid applies to both.
  const active = restaurants.filter((r) => r.status !== "filtered");
  const cancelled = restaurants.filter((r) => r.status === "filtered");
  const rows = [...active, ...cancelled];

  return (
    <div className="dop-card overflow-hidden">
      <div
        className="grid items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-5 py-3 normal-case text-[14px]"
        style={{
          gridTemplateColumns: GRID_COLUMNS,
          fontWeight: 600,
          fontVariationSettings: "'wght' 600",
          letterSpacing: "-0.005em",
          color: "var(--color-fg-tertiary)",
        }}
      >
        <HeaderCell icon={<FaHashtag size={11} />} label="Booking" />
        <HeaderCell icon={<FaUser size={11} />} label="Owner" />
        <HeaderCell icon={<FaUsers size={11} />} label="Party" />
        <HeaderCell icon={<FaClock size={11} />} label="When" />
        <HeaderCell icon={<FaArrowRightArrowLeft size={11} />} label="Source" />
        <HeaderCell icon={<FaCircleDot size={11} />} label="Status" />
        <span />
      </div>

      <div>
        {rows.map((r, i) => (
          <BookingRow
            key={r.id}
            booking={r}
            selected={r.id === selectedId}
            isLast={i === rows.length - 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  booking: Restaurant;
  selected: boolean;
  isLast: boolean;
  onSelect?: (id: string) => void;
}

function BookingRow({ booking: r, selected, isLast, onSelect }: RowProps) {
  const interactive = Boolean(onSelect);
  const isCancelled = r.status === "filtered";

  // Selected-row treatment diverges for cancelled vs active so the left
  // accent bar reads as "you're viewing THIS booking" regardless of its
  // state, without conflicting with the confirmation colour coding.
  const selectedBg = isCancelled
    ? "bg-[var(--color-status-red-light)]"
    : "bg-[var(--color-accent-light)]";
  const selectedBar = isCancelled
    ? "var(--color-status-red)"
    : "var(--color-accent)";

  return (
    <button
      type="button"
      data-restaurant-row="true"
      onClick={() => onSelect?.(r.id)}
      aria-pressed={selected}
      className={`relative grid w-full items-center gap-2 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset ${
        interactive ? "cursor-pointer" : ""
      } ${isLast ? "" : "border-b border-[var(--color-border-subtle)]"} ${
        selected
          ? selectedBg
          : isCancelled
            ? "opacity-80 hover:bg-[var(--color-surface-hover)] hover:opacity-100"
            : "hover:bg-[var(--color-surface-hover)]"
      }`}
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      {selected && (
        <span
          className="pointer-events-none absolute left-0 top-0 h-full w-[3px]"
          style={{ background: selectedBar }}
          aria-hidden
        />
      )}

      {/* Booking ID — plain sans text so the whole row reads in one
       *  typographic voice. Avatar lives in the Owner column. */}
      <div
        className="truncate text-[14px] tabular-nums"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.005em",
          color: isCancelled
            ? "var(--color-fg-muted)"
            : "var(--color-fg-strong)",
          textDecoration: isCancelled ? "line-through" : undefined,
          textDecorationColor: "var(--color-fg-tertiary)",
          textDecorationThickness: "1.5px",
        }}
      >
        {r.bookingId}
      </div>

      {/* Owner — avatar + name, single row */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${
            isCancelled ? "grayscale" : ""
          }`}
          style={{
            background: r.accentColor,
            fontVariationSettings: "'wght' 600",
          }}
          aria-hidden
        >
          {initials(r.hostName)}
        </div>
        <span
          className="truncate text-[14px]"
          style={{
            color: isCancelled
              ? "var(--color-fg-muted)"
              : "var(--color-fg-strong)",
            fontWeight: 510,
            fontVariationSettings: "'wght' 510",
            letterSpacing: "-0.005em",
          }}
        >
          {r.hostName}
        </span>
      </div>

      {/* Party */}
      <div
        className="text-[14px] tabular-nums"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          color: isCancelled
            ? "var(--color-fg-tertiary)"
            : "var(--color-fg-strong)",
        }}
      >
        {r.partySize}
      </div>

      {/* When */}
      <div
        className="truncate text-[14px]"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          color: isCancelled
            ? "var(--color-fg-tertiary)"
            : "var(--color-fg-strong)",
        }}
      >
        {r.whenLabel}
      </div>

      {/* Source */}
      <div className="flex items-center">
        <SourcePill source={r.source} dimmed={isCancelled} />
      </div>

      {/* Confirmation */}
      <div className="flex items-center">
        <ConfirmationPill state={r.confirmationState} />
      </div>

      {/* Chevron */}
      <div
        className={`flex justify-end ${
          selected
            ? isCancelled
              ? "text-[var(--color-status-red)]"
              : "text-[var(--color-accent)]"
            : "text-[var(--color-fg-faint)]"
        }`}
      >
        <FaChevronRight size={13} />
      </div>
    </button>
  );
}

/** Source channel chip — solid fill, white text, notion-tag radius (6px,
 *  not fully round). Only the Status pill is fully rounded, so shape alone
 *  tells the user "this is the live state" vs. "this is a category tag."
 *  Alfredo uses the app's accent so bookings that came through the platform
 *  (the ones restaurants pay to promote on) are instantly scannable. */
function SourcePill({
  source,
  dimmed,
}: {
  source: BookingSource;
  dimmed: boolean;
}) {
  const bg = SOURCE_COLORS[source];
  return (
    <span
      className="inline-flex h-[22px] items-center rounded-[2px] px-2 text-[11px]"
      style={{
        background: bg,
        color: "#ffffff",
        fontWeight: 600,
        fontVariationSettings: "'wght' 600",
        letterSpacing: "-0.005em",
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      {source}
    </span>
  );
}

const SOURCE_COLORS: Record<BookingSource, string> = {
  Alfredo: "var(--color-accent)",
  OpenTable: "#DA3743",
  Resy: "#C72F1A",
  Direct: "#201D1D",
  Phone: "#6B6B6B",
};

/** Status chip — solid fill, white text, with a small inset circle á la
 *  Notion's status property. Mixed case (not uppercase) so it reads like
 *  a badge, not a shouting eyebrow. Colours map to the booking's step in
 *  the restaurant's night: Confirmed / Seated / Pending / Cancelled. */
function ConfirmationPill({ state }: { state: ConfirmationState }) {
  const { label, bg } = CONFIRMATION_STYLES[state];
  return (
    <span
      className="inline-flex h-[22px] items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[12px]"
      style={{
        background: bg,
        color: "#ffffff",
        fontWeight: 600,
        fontVariationSettings: "'wght' 600",
        letterSpacing: "-0.005em",
      }}
    >
      <FaCircle size={6} style={{ color: "#ffffff", opacity: 0.9 }} />
      {label}
    </span>
  );
}

const CONFIRMATION_STYLES: Record<
  ConfirmationState,
  { label: string; bg: string }
> = {
  confirmed: { label: "Confirmed", bg: "var(--color-status-green)" },
  seated: { label: "Seated", bg: "var(--color-purple)" },
  pending: { label: "Pending", bg: "var(--color-status-amber)" },
  cancelled: { label: "Cancelled", bg: "var(--color-status-red)" },
};

/** Two-letter initials from "First Last", fallback to first char. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

export function HeaderEyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow-strong">{children}</div>;
}

interface HeaderCellProps {
  icon: ReactNode;
  label: string;
  align?: "left" | "right";
}

function HeaderCell({ icon, label, align = "left" }: HeaderCellProps) {
  return (
    <span
      className={`flex items-center gap-1.5 ${
        align === "right" ? "justify-end" : ""
      }`}
    >
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

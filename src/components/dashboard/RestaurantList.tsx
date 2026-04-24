import type { ReactNode } from "react";
import {
  FaStar,
  FaChevronRight,
  FaCircle,
  FaCircleCheck,
  FaBan,
} from "react-icons/fa6";
import type { Restaurant } from "@/app/dashboard/_data";

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedId: string;
}

export function RestaurantList({
  restaurants,
  selectedId,
}: RestaurantListProps) {
  const candidates = restaurants.filter((r) => r.status !== "filtered");
  const filtered = restaurants.filter((r) => r.status === "filtered");

  return (
    <div className="flex flex-col gap-4">
      {/* Header — osmo eyebrow row outside the card */}
      <div className="flex items-center justify-between pl-4 pr-3">
        <div className="eyebrow-strong">
          {candidates.length} candidates · ranked by score
        </div>
        <div className="eyebrow-strong">Filtered · {filtered.length}</div>
      </div>

      {/* Candidates card */}
      <div className="dop-card overflow-hidden">
        <div className="grid grid-cols-[1fr_128px_60px_132px_128px_120px_32px] items-center gap-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-4 py-2.5 eyebrow-strong">
          <span>Restaurant</span>
          <span>Cuisine</span>
          <span>Price</span>
          <span>Rating</span>
          <span>Availability</span>
          <span className="text-right">Score</span>
          <span />
        </div>
        <div>
          {candidates.map((r, i) => (
            <RestaurantRow
              key={r.id}
              restaurant={r}
              selected={r.id === selectedId}
              isLast={i === candidates.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Filtered out */}
      {filtered.length > 0 && (
        <div className="dop-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-4 py-2.5 eyebrow-strong">
            <FaBan size={10} style={{ color: "var(--color-status-red)" }} />
            <span>Filtered out · dietary constraints</span>
          </div>
          <div>
            {filtered.map((r) => (
              <FilteredRow key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RestaurantRowProps {
  restaurant: Restaurant;
  selected: boolean;
  isLast: boolean;
}

function RestaurantRow({ restaurant: r, selected, isLast }: RestaurantRowProps) {
  const topSlot = r.availability.find((s) => s.available);
  return (
    <div
      className={`relative grid grid-cols-[1fr_128px_60px_132px_128px_120px_32px] items-center gap-4 px-4 py-3 transition-colors ${
        isLast ? "" : "border-b border-[var(--color-border-subtle)]"
      } ${
        selected
          ? "bg-[var(--color-accent-light)]"
          : "hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      {/* Name column */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold text-white"
          style={{
            background: r.accentColor,
            fontVariationSettings: "'wght' 600",
          }}
          aria-hidden
        >
          {r.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="row-title truncate"
              style={{ color: "var(--color-fg-strong)" }}
            >
              {r.name}
            </span>
            {r.status === "picked" && (
              <span
                className="inline-flex h-[18px] items-center gap-1 rounded-full px-1.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-white"
                style={{ background: "var(--color-accent)" }}
              >
                <FaCircleCheck size={8} />
                Picked
              </span>
            )}
          </div>
          <div className="row-subtitle truncate">
            {r.neighborhood} · {r.reviewCount.toLocaleString()} reviews
          </div>
        </div>
      </div>

      {/* Cuisine */}
      <div className="truncate text-[12px] text-[var(--color-fg-secondary)]">
        {r.cuisine}
      </div>

      {/* Price */}
      <div
        className="text-[13px] text-[var(--color-fg-strong)]"
        style={{ fontWeight: 500, fontVariationSettings: "'wght' 510" }}
      >
        {r.priceRange}
      </div>

      {/* Rating + dietary */}
      <div className="flex items-center gap-1.5">
        <FaStar size={11} style={{ color: "#F5A623" }} />
        <span
          className="text-[13px] tabular-nums text-[var(--color-fg-strong)]"
          style={{ fontWeight: 500, fontVariationSettings: "'wght' 510" }}
        >
          {r.rating.toFixed(1)}
        </span>
        <DietaryBadges dietary={r.dietary} />
      </div>

      {/* Availability */}
      <div className="flex items-center gap-1.5 text-[12px]">
        {topSlot ? (
          <>
            <FaCircle size={6} style={{ color: "var(--color-status-green)" }} />
            <span
              className="text-[var(--color-fg-strong)]"
              style={{ fontWeight: 500, fontVariationSettings: "'wght' 510" }}
            >
              {topSlot.time}
            </span>
            <span className="text-[var(--color-fg-faint)]">
              · {topSlot.remaining}
            </span>
          </>
        ) : (
          <>
            <FaCircle size={6} style={{ color: "var(--color-status-amber)" }} />
            <span className="text-[var(--color-fg-muted)]">Limited</span>
          </>
        )}
      </div>

      {/* Score */}
      <div className="flex items-center justify-end gap-2">
        <ScoreBar value={r.score} highlight={selected} />
      </div>

      {/* Chevron */}
      <div
        className={`flex justify-end ${
          selected ? "text-[var(--color-accent)]" : "text-[var(--color-fg-faint)]"
        }`}
      >
        <FaChevronRight size={11} />
      </div>
    </div>
  );
}

function FilteredRow({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 opacity-80">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold text-white/70 grayscale"
        style={{ background: r.accentColor }}
        aria-hidden
      >
        {r.name.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="row-title truncate line-through decoration-[var(--color-fg-tertiary)] decoration-[1.5px]">
            {r.name}
          </span>
          <span className="text-[11px] text-[var(--color-fg-tertiary)]">
            {r.cuisine} · {r.priceRange}
          </span>
        </div>
        <div className="row-subtitle truncate">{r.filteredReason}</div>
      </div>
      <span
        className="inline-flex h-[20px] items-center gap-1 rounded-full border px-2 text-[10px] font-semibold uppercase tracking-[0.06em]"
        style={{
          color: "var(--color-status-red)",
          background: "var(--color-status-red-light)",
          borderColor: "rgba(240, 78, 85, 0.25)",
        }}
      >
        <FaCircle size={5} />
        Filtered
      </span>
    </div>
  );
}

interface DietaryBadgesProps {
  dietary: { vegetarian: boolean; vegan: boolean; glutenFree: boolean };
}

function DietaryBadges({ dietary }: DietaryBadgesProps) {
  return (
    <div className="ml-1 flex items-center gap-1">
      {dietary.vegetarian && <MiniBadge label="V" tooltip="vegetarian" />}
      {dietary.vegan && <MiniBadge label="VG" tooltip="vegan" />}
      {dietary.glutenFree && <MiniBadge label="GF" tooltip="gluten-free" />}
    </div>
  );
}

function MiniBadge({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span
      title={tooltip}
      className="inline-flex h-[16px] min-w-[18px] items-center justify-center rounded-[4px] px-1 text-[9px] font-bold uppercase tracking-wide"
      style={{
        color: "var(--color-status-green)",
        background: "var(--color-status-green-light)",
      }}
    >
      {label}
    </span>
  );
}

function ScoreBar({ value, highlight }: { value: number; highlight: boolean }) {
  const barColor = highlight
    ? "var(--color-accent)"
    : value >= 85
      ? "var(--color-status-green)"
      : value >= 70
        ? "var(--color-fg-secondary)"
        : "var(--color-fg-tertiary)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-[4px] w-16 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: barColor }}
        />
      </div>
      <span
        className="min-w-[22px] text-right text-[13px] tabular-nums"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          color: highlight ? "var(--color-accent)" : "var(--color-fg-strong)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function HeaderEyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow-strong">{children}</div>;
}

import type { ReactNode } from "react";
import {
  FaStar,
  FaCircle,
  FaCircleCheck,
  FaCalendar,
  FaArrowUpRightFromSquare,
  FaLocationDot,
} from "react-icons/fa6";
import type { Restaurant, Session } from "@/app/dashboard/_data";

interface DetailPanelProps {
  restaurant: Restaurant;
  session: Session;
}

export function DetailPanel({ restaurant: r, session: s }: DetailPanelProps) {
  return (
    <aside className="flex h-full w-[416px] shrink-0 flex-col rounded-[14px] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Hero swatch */}
      <div
        className="relative h-[152px] shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${r.accentColor} 0%, ${shade(r.accentColor, -22)} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_60%,rgba(255,255,255,0.16),transparent_60%)]" />
        <div className="absolute left-6 bottom-4 text-white/80 eyebrow">
          {r.cuisine}
        </div>
        {r.status === "picked" && (
          <div className="absolute top-4 right-4 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-white px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-fg-strong)] shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
            <FaCircleCheck size={11} style={{ color: "var(--color-status-green)" }} />
            Picked · Booked
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        {/* Title block */}
        <div>
          <h2
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "var(--color-fg-strong)",
            }}
          >
            {r.name}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-[var(--color-fg-secondary)]">
            <FaLocationDot size={11} className="text-[var(--color-fg-tertiary)]" />
            <span>{r.neighborhood}</span>
            <span className="text-[var(--color-fg-tertiary)]">·</span>
            <span
              className="text-[var(--color-fg-strong)]"
              style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
            >
              {r.priceRange}
            </span>
            <span className="text-[var(--color-fg-tertiary)]">·</span>
            <div className="flex items-center gap-1.5">
              <FaStar size={11} style={{ color: "#F5A623" }} />
              <span
                className="text-[var(--color-fg-strong)]"
                style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
              >
                {r.rating.toFixed(1)}
              </span>
              <span className="text-[var(--color-fg-tertiary)]">
                ({r.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        {r.confirmation && (
          <div
            className="overflow-hidden rounded-[12px] text-white"
            style={{ background: "var(--color-fg-strong)" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="eyebrow-strong" style={{ color: "rgba(255,255,255,0.5)" }}>
                Confirmation
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/80">
                <FaCircle size={6} style={{ color: "var(--color-status-green)" }} />
                Confirmed
              </span>
            </div>
            <div className="px-5 py-5">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 52,
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.confirmation}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <DarkField label="When">{s.dateTime}</DarkField>
                <DarkField label="Party">{s.partySize} people · under Victoria</DarkField>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
              <button
                type="button"
                className="flex h-12 items-center justify-center gap-2 text-[13px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
              >
                <FaCalendar size={12} />
                Add to calendar
              </button>
              <a
                className="flex h-12 items-center justify-center gap-2 text-[13px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
                href={`https://www.opentable.com/r/${r.openTableId ?? ""}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaArrowUpRightFromSquare size={12} />
                OpenTable
              </a>
            </div>
          </div>
        )}

        {/* Reasoning */}
        <Section label="Why Alfredo picked this">
          <p
            className="text-[14px] text-[var(--color-fg-secondary)]"
            style={{ lineHeight: "22px", letterSpacing: "-0.005em" }}
          >
            {r.reasoning}
          </p>
        </Section>

        {/* Top dishes */}
        <Section label="Top dishes">
          <div className="flex flex-wrap gap-2">
            {r.topDishes.map((d) => (
              <span
                key={d}
                className="inline-flex h-[28px] items-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 text-[12px] font-medium text-[var(--color-fg-secondary)]"
              >
                {d}
              </span>
            ))}
          </div>
        </Section>

        {/* Availability grid */}
        <Section label="Availability · Saturday">
          <div className="grid grid-cols-4 gap-2">
            {r.availability.map((slot) => {
              const isBooked = slot.time === "7:00 PM" && slot.available;
              const active = slot.available;
              return (
                <div
                  key={slot.label}
                  className={`flex flex-col items-center rounded-[10px] border px-1 py-2.5 text-center transition-colors ${
                    isBooked
                      ? "border-[var(--color-accent-border)] bg-[var(--color-accent-light)]"
                      : active
                        ? "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] opacity-55"
                  }`}
                >
                  <div
                    className="text-[14px]"
                    style={{
                      fontWeight: 510,
                      fontVariationSettings: "'wght' 510",
                      color: isBooked
                        ? "var(--color-accent)"
                        : "var(--color-fg-strong)",
                    }}
                  >
                    {slot.time.replace(" PM", "p").replace(" AM", "a")}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-fg-faint)]">
                    {active ? `${slot.remaining} open` : "booked"}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Dietary match */}
        <Section label="Dietary match">
          <div className="flex flex-col gap-0.5">
            {s.members.map((m) => {
              const matches = dietaryMatch(m.dietary ?? [], r);
              return (
                <div
                  key={m.id}
                  className="flex h-10 items-center justify-between rounded-[8px] px-2 text-[13px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ background: m.accentColor }}
                      aria-hidden
                    >
                      {m.name[0]}
                    </div>
                    <span
                      className="text-[var(--color-fg-strong)]"
                      style={{
                        fontWeight: 510,
                        fontVariationSettings: "'wght' 510",
                      }}
                    >
                      {m.name}
                    </span>
                    {(m.dietary ?? []).length > 0 && (
                      <span className="text-[12px] text-[var(--color-fg-faint)]">
                        {(m.dietary ?? []).join(", ")}
                      </span>
                    )}
                  </div>
                  {matches ? (
                    <span
                      className="inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2 text-[10.5px] font-semibold uppercase tracking-[0.06em]"
                      style={{
                        color: "var(--color-status-green)",
                        background: "var(--color-status-green-light)",
                        borderColor: "rgba(46,204,113,0.25)",
                      }}
                    >
                      <FaCircleCheck size={9} />
                      OK
                    </span>
                  ) : (
                    <span className="inline-flex h-[22px] items-center rounded-full border border-[rgba(245,158,11,0.25)] bg-[var(--color-status-amber-light)] px-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--color-status-amber)]">
                      review
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <div className="eyebrow-strong mb-2">{label}</div>
      {children}
    </section>
  );
}

function DarkField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        className="eyebrow-strong"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div
        className="mt-1.5 text-[13px] text-white"
        style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
      >
        {children}
      </div>
    </div>
  );
}

function dietaryMatch(memberDietary: string[], r: Restaurant): boolean {
  if (memberDietary.includes("vegetarian") && !r.dietary.vegetarian)
    return false;
  if (memberDietary.includes("vegan") && !r.dietary.vegan) return false;
  if (memberDietary.includes("gluten-free") && !r.dietary.glutenFree)
    return false;
  return true;
}

function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}

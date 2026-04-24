import type { ReactNode } from "react";
import type { Restaurant, Session } from "@/app/dashboard/_data";

interface DetailPanelProps {
  restaurant: Restaurant;
  session: Session;
}

export function DetailPanel({ restaurant: r, session: s }: DetailPanelProps) {
  return (
    <aside className="flex h-full w-[440px] shrink-0 flex-col overflow-y-auto border-l border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      {/* Hero swatch */}
      <div
        className="relative h-[140px] shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${r.accentColor} 0%, ${shade(r.accentColor, -20)} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute bottom-3 left-5 text-white/80">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em]">
            {r.cuisine}
          </div>
        </div>
        <div className="absolute right-4 top-4 flex gap-1.5">
          {r.status === "picked" && (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-fg-strong)] shadow">
              <span
                className="size-[5px] rounded-full"
                style={{ background: "var(--color-status-green)" }}
                aria-hidden
              />
              Picked · Booked
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Title */}
        <div>
          <h2
            className="font-display text-[32px] leading-[1.05] text-[var(--color-fg-strong)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            {r.name}
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-[var(--color-fg-muted)]">
            <span>{r.neighborhood}</span>
            <span className="text-[var(--color-fg-faint)]">·</span>
            <span className="font-medium text-[var(--color-fg-strong)]">
              {r.priceRange}
            </span>
            <span className="text-[var(--color-fg-faint)]">·</span>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="font-medium text-[var(--color-fg-strong)]">
                {r.rating.toFixed(1)}
              </span>
              <span className="text-[var(--color-fg-faint)]">
                ({r.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation card */}
        {r.confirmation && (
          <div className="overflow-hidden rounded-[10px] bg-[var(--color-fg-strong)] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">
                Confirmation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                <span
                  className="size-[5px] rounded-full"
                  style={{ background: "var(--color-status-green)" }}
                  aria-hidden
                />
                Confirmed
              </span>
            </div>
            <div className="px-4 py-4">
              <div
                className="font-display text-[44px] leading-none tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                {r.confirmation}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] text-white/70">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">
                    When
                  </div>
                  <div className="mt-0.5 text-white">{s.dateTime}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">
                    Party
                  </div>
                  <div className="mt-0.5 text-white">
                    {s.partySize} people · under Victoria
                  </div>
                </div>
              </div>
            </div>
            <div className="flex divide-x divide-white/10 border-t border-white/10 text-[12px]">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <CalendarIcon />
                Add to calendar
              </button>
              <a
                className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                href={`https://www.opentable.com/r/${r.openTableId ?? ""}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalIcon />
                OpenTable
              </a>
            </div>
          </div>
        )}

        {/* Reasoning */}
        <Section label="Why Alfredo picked this">
          <p className="text-[13px] leading-[1.6] text-[var(--color-fg-secondary)]">
            {r.reasoning}
          </p>
        </Section>

        {/* Top dishes */}
        <Section label="Top dishes">
          <div className="flex flex-wrap gap-1.5">
            {r.topDishes.map((d) => (
              <span
                key={d}
                className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-fg-muted)]"
              >
                {d}
              </span>
            ))}
          </div>
        </Section>

        {/* Availability */}
        <Section label="Availability · Saturday">
          <div className="grid grid-cols-4 gap-1.5">
            {r.availability.map((slot) => (
              <div
                key={slot.label}
                className={`flex flex-col items-center rounded-[6px] border px-2 py-1.5 text-center ${
                  slot.available
                    ? slot.time === "7:00 PM"
                      ? "border-[var(--color-accent-border)] bg-[var(--color-accent-light)]"
                      : "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] opacity-50"
                }`}
              >
                <div
                  className={`text-[11px] font-semibold ${
                    slot.time === "7:00 PM" && slot.available
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-fg-strong)]"
                  }`}
                >
                  {slot.time.replace(" PM", "p").replace(" AM", "a")}
                </div>
                <div className="text-[9px] text-[var(--color-fg-faint)]">
                  {slot.available
                    ? `${slot.remaining} open`
                    : "booked"}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Dietary match */}
        <Section label="Dietary match">
          <div className="space-y-1.5">
            {s.members.map((m) => {
              const matches = dietaryMatch(m.dietary ?? [], r);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between text-[12px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                      style={{ background: m.accentColor }}
                      aria-hidden
                    >
                      {m.name[0]}
                    </div>
                    <span className="text-[var(--color-fg-strong)]">
                      {m.name}
                    </span>
                    {(m.dietary ?? []).length > 0 && (
                      <span className="text-[10px] text-[var(--color-fg-faint)]">
                        {(m.dietary ?? []).join(", ")}
                      </span>
                    )}
                  </div>
                  {matches ? (
                    <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--color-status-green-light)] bg-[var(--color-status-green-light)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-status-green)]">
                      <CheckIcon />
                      OK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--color-status-amber-light)] bg-[var(--color-status-amber-light)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-status-amber)]">
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

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
        {label}
      </div>
      {children}
    </section>
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

// Darken a hex color by `percent` (negative darkens). Tolerates #RRGGBB.
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}

function StarIcon(): ReactNode {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5A623]">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon(): ReactNode {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CalendarIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ExternalIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

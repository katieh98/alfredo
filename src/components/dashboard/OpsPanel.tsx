import { FaTriangleExclamation, FaClock, FaCircle } from "react-icons/fa6";
import type { ReactNode } from "react";

interface FlagEntry {
  flag: string;
  table: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

interface SeatingEntry {
  time: string;
  covers: number;
  parties: number;
}

const FLAGS: FlagEntry[] = [
  { flag: "Peanut allergy", table: "T14", time: "8:00", severity: "critical" },
  { flag: "Shellfish", table: "T7", time: "7:30", severity: "critical" },
  { flag: "Celiac / GF", table: "T3", time: "9:15", severity: "warning" },
  { flag: "Vegan ×2", table: "T11", time: "8:45", severity: "info" },
];

const SEATINGS: SeatingEntry[] = [
  { time: "7:30 PM", covers: 14, parties: 4 },
  { time: "8:00 PM", covers: 22, parties: 6 },
  { time: "8:45 PM", covers: 10, parties: 3 },
];

/**
 * Ops glance — tonight's dietary flags + upcoming seatings, rendered as
 * two side-by-side cards above the reservations table. These used to live
 * in the sidebar; promoting them to main content puts the two kitchen-
 * critical streams (what to prep for, what's next) directly above the
 * reservation list the FoH manager is working from.
 */
export function OpsPanel() {
  return (
    <section className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-2">
      <Card eyebrow="Tonight's flags" icon={<FaTriangleExclamation size={11} />}>
        {FLAGS.map((f) => (
          <FlagRow key={f.flag} {...f} />
        ))}
      </Card>
      <Card eyebrow="Next seatings" icon={<FaClock size={11} />}>
        {SEATINGS.map((s) => (
          <SeatingRow key={s.time} {...s} />
        ))}
      </Card>
    </section>
  );
}

interface CardProps {
  eyebrow: string;
  icon: ReactNode;
  children: ReactNode;
}

function Card({ eyebrow, icon, children }: CardProps) {
  return (
    <div className="dop-card flex flex-col">
      <div
        className="flex items-center gap-1.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-4 py-2.5"
        style={{
          color: "var(--color-fg-tertiary)",
          fontSize: 11,
          fontWeight: 600,
          fontVariationSettings: "'wght' 600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span className="flex items-center text-[var(--color-fg-faint)]">
          {icon}
        </span>
        <span>{eyebrow}</span>
      </div>
      <div className="flex flex-col p-2">{children}</div>
    </div>
  );
}

// Red = anaphylaxis-risk (nuts, shellfish), amber = medical (celiac),
// green = preference (vegan, halal, kosher).
function FlagRow({ flag, table, time, severity }: FlagEntry) {
  const dot =
    severity === "critical"
      ? "var(--color-status-red)"
      : severity === "warning"
        ? "var(--color-status-amber)"
        : "var(--color-status-green)";
  return (
    <div className="flex h-10 items-center gap-2.5 rounded-[8px] px-3 transition-colors hover:bg-[var(--color-surface-hover)]">
      <FaCircle size={7} style={{ color: dot }} className="shrink-0" />
      <span
        className="flex-1 truncate text-[14px] text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.01em",
        }}
      >
        {flag}
        <span
          className="ml-1.5 text-[var(--color-fg-faint)]"
          style={{ fontWeight: 430, fontVariationSettings: "'wght' 430" }}
        >
          {table}
        </span>
      </span>
      <span className="shrink-0 text-[12px] tabular-nums text-[var(--color-fg-faint)]">
        {time}
      </span>
    </div>
  );
}

function SeatingRow({ time, covers, parties }: SeatingEntry) {
  return (
    <div className="flex h-10 items-center gap-2.5 rounded-[8px] px-3 transition-colors hover:bg-[var(--color-surface-hover)]">
      <span
        className="w-[58px] shrink-0 text-[13px] tabular-nums text-[var(--color-fg-strong)]"
        style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
      >
        {time}
      </span>
      <span className="flex-1 truncate text-[14px] text-[var(--color-fg-strong)]">
        {covers} covers
      </span>
      <span className="shrink-0 text-[12px] text-[var(--color-fg-faint)]">
        {parties} parties
      </span>
    </div>
  );
}

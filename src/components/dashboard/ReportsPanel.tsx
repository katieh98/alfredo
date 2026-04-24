import { FaChartLine, FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface Kpi {
  label: string;
  value: string;
  delta: { dir: "up" | "down" | "flat"; text: string };
  sub: string;
}

const KPIS: Kpi[] = [
  {
    label: "Covers tonight",
    value: "48",
    delta: { dir: "up", text: "+12%" },
    sub: "vs. last Saturday",
  },
  {
    label: "Fill rate",
    value: "84%",
    delta: { dir: "up", text: "+6pt" },
    sub: "seats filled at service",
  },
  {
    label: "Avg party",
    value: "4.2",
    delta: { dir: "flat", text: "±0" },
    sub: "per booking",
  },
  {
    label: "Cancel rate",
    value: "4.1%",
    delta: { dir: "down", text: "−1.8pt" },
    sub: "this week",
  },
];

interface SourceRow {
  source: string;
  covers: number;
  color: string;
}

const SOURCE_BREAKDOWN: SourceRow[] = [
  { source: "Alfredo", covers: 18, color: "var(--color-accent)" },
  { source: "OpenTable", covers: 14, color: "#DA3743" },
  { source: "Direct", covers: 8, color: "#201D1D" },
  { source: "Resy", covers: 5, color: "#C72F1A" },
  { source: "Phone", covers: 3, color: "#6B6B6B" },
];

const DAILY_COVERS = [
  { day: "Sun", n: 34 },
  { day: "Mon", n: 22 },
  { day: "Tue", n: 28 },
  { day: "Wed", n: 36 },
  { day: "Thu", n: 42 },
  { day: "Fri", n: 51 },
  { day: "Sat", n: 48 },
];

const TOP_HOSTS = [
  { name: "Victoria Wang", bookings: 7, covers: 38 },
  { name: "Marcus Chen", bookings: 5, covers: 14 },
  { name: "Priya Mehta", bookings: 4, covers: 22 },
  { name: "Jordan Kim", bookings: 3, covers: 9 },
];

/**
 * Reports panel — tonight's KPIs, source breakdown, weekly trend, and
 * top hosts. All hardcoded; real version aggregates across sessions
 * from Ghost DB. No charting library — plain styled blocks keep the
 * visual language consistent with the rest of the dashboard.
 */
export function ReportsPanel() {
  const maxDaily = Math.max(...DAILY_COVERS.map((d) => d.n));
  const sourceTotal = SOURCE_BREAKDOWN.reduce((n, s) => n + s.covers, 0);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main className="dop-no-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-16 pt-10">
        <header className="flex flex-col gap-3">
          <div className="eyebrow flex items-center gap-2">
            <FaChartLine size={11} className="text-[var(--color-fg-faint)]" />
            <span>Tonight · Sat, Apr 26</span>
          </div>
          <h1 className="hero-title">Reports</h1>
        </header>

        {/* KPI row */}
        <section className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-4">
          {KPIS.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </section>

        {/* Source breakdown + Weekly trend side by side */}
        <section className="grid shrink-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="dop-card overflow-hidden">
            <CardHeader title="Covers by source" caption="Tonight" />
            <div className="flex flex-col gap-3 p-5">
              {SOURCE_BREAKDOWN.map((s) => {
                const pct = Math.round((s.covers / sourceTotal) * 100);
                return (
                  <div key={s.source} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span
                        className="text-[var(--color-fg-strong)]"
                        style={{
                          fontWeight: 510,
                          fontVariationSettings: "'wght' 510",
                        }}
                      >
                        {s.source}
                      </span>
                      <span className="tabular-nums text-[var(--color-fg-tertiary)]">
                        {s.covers} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dop-card overflow-hidden">
            <CardHeader title="Covers this week" caption="Apr 20 → Apr 26" />
            <div className="flex items-end justify-between gap-2 px-5 pb-5 pt-6">
              {DAILY_COVERS.map((d) => {
                const pct = (d.n / maxDaily) * 100;
                const isToday = d.day === "Sat";
                return (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-[120px] w-full items-end">
                      <div
                        className="w-full rounded-[4px] transition-all"
                        style={{
                          height: `${pct}%`,
                          background: isToday
                            ? "var(--color-accent)"
                            : "var(--color-fg-faint)",
                          opacity: isToday ? 1 : 0.35,
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] uppercase"
                      style={{
                        letterSpacing: "0.06em",
                        color: isToday
                          ? "var(--color-accent)"
                          : "var(--color-fg-tertiary)",
                        fontWeight: isToday ? 600 : 500,
                      }}
                    >
                      {d.day}
                    </span>
                    <span
                      className="text-[12px] tabular-nums"
                      style={{
                        color: isToday
                          ? "var(--color-fg-strong)"
                          : "var(--color-fg-tertiary)",
                        fontWeight: 510,
                        fontVariationSettings: "'wght' 510",
                      }}
                    >
                      {d.n}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top hosts */}
        <section className="dop-card shrink-0 overflow-hidden">
          <CardHeader title="Top hosts · this week" caption="By covers" />
          <div>
            {TOP_HOSTS.map((h, i) => (
              <div
                key={h.name}
                className={`flex items-center justify-between gap-3 px-5 py-3 ${
                  i < TOP_HOSTS.length - 1
                    ? "border-b border-[var(--color-border-subtle)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex size-6 items-center justify-center rounded-full text-[11px] text-[var(--color-fg-faint)]"
                    style={{
                      background: "var(--color-surface-hover)",
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-[14px] text-[var(--color-fg-strong)]"
                    style={{
                      fontWeight: 510,
                      fontVariationSettings: "'wght' 510",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {h.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-[13px]">
                  <span className="tabular-nums text-[var(--color-fg-tertiary)]">
                    {h.bookings} bookings
                  </span>
                  <span
                    className="w-12 text-right tabular-nums text-[var(--color-fg-strong)]"
                    style={{
                      fontWeight: 510,
                      fontVariationSettings: "'wght' 510",
                    }}
                  >
                    {h.covers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const dirIcon =
    kpi.delta.dir === "up" ? (
      <FaArrowTrendUp size={11} />
    ) : kpi.delta.dir === "down" ? (
      <FaArrowTrendDown size={11} />
    ) : null;
  const dirColor =
    kpi.delta.dir === "up"
      ? "var(--color-status-green)"
      : kpi.delta.dir === "down"
        ? "var(--color-status-red)"
        : "var(--color-fg-tertiary)";

  return (
    <div className="dop-card flex flex-col gap-2 p-5">
      <div className="eyebrow-strong">{kpi.label}</div>
      <div className="flex items-baseline gap-2">
        <span
          className="stat-num"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            fontSize: 32,
          }}
        >
          {kpi.value}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[12px]"
          style={{ color: dirColor, fontWeight: 600 }}
        >
          {dirIcon}
          {kpi.delta.text}
        </span>
      </div>
      <div className="text-[12px] text-[var(--color-fg-tertiary)]">
        {kpi.sub}
      </div>
    </div>
  );
}

function CardHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-5 py-3">
      <span
        className="text-[14px] text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </span>
      <span className="text-[12px] text-[var(--color-fg-tertiary)]">
        {caption}
      </span>
    </div>
  );
}

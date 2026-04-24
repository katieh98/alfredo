import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import {
  FaBoltLightning,
  FaCheck,
  FaCircle,
  FaUserCheck,
  FaUtensils,
  FaXmark,
} from "react-icons/fa6";
import { Footer, TopBar } from "@/components/site-chrome";
import { StaggerText } from "@/components/stagger-text";

type FaIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export const metadata: Metadata = {
  title: "Alfredo for Restaurants · Fill tables, skip no-shows",
  description:
    "Pre-confirmed group reservations, dietary flags collected at booking, and no per-cover fees on the Promoted tier.",
};

export default function RestaurantsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <FlipSection />
        <DashboardPreview />
        <FoHBenefits />
        <PricingTeaser />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark pb-24 pt-48">
      <iframe
        src="/hero-shader-blue.html?theme=light"
        className="pointer-events-none absolute inset-0 size-full border-0"
        aria-hidden
        loading="lazy"
        title="Decorative background"
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-8">
        <div className="max-w-[1140px]">
          <p
            className="label-xs mb-6"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            For restaurants
          </p>
          <h1
            className="font-display text-[clamp(64px,9.5vw,140px)] font-normal leading-[0.9] text-white"
            style={{ letterSpacing: "-0.04em" }}
          >
            Group reservations,{" "}
            <span className="italic font-normal">arriving.</span>
          </h1>
          <p
            className="body-lg mt-10 max-w-[680px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Alfredo sends you pre-confirmed parties of 4–12, already matched
            to your cuisine and pricing. Every guest has said yes, logged
            their dietary flags, and picked the slot — in a single tap.
            Tuesday isn&apos;t dead anymore.
          </p>
          <div className="mt-12 flex items-center gap-3">
            <a
              href="/plans"
              className="stagger-btn inline-flex h-14 items-center rounded-full bg-white px-8 text-[16px] font-medium text-ink transition-opacity hover:opacity-95"
            >
              <StaggerText text="Claim your listing" />
            </a>
            <a
              href="mailto:hello@alfredo.chat?subject=Alfredo%20demo"
              className="stagger-btn inline-flex h-14 items-center rounded-full border border-white/30 px-7 text-[16px] font-medium text-white transition-colors hover:bg-white/10"
            >
              <StaggerText text="Book a demo" />
            </a>
          </div>
          <p
            className="label-xs mt-8"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            No per-cover fee on Promoted · OpenTable + Resy sync · Cancel
            anytime
          </p>
        </div>
      </div>
    </section>
  );
}

interface Stat {
  n: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  {
    n: "3.1%",
    label: "No-show rate on Alfredo parties",
    sub: "Industry avg 18%",
  },
  {
    n: "+23%",
    label: "Weeknight cover lift",
    sub: "First 30 days on Promoted",
  },
  {
    n: "5.2",
    label: "Average party size",
    sub: "Direct bookings avg 2.3",
  },
  {
    n: "47%",
    label: "Alfredo guests book again",
    sub: "Within 60 days",
  },
];

function Stats() {
  return (
    <section className="bg-bg-alt">
      <div className="mx-auto max-w-[1440px] px-8 py-20">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-x-10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border-l border-border-soft pl-6"
            >
              <div
                className="font-display text-[clamp(48px,6vw,80px)] font-normal leading-[0.95]"
                style={{ letterSpacing: "-0.035em" }}
              >
                {s.n}
              </div>
              <p className="mt-4 max-w-[200px] text-[15px] leading-[1.35] text-ink">
                {s.label}
              </p>
              <p className="label-xs mt-2">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Flip {
  tag: string;
  headline: string;
  oldBody: string;
  newBody: string;
  icon: FaIcon;
}

const FLIPS: Flip[] = [
  {
    tag: "No-shows",
    headline: "Every seat, a confirmed party.",
    oldBody:
      "Solo booker reserves a 6-top on OpenTable. Day-of, two bail, one never responds. You scramble to re-seat or eat the margin.",
    newBody:
      "Alfredo only books once every guest individually confirms. If one drops, the reservation re-times or cancels before your prep — never during service.",
    icon: FaUserCheck,
  },
  {
    tag: "Dead weeknights",
    headline: "Demand, shaped toward your slow nights.",
    oldBody:
      "Yelp ads, a Tuesday discount menu, and a prayer. Tuesday still pulls 40% of Saturday's covers — and you paid to be found.",
    newBody:
      "When a group's cuisine, budget, and dietary filters match your menu, your slot surfaces at the top of their candidate list. You only pay when they book and show.",
    icon: FaBoltLightning,
  },
  {
    tag: "Dietary surprise",
    headline: "The kitchen already knows.",
    oldBody:
      "Table of eight arrives. Server takes orders. “Oh, I'm actually celiac.” Kitchen scrambles, comp goes out, guest has a bad night, review drops to three stars.",
    newBody:
      "Every dietary flag is collected at booking. Critical flags — nut, shellfish, celiac — reach your kitchen 24 hours ahead. Chef plans, server prepares, guest trusts you.",
    icon: FaUtensils,
  },
];

function FlipSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-28">
      <div className="mb-14">
        <p className="label-xs mb-6">What changes</p>
        <h2
          className="font-display max-w-[860px] text-[56px] font-normal leading-[1.02] md:text-[64px]"
          style={{ letterSpacing: "-0.03em" }}
        >
          Three problems Alfredo{" "}
          <span className="italic font-normal">flips</span>.
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {FLIPS.map((f) => {
          const Icon = f.icon;
          return (
            <article
              key={f.tag}
              className="grid gap-8 rounded-[12px] bg-bg-card p-10 ring-1 ring-border-soft md:grid-cols-[260px_1fr_1fr] md:gap-12"
            >
              <div className="flex flex-col gap-6">
                <div
                  className="flex size-12 items-center justify-center rounded-full bg-bg-alt text-ink-mute"
                  aria-hidden
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="label-xs mb-3">{f.tag}</p>
                  <h3
                    className="font-display text-[28px] font-normal leading-[1.05]"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {f.headline}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-bg-alt"
                    aria-hidden
                  >
                    <FaXmark size={10} className="text-ink-mute" />
                  </span>
                  <p className="label-xs">The status quo</p>
                </div>
                <p className="body-md text-ink-soft">{f.oldBody}</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-5 items-center justify-center rounded-full"
                    style={{
                      background: "color-mix(in oklch, var(--color-electric) 22%, transparent)",
                    }}
                    aria-hidden
                  >
                    <FaCheck size={10} style={{ color: "var(--color-ink)" }} />
                  </span>
                  <p className="label-xs">With Alfredo</p>
                </div>
                <p className="body-md text-ink">{f.newBody}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="bg-bg-dark text-bg">
      <div className="mx-auto max-w-[1440px] px-8 py-28">
        <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div>
            <p
              className="label-xs mb-6"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              What you&apos;ll see tonight
            </p>
            <h2
              className="font-display text-[56px] font-normal leading-[1.02] md:text-[64px]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Reservations, already{" "}
              <span className="italic font-normal">triaged</span>.
            </h2>
          </div>
          <p className="body-md max-w-[380px] text-white/70">
            Your FoH dashboard shows tonight&apos;s covers, critical
            dietary flags, Alfredo-sourced pre-confirms, and live
            OpenTable/Resy sync — in one glance.
          </p>
        </div>

        <div className="rounded-[12px] bg-white/5 p-6 ring-1 ring-white/10">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[16px]" style={{ fontWeight: 510 }}>
                Tonight
              </span>
              <span className="text-[13px] text-white/55">
                Sat, Apr 26 · 38 covers booked · 12 from Alfredo
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-white/70">
              <span
                className="size-[6px] rounded-full"
                style={{ background: "var(--color-electric)" }}
                aria-hidden
              />
              Live sync · OpenTable + Resy
            </div>
          </div>

          <div className="overflow-hidden rounded-[8px] ring-1 ring-white/10">
            {DASHBOARD_ROWS.map((r, i) => (
              <DashboardRow
                key={r.code}
                row={r}
                isLast={i === DASHBOARD_ROWS.length - 1}
              />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 rounded-[8px] bg-white/[0.04] p-5 ring-1 ring-white/10">
            <DashKpi label="Alfredo covers" value="12" sub="32% of tonight" />
            <DashKpi
              label="Critical dietary flags"
              value="3"
              sub="Kitchen notified 24h ahead"
            />
            <DashKpi
              label="Pre-confirmed parties"
              value="5 / 5"
              sub="Every guest tapped yes"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface DashboardRowData {
  code: string;
  party: string;
  size: number;
  time: string;
  source: "Alfredo" | "OpenTable" | "Resy";
  flags?: { label: string; severity: "critical" | "warning" };
}

const DASHBOARD_ROWS: DashboardRowData[] = [
  {
    code: "A92K4RD",
    party: "Priya Mehta",
    size: 6,
    time: "6:45 PM",
    source: "Alfredo",
    flags: { label: "Shellfish allergy", severity: "critical" },
  },
  {
    code: "Q8J2L5HW",
    party: "Ben Sato",
    size: 8,
    time: "7:30 PM",
    source: "Alfredo",
    flags: { label: "2 gluten-free", severity: "warning" },
  },
  {
    code: "M8Q4H5CV",
    party: "Isabella García",
    size: 3,
    time: "7:45 PM",
    source: "Resy",
  },
  {
    code: "L2P6R9BN",
    party: "Marcus Okafor",
    size: 10,
    time: "8:00 PM",
    source: "Alfredo",
    flags: { label: "1 tree-nut allergy", severity: "critical" },
  },
];

function DashboardRow({
  row,
  isLast,
}: {
  row: DashboardRowData;
  isLast: boolean;
}) {
  const isAlfredo = row.source === "Alfredo";
  return (
    <div
      className={`grid items-center gap-4 px-5 py-4 text-[14px] ${
        isLast ? "" : "border-b border-white/8"
      }`}
      style={{
        gridTemplateColumns: "96px minmax(0,1fr) 48px 88px 160px 140px",
      }}
    >
      <span
        className="truncate tabular-nums text-white"
        style={{ fontWeight: 510 }}
      >
        {row.code}
      </span>
      <span className="truncate text-white/85">{row.party}</span>
      <span className="tabular-nums text-white">{row.size}</span>
      <span className="tabular-nums text-white/85">{row.time}</span>
      {row.flags ? (
        <span
          className="inline-flex h-[22px] w-fit items-center gap-1.5 rounded-[2px] px-2 text-[11px] text-white"
          style={{
            background:
              row.flags.severity === "critical"
                ? "rgba(248,65,49,0.22)"
                : "rgba(255,200,60,0.22)",
            fontWeight: 510,
          }}
        >
          <FaCircle
            size={6}
            style={{
              color:
                row.flags.severity === "critical"
                  ? "var(--color-coral)"
                  : "#F5C142",
            }}
          />
          {row.flags.label}
        </span>
      ) : (
        <span className="text-[12px] text-white/45">—</span>
      )}
      <span
        className="inline-flex h-[22px] w-fit items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[11px]"
        style={{
          background: isAlfredo ? "var(--color-electric)" : "rgba(255,255,255,0.1)",
          color: isAlfredo ? "var(--color-bg-dark)" : "rgba(255,255,255,0.8)",
          fontWeight: 600,
        }}
      >
        {isAlfredo && <FaCircle size={5} style={{ color: "var(--color-bg-dark)" }} />}
        {row.source}
        {isAlfredo && " · pre-confirmed"}
      </span>
    </div>
  );
}

function DashKpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <p
        className="label-xs mb-3"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className="font-display text-[28px] font-normal leading-none text-white"
          style={{ letterSpacing: "-0.025em" }}
        >
          {value}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-white/55">{sub}</p>
    </div>
  );
}

interface Benefit {
  title: string;
  body: string;
}

const BENEFITS: Benefit[] = [
  {
    title: "Pre-seated context.",
    body: "Critical dietary flags reach your kitchen 24 hours ahead. Server notes are populated before doors open.",
  },
  {
    title: "Live channel sync.",
    body: "OpenTable and Resy bookings dedupe against Alfredo automatically. No double-seats, no overbooks.",
  },
  {
    title: "One confirmation code.",
    body: "Every Alfredo party has a short code (e.g. A92K4RD) that maps 1:1 to your POS and is searchable in a beat.",
  },
  {
    title: "Guest book that remembers.",
    body: "Dietary, cuisine, favorite table, last visit — stored per guest. Your second visit feels like their tenth.",
  },
  {
    title: "Weekly fill report.",
    body: "Covers by source, no-show rate by source, party-size distribution, weeknight lift. Emailed Monday 9am.",
  },
  {
    title: "Zero onboarding.",
    body: "No POS swap, no staff training. Claim your listing in three fields; we inherit your OpenTable availability.",
  },
];

function FoHBenefits() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-28">
      <div className="mb-14 flex items-end justify-between gap-12">
        <div>
          <p className="label-xs mb-6">For the FoH manager</p>
          <h2
            className="font-display max-w-[780px] text-[56px] font-normal leading-[1.02] md:text-[64px]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for the{" "}
            <span className="italic font-normal">6pm</span> stand-up.
          </h2>
        </div>
        <p className="body-md hidden max-w-[320px] text-ink-soft lg:block">
          Designed alongside operators running 40–120 covers a night.
          Nothing to install, nothing to babysit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="flex gap-4 border-t border-border-soft pt-6"
          >
            <FaCheck
              size={14}
              className="mt-1 shrink-0"
              style={{ color: "var(--color-ink)" }}
            />
            <div>
              <h3
                className="font-display mb-2 text-[22px] font-normal leading-[1.15]"
                style={{ letterSpacing: "-0.015em" }}
              >
                {b.title}
              </h3>
              <p className="body-md text-ink-soft">{b.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="bg-bg-alt">
      <div className="mx-auto max-w-[1440px] px-8 py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="label-xs mb-6">Pricing</p>
            <h2
              className="font-display text-[56px] font-normal leading-[1.02] md:text-[64px]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Two plans.{" "}
              <span className="italic font-normal">Zero</span> per-cover
              fees.
            </h2>
            <p className="body-lg mt-10 max-w-[640px] text-ink-soft">
              <span className="text-ink font-medium">Promoted</span> at
              $99/mo surfaces your restaurant when group filters match
              your menu — one party of four typically covers it.{" "}
              <span className="text-ink font-medium">Featured</span> at
              $499/mo reserves priority slots every night plus a
              dedicated partner-success manager.
            </p>
          </div>
          <a
            href="/plans"
            className="stagger-btn inline-flex h-14 w-fit items-center rounded-[6px] bg-bg-dark px-7 text-[16px] font-medium text-bg transition-opacity hover:opacity-95"
          >
            <StaggerText text="Compare plans" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-28">
      <div className="rounded-[12px] bg-bg-dark px-10 py-20 text-bg md:px-16">
        <div className="mx-auto max-w-[820px] text-center">
          <h2
            className="font-display text-[56px] font-normal leading-[0.98] md:text-[72px]"
            style={{ letterSpacing: "-0.035em" }}
          >
            See what tonight could{" "}
            <span className="italic font-normal">look like.</span>
          </h2>
          <p className="body-lg mt-8 text-white/75">
            We&apos;ll run a 7-day match simulation against your actual
            OpenTable history — no integration needed. If the numbers
            don&apos;t move, we&apos;ll tell you.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/plans"
              className="stagger-btn inline-flex h-14 items-center rounded-[6px] px-7 text-[16px] font-medium text-bg-dark transition-opacity hover:opacity-95"
              style={{ background: "var(--color-electric)" }}
            >
              <StaggerText text="Claim your listing" />
            </a>
            <a
              href="mailto:hello@alfredo.chat?subject=Alfredo%20demo"
              className="stagger-btn inline-flex h-14 items-center rounded-[6px] border border-white/20 px-7 text-[16px] font-medium text-white transition-colors hover:bg-white/5"
            >
              <StaggerText text="Book a demo" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

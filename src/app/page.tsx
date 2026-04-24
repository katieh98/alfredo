import type { ComponentType, SVGProps } from "react";
import { FaBriefcase, FaHeart, FaPlane } from "react-icons/fa6";
import { Footer, TopBar } from "@/components/site-chrome";
import { StaggerText } from "@/components/stagger-text";

type FaIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <Hero />
        <CommandPreview />
        <UseCases />
        <HowItWorks />
        <ConfirmationPreview />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 pb-24 pt-48">
      <div className="max-w-[1140px]">
        <h1
          className="font-display text-[clamp(64px,9.5vw,140px)] font-normal leading-[0.9]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Group reservations,{" "}
          <span className="italic font-normal">booked.</span>
        </h1>
        <p className="body-lg mt-10 max-w-[640px] text-ink-soft">
          A first date with your Hinge match, the company offsite, a weekend
          trip with six friends — plug them in. Alfredo checks
          everyone&apos;s availability, matches cuisine and dietary
          preferences, and books the restaurant autonomously.
        </p>
        <div className="mt-12 flex items-center gap-3">
          <a
            href="https://discord.com/oauth2/authorize"
            className="stagger-btn inline-flex h-14 items-center rounded-[6px] bg-bg-dark px-7 text-[16px] font-medium text-bg transition-opacity hover:opacity-95"
          >
            <StaggerText text="Add Alfredo to Discord" />
          </a>
          <a
            href="#preview"
            className="stagger-btn inline-flex h-14 items-center rounded-[6px] border border-border px-7 text-[16px] font-medium text-ink transition-colors hover:bg-bg-alt"
          >
            <StaggerText text="See a booking" />
          </a>
        </div>
        <p className="label-xs mt-8">
          Discord OAuth only · No separate account · Free while in beta
        </p>
      </div>
    </section>
  );
}

function CommandPreview() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 pb-28">
      <div className="rounded-[12px] bg-bg-card p-10 ring-1 ring-border-soft">
        <p className="label-xs mb-6">Discord · #dinner-crew</p>
        <div className="space-y-6 text-[15px] leading-[1.6]">
          <Message
            user="you"
            color="var(--color-dot)"
            body={
              <>
                <span className="text-ink">/alfredo</span>{" "}
                <span className="text-ink-soft">@alice @bob @carol</span>
              </>
            }
          />
          <Message
            user="alfredo"
            color="var(--color-ink)"
            bot
            body={
              <>
                <div className="text-ink">
                  Reading the last 5 messages for vibe…
                </div>
                <div className="mt-1 text-ink-soft">
                  Detected: thai, mid-budget, downtown, thursday evening
                </div>
                <div className="mt-3 text-ink">
                  Pinging Alice, Bob, Carol for their slots…
                </div>
              </>
            }
          />
          <Message
            user="alfredo"
            color="var(--color-ink)"
            bot
            body={
              <div className="flex flex-wrap items-center gap-2">
                <Pill dot="success">All 3 responded</Pill>
                <Pill>Overlap: Thu 7:30 – 9:00 PM</Pill>
                <Pill>Booking Cotogna…</Pill>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

interface UseCase {
  tag: string;
  title: string;
  body: string;
  icon: FaIcon;
}

const USE_CASES: UseCase[] = [
  {
    tag: "Dating",
    title: "Never lose a match.",
    body: "Connect your Hinge, Bumble, or Tinder profile once. When you and a match both tap yes to dinner, Alfredo books the first date before either of you can ghost — so you never lose a potential contact again.",
    icon: FaHeart,
  },
  {
    tag: "Work offsites",
    title: "Skip the Slack thread.",
    body: "One command instead of forty messages. Alfredo coordinates exec dinners, team lunches, and quarterly offsites across every calendar on the invite — dietary flags and budget bands handled.",
    icon: FaBriefcase,
  },
  {
    tag: "Group trips",
    title: "Every dinner, booked.",
    body: "Tokyo with six friends, wine country with the cousins, Lisbon bachelorette. Alfredo syncs time zones, cuisine prefs, and whose jetlag is worse, then books every night of the trip.",
    icon: FaPlane,
  },
];

function UseCases() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 pb-28">
      <div className="mb-14">
        <p className="label-xs mb-6">Use cases</p>
        <h2
          className="font-display max-w-[780px] text-[64px] font-normal"
          style={{ letterSpacing: "-0.03em" }}
        >
          Not just{" "}
          <span className="italic font-normal">friend</span> group
          dinners.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {USE_CASES.map((c) => {
          const Icon = c.icon;
          return (
            <article
              key={c.tag}
              className="flex flex-col rounded-[12px] bg-bg-card p-8 ring-1 ring-border-soft"
            >
              <div
                className="mb-8 flex size-12 items-center justify-center rounded-full bg-bg-alt text-ink-mute"
                aria-hidden
              >
                <Icon size={20} />
              </div>
              <p className="label-xs mb-6">{c.tag}</p>
              <h3
                className="font-display mb-4 text-[32px] font-normal leading-[1.05]"
                style={{ letterSpacing: "-0.03em" }}
              >
                {c.title}
              </h3>
              <p className="body-md text-ink-soft">{c.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Message({
  user,
  color,
  body,
  bot = false,
}: {
  user: string;
  color: string;
  body: React.ReactNode;
  bot?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-bg"
        style={{ background: color }}
      >
        {user.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[14px] font-semibold text-ink">{user}</span>
          {bot && (
            <span className="rounded-[4px] bg-bg-dark px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-bg">
              bot
            </span>
          )}
        </div>
        <div className="text-ink">{body}</div>
      </div>
    </div>
  );
}

function Pill({
  children,
  dot,
}: {
  children: React.ReactNode;
  dot?: "success" | "danger";
}) {
  const dotColor =
    dot === "success"
      ? "var(--color-electric)"
      : dot === "danger"
        ? "var(--color-coral)"
        : null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 text-[12px] font-medium text-ink">
      {dotColor && (
        <span
          className="size-[6px] rounded-full"
          style={{ background: dotColor }}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tag your people",
      body: "Slash command in Discord, a match in Hinge, a team channel in Slack. Alfredo reads the recent context — cuisine vibes, budget, neighborhood.",
      meta: "One command",
    },
    {
      n: "02",
      title: "Everyone votes",
      body: "Alfredo DMs each tagged contact with availability buttons. First-timers get a 30-second profile setup — dietary, cuisine, booking info — and it's remembered for next time.",
      meta: "Async responses",
    },
    {
      n: "03",
      title: "Alfredo books it",
      body: "Once responses are in, the agent queries restaurants against group prefs and overlapping slots, picks the best fit, and books OpenTable autonomously.",
      meta: "Autonomous booking",
    },
  ];

  return (
    <section id="how" className="bg-bg-alt">
      <div className="mx-auto max-w-[1440px] px-8 py-28">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="label-xs mb-6">How it works</p>
            <h2
              className="font-display max-w-[780px] text-[64px] font-normal"
              style={{ letterSpacing: "-0.03em" }}
            >
              Three steps from{" "}
              <span className="italic font-normal">chat</span> to{" "}
              <span className="italic font-normal">table</span>.
            </h2>
          </div>
          <p className="body-md hidden max-w-[320px] text-ink lg:block">
            No app switching. No coordination thread. No &ldquo;where does
            everyone want to go?&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="flex flex-col rounded-[12px] bg-bg-card p-8 ring-1 ring-border-soft"
            >
              <div className="font-display mb-8 text-[48px] leading-none text-ink-mute">
                {s.n}
              </div>
              <h3 className="font-display mb-3 text-[28px] font-normal leading-[1.05]">
                {s.title}
              </h3>
              <p className="body-md mb-10 text-ink-soft">{s.body}</p>
              <p className="label-xs mt-auto">{s.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfirmationPreview() {
  return (
    <section id="preview" className="mx-auto max-w-[1440px] px-8 py-28">
      <div className="mb-14">
        <p className="label-xs mb-6">The result</p>
        <h2
          className="font-display max-w-[780px] text-[64px] font-normal"
          style={{ letterSpacing: "-0.03em" }}
        >
          reservations
        </h2>
      </div>

      <div className="rounded-[12px] bg-bg-dark p-12 text-bg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-[6px] border border-white/15 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide">
              <span
                className="size-[6px] rounded-full"
                style={{ background: "var(--color-electric)" }}
                aria-hidden
              />
              Booked
            </div>
            <h3
              className="font-display text-[88px] font-normal leading-[0.95]"
              style={{ letterSpacing: "-0.035em" }}
            >
              Cotogna
            </h3>
            <p className="mt-6 text-[20px] text-white/70">
              Thursday, April 24 · 7:30 PM · Table for 4
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/15 pt-8">
              <Field label="Confirmation">
                <span className="text-[22px]">TZ-8204</span>
              </Field>
              <Field label="Invoker">Daisy</Field>
              <Field label="Cuisine">Italian · Mid-budget</Field>
              <Field label="Neighborhood">Jackson Square</Field>
            </div>
          </div>
          <aside className="flex flex-col gap-5 rounded-[8px] bg-white/5 p-6">
            <p
              className="label-xs"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Why Alfredo picked it
            </p>
            <p className="body-md text-white/85">
              Matched Alice&apos;s vegetarian constraint and the group&apos;s
              &ldquo;italian, mid-budget&rdquo; vibe from the chat. Available
              at the only 90-minute overlap all four had free.
            </p>
            <p className="body-md text-white/85">
              Booked under Daisy&apos;s name via OpenTable. Everyone got a DM
              receipt.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="label-xs mb-2"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {label}
      </p>
      <div className="text-[17px] text-white">{children}</div>
    </div>
  );
}

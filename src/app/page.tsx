import { Footer, TopBar } from "@/components/site-chrome";
import { StaggerText } from "@/components/stagger-text";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <Hero />
        <CommandPreview />
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
        <p className="label-xs mb-8">
          Discord bot · Hackathon build · Apr 2026
        </p>
        <h1
          className="font-display text-[clamp(64px,9.5vw,140px)] font-normal leading-[0.9]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Dinner for the group,{" "}
          <span className="italic font-normal">booked.</span>
        </h1>
        <p className="body-lg mt-10 max-w-[620px] text-ink-soft">
          Type{" "}
          <span className="inline-flex items-center rounded-[6px] bg-bg-muted px-2 py-0.5 text-[16px] text-ink">
            /alfredo @alice @bob
          </span>{" "}
          in any Discord channel. Alfredo checks everyone&apos;s availability,
          queries your group&apos;s food preferences, and books the best
          restaurant — autonomously.
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
      title: "Tag your friends",
      body: "Type the slash command with Discord mentions. Alfredo reads the last 5 messages for context — cuisine vibes, budget, neighborhood.",
      meta: "Slash command",
    },
    {
      n: "02",
      title: "Everyone votes",
      body: "Alfredo DMs each tagged friend with availability buttons. First-time users get a 30-second profile setup — dietary, cuisine, booking info.",
      meta: "Async responses",
    },
    {
      n: "03",
      title: "Alfredo books it",
      body: "Once all responses are in, the agent queries restaurants against group prefs + overlapping slots, picks the best fit, and books OpenTable autonomously.",
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
          <p className="body-md hidden max-w-[320px] text-ink-soft lg:block">
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
          A confirmation, <span className="italic font-normal">not</span> a
          pile of DMs.
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

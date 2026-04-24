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
    <section className="relative overflow-hidden bg-bg pb-24 pt-48">
      <iframe
        src="/hero-shader.html?theme=light"
        className="pointer-events-none absolute inset-0 size-full border-0"
        aria-hidden
        loading="lazy"
        title="Decorative background"
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-8">
        <div className="max-w-[1140px]">
          <h1
            className="font-display text-[clamp(64px,9.5vw,140px)] font-normal leading-[0.9] text-white"
            style={{ letterSpacing: "-0.04em" }}
          >
            Group reservations,{" "}
            <span className="italic font-normal">booked.</span>
          </h1>
          <p
            className="body-lg mt-10 max-w-[640px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            A first date with your Hinge match, the company offsite, a weekend
            trip with six friends — plug them in. Alfredo checks
            everyone&apos;s availability, matches cuisine and dietary
            preferences, and books the restaurant autonomously.
          </p>
          <div className="mt-12 flex items-center gap-3">
            <a
              href="https://discord.com/oauth2/authorize"
              className="stagger-btn inline-flex h-14 items-center rounded-full bg-white px-8 text-[16px] font-medium text-ink transition-opacity hover:opacity-95"
            >
              <StaggerText text="Book with Alfredo" />
            </a>
            <a
              href="#preview"
              className="stagger-btn inline-flex h-14 items-center rounded-full border border-white/30 px-7 text-[16px] font-medium text-white transition-colors hover:bg-white/10"
            >
              <StaggerText text="See a booking" />
            </a>
          </div>
          <p
            className="label-xs mt-8"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Discord OAuth only · No separate account · Free while in beta
          </p>
        </div>
      </div>
    </section>
  );
}

function CommandPreview() {
  // Discord-flavored tokens — sampled from discord.com's app to keep the
  // preview feeling native rather than osmo-neutral.
  const DISCORD = {
    chatBg: "#313338",
    embedBg: "#2b2d31",
    border: "rgba(0,0,0,0.3)",
    headerBorder: "#26282c",
    divider: "#3f4147",
    textStrong: "#f2f3f5",
    textBody: "#dbdee1",
    textMuted: "#949ba4",
    hashGray: "#80848e",
    blurple: "#5865f2",
    mentionBg: "rgba(88,101,242,0.15)",
    mentionText: "#c9cdfb",
    link: "#00a8fc",
    green: "#23a55a",
    successButton: "#248046",
    secondaryButton: "#4e5058",
    alfredoRole: "#f04e55",
    victoriaRole: "#f2a4b7",
    fontStack:
      '"gg sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  };

  return (
    // pt-28 mirrors pb-28 so the section has symmetric breathing room
    // and reads as its own chapter instead of trailing off the hero.
    <section id="preview" className="mx-auto max-w-[1440px] px-8 pb-28 pt-28">
      <div
        className="overflow-hidden rounded-[12px]"
        style={{
          background: DISCORD.chatBg,
          fontFamily: DISCORD.fontStack,
          boxShadow:
            "0 24px 60px -20px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.15)",
        }}
      >
        {/* Channel header — Discord's pattern: # + channel name + optional topic */}
        <header
          className="flex items-center gap-2 px-4 py-3"
          style={{
            borderBottom: `1px solid ${DISCORD.headerBorder}`,
            boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              color: DISCORD.hashGray,
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            #
          </span>
          <span
            style={{
              color: DISCORD.textStrong,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            dinner-crew
          </span>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 24,
              background: DISCORD.divider,
              marginLeft: 8,
              marginRight: 8,
            }}
          />
          <span style={{ color: DISCORD.textMuted, fontSize: 14 }}>
            Group dinners, booked by Alfredo
          </span>
        </header>

        {/* Message list */}
        <div className="flex flex-col gap-4 px-4 py-5">
          <DiscordMessage
            tokens={DISCORD}
            avatar={{ bg: DISCORD.blurple, letter: "V" }}
            username="victoria"
            usernameColor={DISCORD.victoriaRole}
            timestamp="Today at 7:14 PM"
          >
            <SlashCommand tokens={DISCORD}>/alfredo</SlashCommand>
            <Mention tokens={DISCORD}>@alice</Mention>{" "}
            <Mention tokens={DISCORD}>@bob</Mention>{" "}
            <Mention tokens={DISCORD}>@carol</Mention>{" "}
            <span style={{ color: DISCORD.textBody }}>
              italian, mid-budget, tomorrow
            </span>
          </DiscordMessage>

          <DiscordMessage
            tokens={DISCORD}
            avatar={{ bg: DISCORD.alfredoRole, letter: "A" }}
            username="Alfredo"
            usernameColor={DISCORD.alfredoRole}
            bot
            timestamp="Today at 7:14 PM"
          >
            <div style={{ color: DISCORD.textBody }}>
              Reading the last 5 messages for vibe…
            </div>
            <div style={{ color: DISCORD.textMuted, marginTop: 4 }}>
              Detected: italian · mid-budget · downtown · Saturday evening
            </div>
          </DiscordMessage>

          <DiscordMessage
            tokens={DISCORD}
            avatar={{ bg: DISCORD.alfredoRole, letter: "A" }}
            username="Alfredo"
            usernameColor={DISCORD.alfredoRole}
            bot
            timestamp="Today at 7:15 PM"
            compact
          >
            <DiscordEmbed
              tokens={DISCORD}
              accent={DISCORD.green}
              title="Cotogna"
              subtitle="Italian · Rustic · Jackson Square"
              description="Handles Alice’s vegetarian and Carol’s gluten-free constraints — house-made GF pasta, vegetable-forward menu."
              fields={[
                { label: "When", value: "Sat · 7:00 PM" },
                { label: "Party", value: "5 people" },
                { label: "Price", value: "$$" },
                { label: "Confirmation", value: "A47X9KLM" },
              ]}
              footer="Booked via OpenTable"
            />
          </DiscordMessage>

          <DiscordMessage
            tokens={DISCORD}
            avatar={{ bg: DISCORD.alfredoRole, letter: "A" }}
            username="Alfredo"
            usernameColor={DISCORD.alfredoRole}
            bot
            timestamp="Today at 7:15 PM"
            compact
          >
            <div style={{ color: DISCORD.textBody, marginBottom: 8 }}>
              Does this work for everyone?
            </div>
            <div className="flex flex-wrap gap-2">
              <DiscordButton variant="success" tokens={DISCORD}>
                ✓ Confirm
              </DiscordButton>
              <DiscordButton variant="secondary" tokens={DISCORD}>
                Change time
              </DiscordButton>
              <DiscordButton variant="secondary" tokens={DISCORD}>
                Pick another spot
              </DiscordButton>
            </div>
          </DiscordMessage>
        </div>
      </div>
    </section>
  );
}

interface DiscordTokens {
  chatBg: string;
  embedBg: string;
  border: string;
  headerBorder: string;
  divider: string;
  textStrong: string;
  textBody: string;
  textMuted: string;
  hashGray: string;
  blurple: string;
  mentionBg: string;
  mentionText: string;
  link: string;
  green: string;
  successButton: string;
  secondaryButton: string;
  alfredoRole: string;
  victoriaRole: string;
  fontStack: string;
}

interface DiscordMessageProps {
  tokens: DiscordTokens;
  avatar: { bg: string; letter: string };
  username: string;
  usernameColor: string;
  timestamp: string;
  bot?: boolean;
  /** Consecutive message from the same user — hides avatar + username
   *  row so the messages read as one block, per Discord's compact mode. */
  compact?: boolean;
  children: React.ReactNode;
}

function DiscordMessage({
  tokens,
  avatar,
  username,
  usernameColor,
  timestamp,
  bot = false,
  compact = false,
  children,
}: DiscordMessageProps) {
  return (
    <div
      className="flex gap-4"
      style={{
        paddingLeft: compact ? 56 : 0, // align with message body when avatar is hidden
      }}
    >
      {!compact && (
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
          style={{ background: avatar.bg }}
          aria-hidden
        >
          {avatar.letter}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {!compact && (
          <div className="flex items-baseline gap-2">
            <span
              style={{
                color: usernameColor,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.005em",
              }}
            >
              {username}
            </span>
            {bot && (
              <span
                style={{
                  background: tokens.blurple,
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  padding: "1px 4px",
                  borderRadius: 3,
                  lineHeight: 1.3,
                  textTransform: "uppercase",
                }}
              >
                App
              </span>
            )}
            <span style={{ color: tokens.textMuted, fontSize: 12 }}>
              {timestamp}
            </span>
          </div>
        )}
        <div
          style={{
            color: tokens.textBody,
            fontSize: 15,
            lineHeight: 1.375,
            marginTop: compact ? 0 : 2,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Mention({
  tokens,
  children,
}: {
  tokens: DiscordTokens;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        background: tokens.mentionBg,
        color: tokens.mentionText,
        padding: "0 2px",
        borderRadius: 3,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function SlashCommand({
  tokens,
  children,
}: {
  tokens: DiscordTokens;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        background: tokens.mentionBg,
        color: tokens.mentionText,
        padding: "0 4px",
        borderRadius: 3,
        fontWeight: 500,
        marginRight: 4,
      }}
    >
      {children}
    </span>
  );
}

interface EmbedProps {
  tokens: DiscordTokens;
  accent: string;
  title: string;
  subtitle: string;
  description: string;
  fields: { label: string; value: string }[];
  footer: string;
}

function DiscordEmbed({
  tokens,
  accent,
  title,
  subtitle,
  description,
  fields,
  footer,
}: EmbedProps) {
  return (
    <div
      className="relative mt-1 max-w-[520px] overflow-hidden"
      style={{
        background: tokens.embedBg,
        borderRadius: 4,
        paddingLeft: 16,
      }}
    >
      {/* 4px color bar — Discord embed signature */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 4, background: accent, borderRadius: "4px 0 0 4px" }}
      />
      <div className="flex flex-col gap-2 px-3 py-3">
        <div style={{ color: tokens.textMuted, fontSize: 12, fontWeight: 500 }}>
          {subtitle}
        </div>
        <div
          style={{
            color: tokens.textStrong,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: tokens.textBody,
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          {description}
        </div>
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col">
              <span
                style={{
                  color: tokens.textStrong,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {f.label}
              </span>
              <span
                style={{
                  color: tokens.textBody,
                  fontSize: 13,
                }}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            color: tokens.textMuted,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

function DiscordButton({
  tokens,
  variant,
  children,
}: {
  tokens: DiscordTokens;
  variant: "success" | "secondary" | "primary" | "danger";
  children: React.ReactNode;
}) {
  const bg =
    variant === "success"
      ? tokens.successButton
      : variant === "primary"
        ? tokens.blurple
        : variant === "danger"
          ? "#da373c"
          : tokens.secondaryButton;
  return (
    <button
      type="button"
      className="inline-flex h-8 cursor-pointer items-center rounded-[3px] px-4 text-[14px] text-white transition-opacity hover:opacity-90"
      style={{
        background: bg,
        fontWeight: 500,
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </button>
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

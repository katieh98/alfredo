"use client";

/**
 * Login / role selection.
 * - Restaurant → opens an inline login form; submit hands off to NextAuth
 *   credentials provider (from main) so the demo auth flow from
 *   /dashboard still works.
 * - Diner → routes directly to /setup. The diner flow is Discord OAuth
 *   only (the tagline at the bottom of the page), so there's nothing to
 *   fill in here — just a pass-through.
 */
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FaUtensils,
  FaUser,
  FaArrowRight,
  FaChartLine,
  FaXmark,
  FaDiscord,
} from "react-icons/fa6";
import { Footer, TopBar } from "@/components/site-chrome";

type Role = "restaurant" | "diner";

export default function LoginPage() {
  const router = useRouter();
  function onRoleSelect(role: Role) {
    if (role === "restaurant") {
      router.push("/dashboard");
      return;
    }
    signIn("credentials", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main
        className="login-hero flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-40"
        style={{ background: "var(--color-bg-dark)", color: "#e1e1e1" }}
      >
        <div className="mb-12 flex max-w-[560px] flex-col items-center text-center">
          <p
            className="label-xs mb-6 inline-flex items-center gap-2"
            style={{ color: "rgba(225,225,225,0.55)" }}
          >
            <span
              className="size-[6px] rounded-full"
              style={{ background: "var(--color-electric)" }}
              aria-hidden
            />
            Sign in
          </p>
          <h1
            className="font-display text-[clamp(40px,5vw,64px)] font-normal leading-[1.0]"
            style={{ letterSpacing: "-0.035em", color: "#f4f4f4" }}
          >
            Who are you{" "}
            <span className="italic" style={{ color: "rgba(225,225,225,0.55)" }}>
              tonight?
            </span>
          </h1>
          <p
            className="body-lg mt-5"
            style={{ color: "rgba(225,225,225,0.7)" }}
          >
            Alfredo works differently depending on which side of the table
            you&apos;re on. Pick one — you can switch accounts later.
          </p>
        </div>

        <div className="grid w-full max-w-[880px] grid-cols-1 gap-4 md:grid-cols-2">
          <RoleTile
            icon={<FaUtensils size={22} />}
            eyebrow="For restaurants"
            title="I run a spot"
            description="See which dinners Alfredo booked tonight, who's coming, and their dietary flags. Confirm or decline in one click."
            cta="Open the dashboard"
            onClick={() => onRoleSelect("restaurant")}
            secondary={
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 text-[13px] underline-offset-4 hover:underline"
                style={{ color: "rgba(225,225,225,0.65)" }}
              >
                <FaChartLine size={11} />
                See pricing & promotion
              </Link>
            }
          />
          <RoleTile
            icon={<FaUser size={20} />}
            eyebrow="For diners"
            title="I'm eating out"
            description="Set dietary restrictions, cuisine preferences, and booking info once. Alfredo uses these every time a friend tags you in Discord."
            cta="Edit my preferences"
            onClick={() => onRoleSelect("diner")}
          />
        </div>

        <p
          className="mt-10 text-[14px]"
          style={{ color: "rgba(225,225,225,0.55)" }}
        >
          Diners use Discord OAuth · restaurants use account login ·{" "}
          <Link
            href="/"
            className="underline underline-offset-2 transition-colors hover:text-white"
          >
            back to home
          </Link>
        </p>
      </main>
      <div style={{ background: "var(--color-bg)" }}>
        <Footer />
      </div>

    </div>
  );
}

interface RoleTileProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  secondary?: ReactNode;
}

function RoleTile({
  icon,
  eyebrow,
  title,
  description,
  cta,
  onClick,
  secondary,
}: RoleTileProps) {
  return (
    <div
      className="group relative flex flex-col items-start gap-5 rounded-[16px] p-8 text-left transition-all"
      style={{
        background: "#312e2e",
        boxShadow:
          "inset 0 0 0 1px rgba(244,244,244,0.06), 0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
    >
      {/* Primary click target — invisible button covering the tile so the
          whole card is pressable, but the secondary link (rendered above)
          remains independently clickable. */}
      <button
        type="button"
        onClick={onClick}
        aria-label={title}
        className="absolute inset-0 z-0 cursor-pointer rounded-[16px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-electric)]"
      />

      <div
        className="pointer-events-none relative z-10 flex size-12 items-center justify-center rounded-[12px] transition-colors"
        style={{
          background: "rgba(244,244,244,0.05)",
          color: "#f4f4f4",
        }}
      >
        {icon}
      </div>

      <div className="pointer-events-none relative z-10 flex flex-col gap-2.5">
        <div
          className="text-[11px] font-semibold uppercase"
          style={{
            letterSpacing: "0.08em",
            color: "rgba(225,225,225,0.55)",
          }}
        >
          {eyebrow}
        </div>
        <h2
          className="font-display text-[32px] font-normal leading-[1.05]"
          style={{ letterSpacing: "-0.03em", color: "#f4f4f4" }}
        >
          {title}
        </h2>
        <p
          className="text-[15px]"
          style={{
            lineHeight: "22px",
            letterSpacing: "-0.005em",
            color: "rgba(225,225,225,0.7)",
          }}
        >
          {description}
        </p>
      </div>

      <div
        className="pointer-events-none relative z-10 mt-auto flex items-center gap-2 text-[14px] transition-transform group-hover:translate-x-1"
        style={{
          color: "#f4f4f4",
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.005em",
        }}
      >
        <span>{cta}</span>
        <FaArrowRight size={12} style={{ color: "var(--color-electric)" }} />
      </div>

      {secondary && (
        <div
          className="relative z-20 mt-1 w-full border-t pt-4"
          style={{ borderColor: "rgba(244,244,244,0.08)" }}
        >
          {secondary}
        </div>
      )}
    </div>
  );
}

interface RestaurantLoginModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Restaurant operator login. Stub auth for now — any submission routes
 * to /dashboard. Real auth will hook in here (email+password via a real
 * identity provider) without changing the surrounding UI. Escape and
 * backdrop click both dismiss.
 */
function RestaurantLoginModal({ onClose, onSubmit }: RestaurantLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Lock scroll while modal is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Stub — real auth plugs in here.
    onSubmit();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurant-login-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(10,9,9,0.78)", backdropFilter: "blur(6px)" }}
      />

      {/* Card */}
      <div
        className="relative flex w-full max-w-[440px] flex-col rounded-[16px] p-8"
        style={{
          background: "#312e2e",
          color: "#f4f4f4",
          boxShadow:
            "inset 0 0 0 1px rgba(244,244,244,0.06), 0 30px 80px -20px rgba(0,0,0,0.7)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-electric)]"
        >
          <FaXmark size={14} />
        </button>

        <div
          className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase"
          style={{
            letterSpacing: "0.08em",
            color: "rgba(225,225,225,0.55)",
          }}
        >
          <FaUtensils size={11} />
          For restaurants
        </div>

        <h2
          id="restaurant-login-title"
          className="font-display text-[32px] font-normal leading-[1.05]"
          style={{ letterSpacing: "-0.03em", color: "#f4f4f4" }}
        >
          Sign in to your restaurant.
        </h2>

        <p
          className="mt-3 text-[15px]"
          style={{
            color: "rgba(225,225,225,0.7)",
            lineHeight: "22px",
            letterSpacing: "-0.005em",
          }}
        >
          Enter your account email and password. Tonight&apos;s reservations
          are one click away.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@cotogna.com"
              className="h-11 w-full rounded-[10px] px-4 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_2px_var(--color-electric)]"
              style={{
                background: "rgba(244,244,244,0.05)",
                boxShadow: "inset 0 0 0 1px rgba(244,244,244,0.08)",
                color: "#f4f4f4",
                letterSpacing: "-0.005em",
              }}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-[10px] px-4 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_2px_var(--color-electric)]"
              style={{
                background: "rgba(244,244,244,0.05)",
                boxShadow: "inset 0 0 0 1px rgba(244,244,244,0.08)",
                color: "#f4f4f4",
                letterSpacing: "-0.005em",
              }}
            />
          </Field>

          <button
            type="submit"
            className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              background: "var(--color-electric)",
              color: "var(--color-bg-dark-2)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            Continue to dashboard
            <FaArrowRight size={12} />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase">
          <div
            className="h-px flex-1"
            style={{ background: "rgba(244,244,244,0.08)" }}
          />
          <span
            style={{
              color: "rgba(225,225,225,0.4)",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            or
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "rgba(244,244,244,0.08)" }}
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-electric)]"
          style={{
            background: "rgba(244,244,244,0.05)",
            boxShadow: "inset 0 0 0 1px rgba(244,244,244,0.08)",
            color: "#f4f4f4",
            fontWeight: 510,
            fontVariationSettings: "'wght' 510",
          }}
        >
          <FaDiscord size={16} />
          Continue with Discord
        </button>

        <p
          className="mt-6 text-center text-[12px]"
          style={{ color: "rgba(225,225,225,0.5)" }}
        >
          No account?{" "}
          <Link
            href="/plans"
            className="underline underline-offset-2 hover:text-white"
          >
            See pricing & sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[11px] font-semibold uppercase"
        style={{
          letterSpacing: "0.08em",
          color: "rgba(225,225,225,0.55)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

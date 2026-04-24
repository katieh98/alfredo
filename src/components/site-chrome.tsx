import Link from "next/link";
import { StaggerText } from "@/components/stagger-text";

export function Wordmark({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "#f4f4f4" : "var(--color-ink)";
  return (
    <Link href="/" className="inline-flex items-center gap-[6px]">
      <span
        className="font-display text-[22px] leading-none"
        style={{ letterSpacing: "-0.04em", color: textColor }}
      >
        alfredo
      </span>
      <span
        className="size-[7px] rounded-full"
        style={{ background: "var(--color-dot)" }}
        aria-hidden
      />
    </Link>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 1.25h16M0 10.75h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Floating dark pill nav, 1:1 with osmo.supply pattern.
 * - centered horizontally, fixed top offset
 * - max-width ~720px (upsized from osmo's 38em to match visual weight at 1440w)
 * - dark fill (#201d1d, --color-neutral-800) with subtle light outline
 * - Join/primary CTA in electric lime (#a1ff62)
 * - Text 16px, inner buttons 48h, bar 64h
 */
export function TopBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <header
        className="pointer-events-auto relative flex h-[64px] w-full max-w-[720px] items-center justify-between px-2 text-white"
        style={{
          background: "var(--color-bg-dark-2)",
          borderRadius: "7px",
          boxShadow:
            "inset 0 0 0 1px rgba(244,244,244,0.1), 0 8px 24px -8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Left: Menu */}
        <details className="group relative">
          <summary className="inline-flex h-12 cursor-pointer list-none items-center gap-[10px] rounded-[6px] px-4 text-[16px] font-medium text-white/85 transition-colors hover:text-white">
            <HamburgerIcon />
            <span>Menu</span>
          </summary>
          <nav className="absolute left-0 top-[calc(100%+8px)] w-60 rounded-[8px] bg-bg-dark-2 p-2 text-[15px] shadow-lg ring-1 ring-inset ring-white/10">
            <NavLink href="/#how">How it works</NavLink>
            <NavLink href="/#preview">Preview</NavLink>
            <NavLink href="/setup">Setup</NavLink>
            <NavLink href="/login">Sign in</NavLink>
            <div className="my-1 border-t border-white/10" />
            <NavLink href="https://github.com/katieh98/alfredo">
              GitHub
            </NavLink>
          </nav>
        </details>

        {/* Center: wordmark (absolute-positioned to stay true-centered) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto">
            <Wordmark variant="light" />
          </div>
        </div>

        {/* Right: Login + Add bot */}
        <div className="flex h-12 items-center gap-[6px]">
          <a
            href="/login"
            className="stagger-btn inline-flex h-12 items-center rounded-[6px] bg-white/5 px-5 text-[16px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <StaggerText text="Login" />
          </a>
          <a
            href="https://discord.com/oauth2/authorize"
            className="stagger-btn inline-flex h-12 items-center rounded-[6px] px-5 text-[16px] font-medium transition-opacity hover:opacity-95"
            style={{
              background: "var(--color-electric)",
              color: "var(--color-bg-dark-2)",
            }}
          >
            <StaggerText text="Add bot" />
          </a>
        </div>
      </header>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="block rounded-[4px] px-3 py-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-8">
          <Wordmark />
          <p className="label-xs">Ship to Prod Hackathon · 2026</p>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-[14px] text-ink-soft hover:text-ink">
            Privacy
          </a>
          <a href="#" className="text-[14px] text-ink-soft hover:text-ink">
            Terms
          </a>
          <a
            href="https://github.com/katieh98/alfredo"
            className="text-[14px] text-ink-soft hover:text-ink"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

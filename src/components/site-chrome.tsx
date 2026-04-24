import Link from "next/link";
import { StaggerText } from "@/components/stagger-text";

export function Wordmark({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const color = variant === "light" ? "#f4f4f4" : "var(--color-ink)";
  return (
    <Link
      href="/"
      aria-label="Alfredo"
      className="inline-flex items-end gap-[6px]"
      style={{ color }}
    >
      <svg
        viewBox="0 0 2903 580"
        className="h-[20px] w-auto"
        fill="currentColor"
        aria-hidden
      >
        <path d="M482.4 569.6H349.6L325.6 472.8H151.2L126.4 569.6H0L124.8 126.4C147.2 47.1999 174.4 3.99999 244.8 3.99999C310.4 3.99999 341.6 46.3999 362.4 124.8L482.4 569.6ZM240.8 127.2L179.2 366.4H299.2L240.8 127.2ZM779.312 569.6H601.712C513.712 569.6 484.112 537.6 484.112 448.8V9.59997H608.912V456.8H779.312V569.6ZM913.887 569.6H789.887V9.59997H1071.49V122.4H913.887V228H1058.69V340.8H913.887V569.6ZM1403.53 322.4L1498.73 569.6H1361.93L1286.73 348H1222.73V569.6H1098.73V9.59997H1297.93C1417.13 9.59997 1483.53 85.6 1483.53 178.4C1483.53 237.6 1457.13 292 1403.53 322.4ZM1293.13 121.6H1222.73V244.8H1293.13C1337.13 244.8 1361.93 217.6 1361.93 184C1361.93 148 1337.13 121.6 1293.13 121.6ZM1828.17 569.6H1516.17V9.59997H1828.17V122.4H1640.17V229.6H1814.57V340.8H1640.17V456.8H1828.17V569.6ZM1990.49 569.6H1863.29V9.59997H1990.49C2209.69 9.59997 2311.29 132 2311.29 289.6C2311.29 445.6 2209.69 569.6 1990.49 569.6ZM1987.29 122.4V456.8H2001.69C2106.49 456.8 2180.89 402.4 2180.89 289.6C2180.89 177.6 2107.29 122.4 2003.29 122.4H1987.29ZM2605 579.2C2439.4 579.2 2307.4 449.6 2307.4 289.6C2307.4 129.6 2440.2 0 2605 0C2769.8 0 2902.6 132 2902.6 289.6C2902.6 449.6 2770.6 579.2 2605 579.2ZM2605 460C2700.2 460 2768.2 384.8 2768.2 289.6C2768.2 194.4 2699.4 119.2 2605 119.2C2509.8 119.2 2441.8 194.4 2441.8 289.6C2441.8 384.8 2509.8 460 2605 460Z" />
      </svg>
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

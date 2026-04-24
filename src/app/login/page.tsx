"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Footer, TopBar } from "@/components/site-chrome";
import { StaggerText } from "@/components/stagger-text";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main
        className="login-hero flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-48"
        style={{
          background: "var(--color-bg-dark)",
          color: "#e1e1e1",
        }}
      >
        <div className="mb-12 flex max-w-[440px] flex-col items-center text-center">
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
            Welcome back.
          </h1>
          <p
            className="body-lg mt-4"
            style={{ color: "rgba(225,225,225,0.7)" }}
          >
            Alfredo uses Discord as your account. Sign in with Discord to edit
            your profile, review past bookings, or manage notifications.
          </p>
        </div>

        <div
          className="flex w-full max-w-[440px] flex-col gap-6 rounded-[16px] p-8"
          style={{
            background: "#312e2e",
            boxShadow:
              "inset 0 0 0 1px rgba(244,244,244,0.06), 0 20px 80px -20px rgba(0,0,0,0.6)",
          }}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => signIn("credentials", { callbackUrl: "/profile" })}
              className="stagger-btn flex h-14 w-full items-center justify-center rounded-[8px] text-[16px] font-semibold"
              style={{
                background: "var(--color-electric)",
                color: "var(--color-bg-dark-2)",
              }}
            >
              <StaggerText text="Sign in" />
            </button>
          </div>

          <p
            className="text-center text-[13px]"
            style={{ color: "rgba(225,225,225,0.55)" }}
          >
            By signing in, you agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p
          className="mt-8 text-[14px]"
          style={{ color: "rgba(225,225,225,0.55)" }}
        >
          New to Alfredo?{" "}
          <Link
            href="/"
            className="font-semibold underline underline-offset-2 transition-colors hover:text-white"
            style={{ color: "#f4f4f4" }}
          >
            Start with the demo
          </Link>
        </p>
      </main>
      <div style={{ background: "var(--color-bg)" }}>
        <Footer />
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-semibold uppercase tracking-wide"
      style={{
        color: "rgba(225,225,225,0.7)",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </label>
  );
}

function DiscordGlyph() {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M15.25 1.33A14.7 14.7 0 0 0 11.7.24a10.3 10.3 0 0 0-.47.95 13.64 13.64 0 0 0-4.06 0 10.1 10.1 0 0 0-.48-.95 14.64 14.64 0 0 0-3.56 1.1C.85 4.73.23 8.04.54 11.31a14.8 14.8 0 0 0 4.5 2.26c.36-.49.68-1 .96-1.55a9.57 9.57 0 0 1-1.51-.72c.13-.09.25-.19.37-.29a10.54 10.54 0 0 0 8.98 0c.12.1.24.2.37.29-.48.29-.99.53-1.52.72.28.55.6 1.07.97 1.55a14.75 14.75 0 0 0 4.5-2.26c.35-3.79-.62-7.06-2.91-9.98ZM6.4 9.3c-.88 0-1.6-.82-1.6-1.81s.7-1.82 1.6-1.82 1.61.82 1.6 1.82c0 .99-.71 1.81-1.6 1.81Zm5.9 0c-.88 0-1.6-.82-1.6-1.81s.7-1.82 1.6-1.82 1.62.82 1.6 1.82c0 .99-.7 1.81-1.6 1.81Z" />
    </svg>
  );
}

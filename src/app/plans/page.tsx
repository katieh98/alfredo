/**
 * Plans & Pricing — restaurant promotion page.
 *
 * Modeled 1:1 on osmo.supply/plans visually: two 16px-radius cards at
 * 560×~900 with 60px padding, a Haffer 80px hero, and inline Quarterly /
 * Annually toggles on each card. Adapted to Alfredo's restaurant domain:
 * the thing the buyer gets is ranking + badging in the candidate list that
 * Alfredo shows to diner sessions, not a content library.
 *
 * Lives at /plans (standalone marketing surface) so both the login tile
 * and the future restaurant dashboard can link to it.
 */
import Link from "next/link";
import { Footer, TopBar } from "@/components/site-chrome";
import { PricingCards } from "./PricingCards";

export default function PlansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main
        className="flex flex-1 flex-col items-center px-6 pb-24 pt-40"
        style={{ background: "var(--color-bg-dark)", color: "#f4f4f4" }}
      >
        {/* Hero */}
        <div className="flex max-w-[1120px] flex-col items-center text-center">
          <p
            className="label-xs mb-6 inline-flex items-center gap-2"
            style={{ color: "rgba(225,225,225,0.55)" }}
          >
            <span
              className="size-[6px] rounded-full"
              style={{ background: "var(--color-accent)" }}
              aria-hidden
            />
            For restaurants
          </p>
          <h1
            className="font-display font-normal"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "#f4f4f4",
            }}
          >
            Fill your tables on Alfredo.
          </h1>
          <p
            className="mt-8 max-w-[640px] text-[17px]"
            style={{
              color: "rgba(225,225,225,0.7)",
              lineHeight: "26px",
              letterSpacing: "-0.005em",
            }}
          >
            Every reservation Alfredo books is for a group that&apos;s already
            decided where to eat. Promote your spot to move up the candidate
            list — and skip the platform booking fee while you&apos;re at it.
          </p>
        </div>

        {/* Baseline mention */}
        <div
          className="mt-10 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px]"
          style={{
            background: "rgba(244,244,244,0.06)",
            boxShadow: "inset 0 0 0 1px rgba(244,244,244,0.08)",
            color: "rgba(225,225,225,0.8)",
          }}
        >
          <span
            className="size-[6px] rounded-full"
            style={{ background: "rgba(244,244,244,0.5)" }}
            aria-hidden
          />
          <span>
            Every restaurant is <strong className="font-medium text-white">Listed</strong>{" "}
            for free. Promoted and Featured move you up the list.
          </span>
        </div>

        {/* Pricing cards */}
        <div className="mt-14 w-full max-w-[1140px]">
          <PricingCards />
        </div>

        {/* Footnote */}
        <p
          className="mt-12 text-center text-[14px]"
          style={{ color: "rgba(225,225,225,0.55)" }}
        >
          Billed through Stripe · Cancel anytime · No setup fees ·{" "}
          <Link
            href="/login"
            className="underline underline-offset-2 transition-colors hover:text-white"
          >
            Sign in to manage billing
          </Link>
        </p>
      </main>
      <div style={{ background: "var(--color-bg)" }}>
        <Footer />
      </div>
    </div>
  );
}

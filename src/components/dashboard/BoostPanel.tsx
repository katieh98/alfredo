import { FaBolt } from "react-icons/fa6";
import { PricingCards } from "@/app/plans/PricingCards";

/**
 * Boost panel — the restaurant-operator's upgrade / promotion surface,
 * reached from the sidebar's "Boost panel" nav item. Lives inside the
 * dashboard shell (so the sidebar stays visible) and reuses the shared
 * PricingCards component in its light-theme variant so the toggle reads
 * correctly against the dashboard's neutral background.
 */
export function BoostPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main className="dop-no-scrollbar flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-8 pb-16 pt-10">
        <header className="flex flex-col items-start gap-4">
          <span
            className="inline-flex h-[26px] items-center gap-2 rounded-full px-3 text-[11px] font-semibold uppercase"
            style={{
              letterSpacing: "0.08em",
              background: "var(--color-accent-light)",
              color: "var(--color-accent)",
              boxShadow: "inset 0 0 0 1px var(--color-accent-border)",
            }}
          >
            <FaBolt size={11} />
            Boost panel
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              color: "var(--color-fg-strong)",
            }}
          >
            Turn Alfredo into a fuller dining room.
          </h1>
          <p
            className="max-w-[640px] text-[16px]"
            style={{
              color: "var(--color-fg-secondary)",
              lineHeight: "24px",
              letterSpacing: "-0.005em",
            }}
          >
            Every reservation Alfredo books is for a group that&apos;s already
            decided where to eat. Promote your spot to move up the candidate
            list and skip the platform booking fee on every cover we send.
          </p>
        </header>

        <PricingCards theme="light" />

        <footer
          className="rounded-[12px] border px-5 py-4 text-[13px]"
          style={{
            background: "var(--color-surface-raised)",
            borderColor: "var(--color-border-subtle)",
            color: "var(--color-fg-secondary)",
            lineHeight: "20px",
          }}
        >
          Billed through Stripe · Cancel anytime · No setup fees · Questions?
          Email{" "}
          <a
            href="mailto:partners@alfredo.app"
            className="underline underline-offset-2 hover:text-[var(--color-fg-strong)]"
          >
            partners@alfredo.app
          </a>
          .
        </footer>
      </main>
    </div>
  );
}

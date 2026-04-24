"use client";

/**
 * Pricing cards — two-tier layout (Promoted / Featured) with a single
 * Monthly / Annually toggle above both cards, matching osmo.supply/plans.
 *
 * Token choices:
 * - Promoted card = --color-accent (#1132F5) to reinforce the blue "active"
 *   signal the rest of the app already uses for selected candidates.
 * - Featured card = --color-bg-dark-2 (#201d1d) — osmo's standard dark tier.
 * - 560×auto cards, 60px padding, 16px radius, 20px gap, exactly as osmo.
 */
import { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa6";

type Cadence = "monthly" | "annually";

interface Tier {
  id: "promoted" | "featured";
  eyebrow: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  suffix: string;
  description: string;
  cta: string;
  annotation?: string;
  sections: {
    heading: string;
    items: { lead?: string; text: string }[];
  }[];
  accent: boolean;
}

const TIERS: Tier[] = [
  {
    id: "promoted",
    eyebrow: "Most popular",
    name: "Promoted",
    priceMonthly: 99,
    priceAnnually: 79,
    suffix: "per month",
    description:
      "Move to the top of Alfredo's candidate list when a group's cuisine and dietary filters match your menu. The booking is on us.",
    cta: "Promote my restaurant",
    sections: [
      {
        heading: "Reach",
        items: [
          { lead: "2×", text: "Boost in candidate ranking when filters match" },
          {
            lead: "Pick",
            text: "Eligible for Alfredo's Pick badge on every session",
          },
          { lead: "0", text: "Platform booking fees — Alfredo covers them" },
        ],
      },
      {
        heading: "Ops",
        items: [
          { lead: "Live", text: "Menu + availability synced from OpenTable" },
          { lead: "Diet", text: "Match priority when groups have allergies" },
          { lead: "24h", text: "Email support, next-business-day replies" },
        ],
      },
    ],
    accent: true,
  },
  {
    id: "featured",
    eyebrow: "Category sponsor",
    name: "Featured",
    priceMonthly: 499,
    priceAnnually: 399,
    suffix: "per month",
    description:
      "Own a cuisine on Alfredo. Reserved slots every night, custom matching rules, and a dedicated partner-success contact.",
    cta: "Talk to sales",
    sections: [
      {
        heading: "Everything in Promoted, plus",
        items: [
          { lead: "1", text: "Dedicated partner-success manager" },
          {
            lead: "Own",
            text: "Category sponsorship — “Alfredo's Italian partner”",
          },
          { lead: "3+", text: "Priority booking slots reserved nightly" },
        ],
      },
      {
        heading: "Control",
        items: [
          { lead: "Rules", text: "Custom match rules — party size, budget bands" },
          {
            lead: "Data",
            text: "Cross-session analytics — conversion, cancellations, LTV",
          },
          { lead: "API", text: "Direct POS + kitchen ticketing integration" },
        ],
      },
    ],
    accent: false,
  },
];

type Theme = "dark" | "light";

interface PricingCardsProps {
  /** "dark" = osmo-dark marketing page (/plans), "light" = inside the
   *  dashboard shell (/dashboard/boost). Only affects the shared toggle
   *  around the cards; the cards themselves are always solid-coloured. */
  theme?: Theme;
}

export function PricingCards({ theme = "dark" }: PricingCardsProps) {
  const [cadence, setCadence] = useState<Cadence>("monthly");
  return (
    <div className="flex flex-col items-center">
      {/* Shared billing toggle — one control for both cards, centered above. */}
      <CadenceToggle cadence={cadence} onChange={setCadence} theme={theme} />

      <div className="mt-10 grid w-full gap-5 md:grid-cols-2">
        {TIERS.map((tier) => (
          <Card key={tier.id} tier={tier} cadence={cadence} />
        ))}
      </div>
    </div>
  );
}

interface CadenceToggleProps {
  cadence: Cadence;
  onChange: (next: Cadence) => void;
  theme: Theme;
}

/**
 * Single, shared billing-cycle pill. Sits above the two cards and drives
 * both prices at once — less visual noise than per-card toggles, and
 * matches the mental model (you pick a cadence once).
 */
function CadenceToggle({ cadence, onChange, theme }: CadenceToggleProps) {
  const trackBg =
    theme === "dark" ? "rgba(244,244,244,0.06)" : "rgba(32,29,29,0.05)";
  const trackRing =
    theme === "dark" ? "rgba(244,244,244,0.12)" : "rgba(32,29,29,0.08)";
  return (
    <div
      role="tablist"
      aria-label="Billing cycle"
      className="inline-flex items-center gap-1 rounded-full p-1"
      style={{
        background: trackBg,
        boxShadow: `inset 0 0 0 1px ${trackRing}`,
      }}
    >
      <ToggleButton
        label="Monthly"
        active={cadence === "monthly"}
        onClick={() => onChange("monthly")}
        theme={theme}
      />
      <ToggleButton
        label="Annually"
        active={cadence === "annually"}
        onClick={() => onChange("annually")}
        hint="Save 20%"
        theme={theme}
      />
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  hint?: string;
  theme: Theme;
}

function ToggleButton({
  label,
  active,
  onClick,
  hint,
  theme,
}: ToggleButtonProps) {
  const activeBg = theme === "dark" ? "#f4f4f4" : "var(--color-bg-dark-2)";
  const activeColor = theme === "dark" ? "var(--color-bg-dark-2)" : "#f4f4f4";
  const idleColor =
    theme === "dark" ? "rgba(244,244,244,0.7)" : "var(--color-fg-muted)";
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[12px] uppercase transition-colors"
      style={{
        letterSpacing: "0.06em",
        background: active ? activeBg : "transparent",
        color: active ? activeColor : idleColor,
        fontWeight: 600,
      }}
    >
      <span>{label}</span>
      {hint && (
        <span
          className="normal-case tracking-normal"
          style={{ opacity: active ? 0.8 : 0.55 }}
        >
          · {hint}
        </span>
      )}
    </button>
  );
}

interface CardProps {
  tier: Tier;
  cadence: Cadence;
}

function Card({ tier, cadence }: CardProps) {
  const price = cadence === "monthly" ? tier.priceMonthly : tier.priceAnnually;
  const bg = tier.accent ? "var(--color-accent)" : "var(--color-bg-dark-2)";
  const ink = "#f4f4f4";
  const mutedInk = tier.accent
    ? "rgba(255,255,255,0.75)"
    : "rgba(244,244,244,0.7)";
  const chipBg = tier.accent
    ? "rgba(255,255,255,0.14)"
    : "rgba(244,244,244,0.06)";
  const chipBorder = tier.accent
    ? "rgba(255,255,255,0.22)"
    : "rgba(244,244,244,0.12)";
  const divider = tier.accent
    ? "rgba(255,255,255,0.18)"
    : "rgba(244,244,244,0.08)";

  return (
    <article
      className="relative flex flex-col rounded-[16px] p-[60px]"
      style={{ background: bg, color: ink }}
    >
      {/* Eyebrow pill + script-style annotation (accent card only) */}
      <div className="flex items-start justify-between">
        <span
          className="inline-flex items-center rounded-[4px] px-2.5 py-1 text-[11px] uppercase"
          style={{
            letterSpacing: "0.06em",
            background: chipBg,
            color: ink,
            boxShadow: `inset 0 0 0 1px ${chipBorder}`,
          }}
        >
          {tier.eyebrow}
        </span>
        {tier.annotation && (
          <span
            className="font-display italic"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 20,
              letterSpacing: "-0.01em",
              lineHeight: "22px",
              transform: "rotate(-6deg)",
              transformOrigin: "right center",
              marginRight: 4,
            }}
          >
            {tier.annotation}
          </span>
        )}
      </div>

      {/* Tier name */}
      <h2
        className="mt-8 font-display font-normal"
        style={{
          fontSize: 48,
          lineHeight: 1.0,
          letterSpacing: "-0.04em",
          color: ink,
        }}
      >
        {tier.name}
      </h2>

      {/* Price row */}
      <div className="mt-6 flex items-baseline gap-3">
        <span
          className="font-display"
          style={{
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: ink,
          }}
        >
          ${price}
        </span>
        <span
          className="text-[13px]"
          style={{ color: mutedInk, letterSpacing: "-0.005em" }}
        >
          {tier.suffix}
        </span>
      </div>

      {/* Description */}
      <p
        className="mt-8 text-[16px]"
        style={{
          color: mutedInk,
          lineHeight: "24px",
          letterSpacing: "-0.01em",
        }}
      >
        {tier.description}
      </p>

      {/* CTA — both tiers flow through the mock Stripe checkout so the
       *  demo has a complete purchase path. Real product can route
       *  Featured to a sales-contact form instead. */}
      <a
        href={`/dashboard/boost/checkout?tier=${tier.id}&cadence=${cadence}`}
        className="group mt-8 inline-flex h-[60px] items-center justify-between rounded-[10px] px-6 transition-opacity hover:opacity-90"
        style={{
          background: tier.accent ? "#f4f4f4" : "var(--color-accent)",
          color: tier.accent ? "var(--color-accent)" : "#f4f4f4",
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          fontVariationSettings: "'wght' 510",
        }}
      >
        <span>{tier.cta}</span>
        <FaArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </a>

      {/* Benefits sections */}
      <div
        className="mt-10 flex flex-col gap-8 border-t pt-8"
        style={{ borderColor: divider }}
      >
        {tier.sections.map((section, i) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h3
              className="text-[11px] uppercase"
              style={{
                letterSpacing: "0.08em",
                color: mutedInk,
                fontWeight: 600,
              }}
            >
              {section.heading}
            </h3>
            {section.items.map((item) => (
              <div key={item.text} className="flex items-start gap-4">
                {item.lead ? (
                  <div
                    className="flex h-9 min-w-[44px] shrink-0 items-center justify-center rounded-[8px] px-2 text-[14px]"
                    style={{
                      background: chipBg,
                      boxShadow: `inset 0 0 0 1px ${chipBorder}`,
                      color: ink,
                      fontWeight: 510,
                      fontVariationSettings: "'wght' 510",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.lead}
                  </div>
                ) : (
                  <FaCheck size={14} style={{ color: ink, marginTop: 6 }} />
                )}
                <p
                  className="pt-1.5 text-[15px]"
                  style={{
                    color: mutedInk,
                    lineHeight: "22px",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
            {i < tier.sections.length - 1 && (
              <div className="h-px w-full" style={{ background: divider }} />
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

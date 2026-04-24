"use client";

/**
 * Mock Stripe Checkout.
 *
 * Visually mirrors stripe.com's hosted checkout: grey left summary pane with
 * merchant name + line items, white right pane with a single card-details
 * form. No real Stripe API — submit just waits briefly to fake the network
 * round-trip, flashes a success state, then bounces back to /dashboard/boost.
 *
 * Takes over the full viewport (no dashboard shell) because real Stripe
 * Checkout is a handoff, not an in-app panel.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FaArrowLeft,
  FaLock,
  FaCircleCheck,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from "react-icons/fa6";

type Tier = "promoted" | "featured";
type Cadence = "monthly" | "annually";

const TIERS: Record<Tier, { name: string; monthly: number; annually: number }> =
  {
    promoted: { name: "Promoted", monthly: 99, annually: 79 },
    featured: { name: "Featured", monthly: 499, annually: 399 },
  };

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const tier: Tier = params.get("tier") === "featured" ? "featured" : "promoted";
  const cadence: Cadence =
    params.get("cadence") === "annually" ? "annually" : "monthly";

  const info = TIERS[tier];
  const unitPrice = cadence === "monthly" ? info.monthly : info.annually;
  const months = cadence === "annually" ? 12 : 1;
  const subtotal = unitPrice * months;
  const total = subtotal;

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Auto-bounce back to boost after success flashes.
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => router.push("/dashboard/boost"), 1800);
    return () => clearTimeout(id);
  }, [done, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1400);
  }

  if (done) return <SuccessState tierName={info.name} />;

  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: "#ffffff", color: "#1a1a1a" }}
    >
      {/* LEFT · order summary (stripe's grey column) */}
      <aside
        className="flex flex-col justify-between px-8 py-10 md:w-1/2 md:px-[10%] md:py-16"
        style={{ background: "#f6f9fc" }}
      >
        <div>
          <Link
            href="/dashboard/boost"
            className="inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:opacity-70"
            style={{ color: "#425466" }}
          >
            <FaArrowLeft size={12} />
            Cotogna
          </Link>

          <div className="mt-12">
            <div
              className="text-[14px]"
              style={{ color: "#6b7c93", fontWeight: 500 }}
            >
              Subscribe to Alfredo {info.name}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="font-display"
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "#1a1a1a",
                }}
              >
                ${unitPrice.toLocaleString()}.00
              </span>
              <span
                className="text-[14px]"
                style={{ color: "#6b7c93" }}
              >
                per month{cadence === "annually" ? ", billed annually" : ""}
              </span>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 text-[14px]">
            <LineItem
              title={`Alfredo ${info.name}`}
              caption={
                cadence === "annually"
                  ? `$${unitPrice} × 12 months`
                  : "Billed monthly"
              }
              amount={`$${subtotal.toLocaleString()}.00`}
            />
            <Divider />
            <Row label="Subtotal" value={`$${subtotal.toLocaleString()}.00`} />
            <Row label="Tax" value="$0.00" muted />
            <Divider />
            <Row
              label="Total due today"
              value={`$${total.toLocaleString()}.00`}
              emphasized
            />
          </div>
        </div>

        <footer className="mt-16 flex items-center gap-4 text-[12px]">
          <span
            className="inline-flex items-center gap-1.5"
            style={{ color: "#6b7c93", fontWeight: 500 }}
          >
            Powered by{" "}
            <span style={{ color: "#635bff", fontWeight: 700 }}>stripe</span>
          </span>
          <span style={{ color: "#8898aa" }}>·</span>
          <a
            href="#"
            className="transition-colors hover:underline"
            style={{ color: "#6b7c93" }}
          >
            Terms
          </a>
          <a
            href="#"
            className="transition-colors hover:underline"
            style={{ color: "#6b7c93" }}
          >
            Privacy
          </a>
        </footer>
      </aside>

      {/* RIGHT · card details form */}
      <main className="flex flex-1 items-start justify-center px-8 py-10 md:py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
          <h1
            className="font-display"
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
            }}
          >
            Pay with card
          </h1>

          <div className="mt-6 flex flex-col gap-4">
            <Field label="Email">
              <StripeInput
                type="email"
                required
                autoFocus
                placeholder="owner@cotogna.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Card information">
              {/* Grouped input — one rounded rect containing the card
               *  number row (top) and expiry / CVC row (bottom), divided
               *  by hairlines. Matches Stripe Elements' default look. */}
              <div
                className="overflow-hidden rounded-[6px]"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(50,50,93,0.1), 0 1px 1px rgba(0,0,0,0.06)",
                }}
              >
                <div className="relative">
                  <StripeInput
                    placeholder="1234 1234 1234 1234"
                    required
                    inputMode="numeric"
                    maxLength={19}
                    autoComplete="cc-number"
                    naked
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <FaCcVisa size={22} color="#1a1f71" />
                    <FaCcMastercard size={22} color="#eb001b" />
                    <FaCcAmex size={22} color="#2e77bc" />
                  </div>
                </div>
                <div
                  className="grid grid-cols-2"
                  style={{ borderTop: "1px solid rgba(50,50,93,0.1)" }}
                >
                  <StripeInput
                    placeholder="MM / YY"
                    required
                    inputMode="numeric"
                    maxLength={7}
                    autoComplete="cc-exp"
                    naked
                  />
                  <StripeInput
                    placeholder="CVC"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="cc-csc"
                    naked
                    style={{ borderLeft: "1px solid rgba(50,50,93,0.1)" }}
                  />
                </div>
              </div>
            </Field>

            <Field label="Cardholder name">
              <StripeInput
                placeholder="Full name on card"
                required
                autoComplete="cc-name"
              />
            </Field>

            <Field label="Country or region">
              <select
                required
                defaultValue="US"
                className="block h-10 w-full appearance-none rounded-[6px] bg-white px-3 text-[15px] outline-none transition-shadow"
                style={{
                  color: "#1a1a1a",
                  boxShadow:
                    "0 0 0 1px rgba(50,50,93,0.1), 0 1px 1px rgba(0,0,0,0.06)",
                }}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="JP">Japan</option>
              </select>
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] text-[15px] transition-opacity disabled:cursor-wait disabled:opacity-70"
            style={{
              background: "#635bff",
              color: "#ffffff",
              fontWeight: 600,
              letterSpacing: "-0.005em",
              boxShadow: "0 1px 3px rgba(50,50,93,0.15)",
            }}
          >
            {submitting ? (
              <Spinner />
            ) : (
              <>
                <FaLock size={11} />
                Pay ${total.toLocaleString()}.00
              </>
            )}
          </button>

          <p
            className="mt-4 text-[12px]"
            style={{ color: "#6b7c93", lineHeight: "18px" }}
          >
            By confirming your subscription, you allow Alfredo to charge your
            card for this payment and future payments in accordance with their
            terms. You can cancel anytime from your dashboard.
          </p>
        </form>
      </main>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[13px]"
        style={{
          color: "#30313d",
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

type StripeInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  naked?: boolean;
};

/** Stripe Elements-lookalike input. `naked` variant drops the outer
 *  shadow/radius so the input sits inside a grouped-rectangle wrapper. */
function StripeInput({ naked, style, ...props }: StripeInputProps) {
  return (
    <input
      {...props}
      className="block h-10 w-full bg-white px-3 text-[15px] outline-none placeholder:text-[#aab7c4] focus:relative focus:z-10"
      style={{
        color: "#1a1a1a",
        borderRadius: naked ? 0 : 6,
        boxShadow: naked
          ? undefined
          : "0 0 0 1px rgba(50,50,93,0.1), 0 1px 1px rgba(0,0,0,0.06)",
        ...style,
      }}
    />
  );
}

function Row({
  label,
  value,
  muted,
  emphasized,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        style={{
          color: muted ? "#8898aa" : emphasized ? "#1a1a1a" : "#425466",
          fontWeight: emphasized ? 600 : 500,
        }}
      >
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{
          color: muted ? "#8898aa" : "#1a1a1a",
          fontWeight: emphasized ? 600 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function LineItem({
  title,
  caption,
  amount,
}: {
  title: string;
  caption: string;
  amount: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <span
          className="text-[14px]"
          style={{ color: "#1a1a1a", fontWeight: 500 }}
        >
          {title}
        </span>
        <span className="text-[13px]" style={{ color: "#8898aa" }}>
          {caption}
        </span>
      </div>
      <span
        className="tabular-nums text-[14px]"
        style={{ color: "#1a1a1a", fontWeight: 500 }}
      >
        {amount}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full" style={{ background: "#e3e8ee" }} />;
}

function Spinner() {
  return (
    <span
      className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-label="Processing"
    />
  );
}

function SuccessState({ tierName }: { tierName: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#f6f9fc", color: "#1a1a1a" }}
    >
      <div
        className="flex size-16 items-center justify-center rounded-full"
        style={{ background: "rgba(46, 204, 113, 0.12)" }}
      >
        <FaCircleCheck size={32} color="#2ecc71" />
      </div>
      <h1
        className="font-display mt-8"
        style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        You&apos;re on {tierName}.
      </h1>
      <p
        className="mt-3 max-w-[440px] text-[15px]"
        style={{ color: "#425466", lineHeight: "22px" }}
      >
        Your receipt is on its way. Bookings that match your menu will start
        ranking higher immediately. Returning to your dashboard…
      </p>
      <div className="mt-6 text-[12px]" style={{ color: "#8898aa" }}>
        Powered by{" "}
        <span style={{ color: "#635bff", fontWeight: 700 }}>stripe</span>
      </div>
    </div>
  );
}

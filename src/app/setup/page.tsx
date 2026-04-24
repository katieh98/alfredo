"use client";

import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Footer, TopBar } from "@/components/site-chrome";
import { StaggerText } from "@/components/stagger-text";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Nut allergy",
  "Shellfish allergy",
  "Halal",
  "Kosher",
];

const CUISINE_OPTIONS = [
  "Italian",
  "Japanese",
  "Mexican",
  "Thai",
  "Chinese",
  "Indian",
  "French",
  "Mediterranean",
  "American",
  "Korean",
  "Vietnamese",
  "Spanish",
];

const PRICE_OPTIONS = [
  { value: "budget", label: "Budget", hint: "$" },
  { value: "mid", label: "Mid", hint: "$$" },
  { value: "upscale", label: "Upscale", hint: "$$$" },
] as const;

type PriceValue = (typeof PRICE_OPTIONS)[number]["value"];

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function SetupForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [price, setPrice] = useState<PriceValue>("mid");

  if (!token) {
    return (
      <Stage
        meta="Setup · Link missing"
        title="No setup token."
        body="The link you followed is incomplete. Grab the full setup link from your Alfredo DM in Discord."
      />
    );
  }

  if (submitted) {
    return (
      <Stage
        meta="Setup · Complete"
        title="You're set."
        body="Your profile is saved under your Discord ID. Close this tab and head back to Discord — next time you're tagged, Alfredo skips this step."
        accent="success"
      />
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          booking_name: form.get("booking_name"),
          booking_phone: form.get("booking_phone"),
          booking_email: form.get("booking_email"),
          dietary: dietary.join(", "),
          cuisine: cuisine.join(", "),
          price_range: price,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        return;
      }

      const data: { error?: string } = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[880px] px-8 pb-24 pt-48">
        <p className="label-xs mb-8">Setup · One-time</p>
        <h1
          className="font-display text-[clamp(52px,7vw,96px)] font-normal leading-[0.95]"
          style={{ letterSpacing: "-0.035em" }}
        >
          Tell Alfredo{" "}
          <span className="italic font-normal">what you eat.</span>
        </h1>
        <p className="body-lg mt-8 max-w-[580px] text-ink-soft">
          This runs once. Alfredo stores it under your Discord ID and reuses
          it every time you&apos;re tagged in a group booking. Everything can
          be changed later from your profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-16 space-y-5">
          <FormGroup>
            <Section heading="Booking contact">
              <p className="body-md mb-6 text-ink-soft">
                Used on the OpenTable reservation under your name. Not shared
                with the group.
              </p>
              <div className="space-y-5">
                <Field
                  name="booking_name"
                  label="Full name"
                  placeholder="Daisy Chen"
                  required
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    name="booking_phone"
                    label="Phone"
                    placeholder="(415) 555-0123"
                    type="tel"
                    required
                  />
                  <Field
                    name="booking_email"
                    label="Email"
                    placeholder="daisy@example.com"
                    type="email"
                    required
                  />
                </div>
              </div>
            </Section>
          </FormGroup>

          <FormGroup>
            <Section heading="Food preferences">
              <p className="body-md mb-6 text-ink-soft">
                Alfredo uses these to narrow the group&apos;s restaurant list.
                Leave blank if nothing applies.
              </p>
              <div className="space-y-5">
                <ChipGroup
                  label="Dietary restrictions"
                  options={DIETARY_OPTIONS}
                  selected={dietary}
                  onToggle={(v) => setDietary((prev) => toggle(prev, v))}
                />
                <ChipGroup
                  label="Cuisine preferences"
                  options={CUISINE_OPTIONS}
                  selected={cuisine}
                  onToggle={(v) => setCuisine((prev) => toggle(prev, v))}
                />
                <div>
                  <Label>Price range</Label>
                  <Segmented
                    value={price}
                    onChange={setPrice}
                    options={PRICE_OPTIONS}
                  />
                </div>
              </div>
            </Section>
          </FormGroup>

          {error && (
            <div
              className="rounded-[8px] px-5 py-4 text-[15px] text-ink"
              style={{
                background: "rgba(248, 65, 49, 0.08)",
                border: "1px solid rgba(248, 65, 49, 0.25)",
              }}
            >
              <span
                className="label-sm mr-2"
                style={{ color: "var(--color-coral)" }}
              >
                Error
              </span>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-ink-soft">
              Saved to your Discord ID · Never shared with the group
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="stagger-btn inline-flex h-14 items-center justify-center rounded-[8px] bg-bg-dark px-8 text-[16px] font-medium text-bg transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                "Saving…"
              ) : (
                <StaggerText text="Save and return to Discord" />
              )}
            </button>
          </div>
        </form>
      </div>
  );
}

/** The #F4F4F4 osmo container — one per related field group. */
function FormGroup({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[24px] bg-bg p-10 ring-1 ring-border-soft">
      {children}
    </div>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display mb-4 text-[28px] font-normal leading-none">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <label className="label-sm mb-3 block">{children}</label>;
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-14 w-full rounded-[8px] border border-border bg-bg-card px-5 text-[16px] text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-bg"
      />
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isOn = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={isOn}
              className={
                isOn
                  ? "inline-flex h-10 items-center rounded-[8px] bg-bg-dark px-4 text-[14px] font-medium text-bg transition-colors"
                  : "inline-flex h-10 items-center rounded-[8px] border border-border bg-bg-card px-4 text-[14px] font-medium text-ink transition-colors hover:bg-bg-alt"
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string; hint: string }[];
}) {
  return (
    <div className="inline-flex rounded-[8px] border border-border bg-bg-card p-1">
      {options.map((opt) => {
        const isOn = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isOn}
            className={
              isOn
                ? "inline-flex items-center gap-2 rounded-[5px] bg-bg-dark px-5 py-2.5 text-[14px] font-medium text-bg"
                : "inline-flex items-center gap-2 rounded-[5px] px-5 py-2.5 text-[14px] font-medium text-ink-soft hover:text-ink"
            }
          >
            <span>{opt.label}</span>
            <span className={isOn ? "text-[13px] opacity-70" : "text-[13px]"}>
              {opt.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Stage({
  meta,
  title,
  body,
  accent,
}: {
  meta: string;
  title: string;
  body: string;
  accent?: "success";
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col justify-center px-8 py-20">
      <p className="label-xs mb-6 flex items-center gap-2">
        {accent === "success" && (
          <span
            className="inline-block size-[6px] rounded-full"
            style={{ background: "var(--color-electric)" }}
            aria-hidden
          />
        )}
        {meta}
      </p>
      <h1
        className="font-display text-[clamp(44px,5.5vw,80px)] font-normal leading-[1.0]"
        style={{ letterSpacing: "-0.035em" }}
      >
        {title}
      </h1>
      <p className="body-lg mt-6 text-ink-soft">{body}</p>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-alt">
      <TopBar />
      <main className="flex-1">
        <Suspense fallback={<Stage meta="Setup" title="Loading…" body="" />}>
          <SetupForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSession, signIn } from "next-auth/react";
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

interface ProfileData {
  booking_name: string;
  booking_phone: string;
  booking_email: string;
  dietary: string;
  cuisine: string;
  price_range: PriceValue;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ProfileForm() {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [price, setPrice] = useState<PriceValue>("mid");

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: { profile: ProfileData | null }) => {
        if (data.profile) {
          setBookingName(data.profile.booking_name ?? "");
          setBookingPhone(data.profile.booking_phone ?? "");
          setBookingEmail(data.profile.booking_email ?? "");
          setDietary(
            data.profile.dietary
              ? data.profile.dietary.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
          );
          setCuisine(
            data.profile.cuisine
              ? data.profile.cuisine.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
          );
          setPrice((data.profile.price_range as PriceValue) ?? "mid");
        }
      })
      .catch(() => setError("Couldn't load your profile. Try refreshing."))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return <Stage meta="Profile" title="Loading…" body="" />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col justify-center px-8 py-20">
        <p className="label-xs mb-6">Profile</p>
        <h1
          className="font-display text-[clamp(44px,5.5vw,80px)] font-normal leading-[1.0]"
          style={{ letterSpacing: "-0.035em" }}
        >
          Sign in to manage your preferences.
        </h1>
        <p className="body-lg mt-6 text-ink-soft">
          Log in with Discord to update your dietary restrictions, cuisine preferences, and booking
          details.
        </p>
        <button
          onClick={() => signIn("discord")}
          className="stagger-btn mt-10 inline-flex h-14 w-fit items-center justify-center rounded-[8px] bg-bg-dark px-8 text-[16px] font-medium text-bg transition-opacity hover:opacity-95"
        >
          <StaggerText text="Sign in with Discord" />
        </button>
      </div>
    );
  }

  if (saved) {
    return (
      <Stage
        meta="Profile · Saved"
        title="Preferences updated."
        body="Alfredo will use these the next time you're part of a group booking."
        accent="success"
      />
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_name: bookingName,
          booking_phone: bookingPhone,
          booking_email: bookingEmail,
          dietary: dietary.join(", "),
          cuisine: cuisine.join(", "),
          price_range: price,
        }),
      });

      if (res.ok) {
        setSaved(true);
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
      <p className="label-xs mb-8">Profile · {session?.user?.name}</p>
      <h1
        className="font-display text-[clamp(52px,7vw,96px)] font-normal leading-[0.95]"
        style={{ letterSpacing: "-0.035em" }}
      >
        Your preferences.
      </h1>
      <p className="body-lg mt-8 max-w-[580px] text-ink-soft">
        Alfredo uses these every time you&apos;re tagged in a group booking. Changes take effect
        immediately.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-16 rounded-[24px] bg-bg p-10 ring-1 ring-border-soft"
      >
        <div className="space-y-12">
          <Section heading="Booking contact">
            <p className="body-md mb-6 text-ink-soft">
              Used on the OpenTable reservation under your name. Not shared with the group.
            </p>
            <div className="space-y-5">
              <div>
                <Label>Full name</Label>
                <input
                  name="booking_name"
                  type="text"
                  placeholder="Daisy Chen"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="h-14 w-full rounded-[8px] border border-border bg-bg-card px-5 text-[16px] text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-bg"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Phone</Label>
                  <input
                    name="booking_phone"
                    type="tel"
                    placeholder="(415) 555-0123"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    className="h-14 w-full rounded-[8px] border border-border bg-bg-card px-5 text-[16px] text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-bg"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <input
                    name="booking_email"
                    type="email"
                    placeholder="daisy@example.com"
                    required
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="h-14 w-full rounded-[8px] border border-border bg-bg-card px-5 text-[16px] text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-bg"
                  />
                </div>
              </div>
            </div>
          </Section>

          <SectionDivider />

          <Section heading="Food preferences">
            <p className="body-md mb-6 text-ink-soft">
              Alfredo uses these to narrow the group&apos;s restaurant list. Leave blank if nothing
              applies.
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
                <Segmented value={price} onChange={setPrice} options={PRICE_OPTIONS} />
              </div>
            </div>
          </Section>

          {error && (
            <div
              className="rounded-[8px] px-5 py-4 text-[15px] text-ink"
              style={{
                background: "rgba(248, 65, 49, 0.08)",
                border: "1px solid rgba(248, 65, 49, 0.25)",
              }}
            >
              <span className="label-sm mr-2" style={{ color: "var(--color-coral)" }}>
                Error
              </span>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-border-soft pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-ink-soft">
              Saved to your Discord ID · Never shared with the group
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="stagger-btn inline-flex h-14 items-center justify-center rounded-[8px] bg-bg-dark px-8 text-[16px] font-medium text-bg transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : <StaggerText text="Save preferences" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display mb-4 text-[28px] font-normal leading-none">{heading}</h2>
      {children}
    </section>
  );
}

function SectionDivider() {
  return <div className="border-t border-border-soft" />;
}

function Label({ children }: { children: ReactNode }) {
  return <label className="label-sm mb-3 block">{children}</label>;
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
            <span className={isOn ? "text-[13px] opacity-70" : "text-[13px]"}>{opt.hint}</span>
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

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-alt">
      <TopBar />
      <main className="flex-1">
        <ProfileForm />
      </main>
      <Footer />
    </div>
  );
}

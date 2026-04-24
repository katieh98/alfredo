"use client";

import { useState } from "react";
import {
  FaArrowRight,
  FaCircle,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaPencil,
} from "react-icons/fa6";
import { signOut } from "next-auth/react";
import { SettingsSection } from "@/components/dashboard/settings/SettingsSection";
import { SettingsRow } from "@/components/dashboard/settings/SettingsRow";

/**
 * Settings — restaurant operator's account + restaurant profile +
 * notifications + danger zone. Visual language ported from
 * doppel_desktop's Codex-style SettingsView: max-width 720 column,
 * section header + bordered card with divided rows. Controls here
 * are non-functional stubs for the demo (toggles keep local state
 * only, "Edit" buttons are cosmetic). Real persistence plugs in at
 * the action handlers.
 */
export function SettingsPanel() {
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [cancelAlerts, setCancelAlerts] = useState(true);
  const [promotedDigest, setPromotedDigest] = useState(false);
  const [smsCritical, setSmsCritical] = useState(true);
  const [allergenBroadcast, setAllergenBroadcast] = useState(true);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main className="dop-no-scrollbar flex min-h-0 flex-1 overflow-y-auto px-6 pb-16 pt-10">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="eyebrow">Account</div>
            <h1 className="dop-settings-h1">Settings</h1>
            <p className="text-[14px] text-[var(--color-fg-secondary)]">
              Manage your restaurant profile, notifications, and booking
              preferences.
            </p>
          </header>

          {/* Restaurant identity */}
          <SettingsSection
            heading="Restaurant"
            subtitle="How Alfredo introduces you to diners."
          >
            <SettingsRow
              title="Name"
              subtitle="Cotogna"
              control={<EditButton />}
            />
            <SettingsRow
              title="Cuisine"
              subtitle="Italian · Rustic"
              control={<EditButton />}
            />
            <SettingsRow
              title="Neighborhood"
              icon={<FaLocationDot size={13} />}
              subtitle="Jackson Square, San Francisco"
              control={<EditButton />}
            />
            <SettingsRow
              title="Price range"
              subtitle="$$"
              control={
                <div className="flex items-center gap-1 rounded-[6px] bg-[var(--color-surface-hover)] p-0.5">
                  {(["$", "$$", "$$$", "$$$$"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="h-7 min-w-[28px] rounded-[4px] px-2 text-[12px] transition-colors"
                      style={{
                        background:
                          p === "$$" ? "var(--color-surface)" : "transparent",
                        color:
                          p === "$$"
                            ? "var(--color-fg-strong)"
                            : "var(--color-fg-tertiary)",
                        fontWeight: 510,
                        fontVariationSettings: "'wght' 510",
                        boxShadow:
                          p === "$$"
                            ? "0 1px 2px rgba(0,0,0,0.05)"
                            : undefined,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              }
            />
          </SettingsSection>

          {/* Contact */}
          <SettingsSection
            heading="Contact"
            subtitle="Where Alfredo routes booking confirmations and allergen alerts."
          >
            <SettingsRow
              title="Booking email"
              icon={<FaEnvelope size={13} />}
              subtitle="bookings@cotogna.com"
              control={<EditButton />}
            />
            <SettingsRow
              title="Direct line"
              icon={<FaPhone size={13} />}
              subtitle="+1 (415) 775-8508"
              control={<EditButton />}
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            heading="Notifications"
            subtitle="When Alfredo pings you. SMS is reserved for critical alerts only."
          >
            <SettingsRow
              title="New booking"
              subtitle="Email as soon as a diner confirms via Alfredo."
              control={
                <Toggle
                  on={bookingAlerts}
                  onChange={() => setBookingAlerts((v) => !v)}
                />
              }
            />
            <SettingsRow
              title="Cancellation"
              subtitle="Email on any cancellation, no matter the lead time."
              control={
                <Toggle
                  on={cancelAlerts}
                  onChange={() => setCancelAlerts((v) => !v)}
                />
              }
            />
            <SettingsRow
              title="Promoted-tier digest"
              subtitle="Weekly summary of reach, bookings, and fees waived."
              control={
                <Toggle
                  on={promotedDigest}
                  onChange={() => setPromotedDigest((v) => !v)}
                />
              }
            />
            <SettingsRow
              title="Critical SMS"
              subtitle="Text the direct line for allergen flags within 2h of seating."
              control={
                <Toggle
                  on={smsCritical}
                  onChange={() => setSmsCritical((v) => !v)}
                />
              }
            />
            <SettingsRow
              title="Broadcast allergen flags to kitchen"
              subtitle="Post to the kitchen printer queue automatically."
              control={
                <Toggle
                  on={allergenBroadcast}
                  onChange={() => setAllergenBroadcast((v) => !v)}
                />
              }
            />
          </SettingsSection>

          {/* Booking preferences */}
          <SettingsSection
            heading="Booking preferences"
            subtitle="Guardrails Alfredo respects when it picks your restaurant for a group."
          >
            <SettingsRow
              title="Max party size"
              subtitle="Parties larger than this go to a call instead of auto-book."
              control={<StatText>10</StatText>}
            />
            <SettingsRow
              title="Lead time"
              subtitle="Minimum notice Alfredo gives before a seating."
              control={<StatText>90 min</StatText>}
            />
            <SettingsRow
              title="Cancellation window"
              subtitle="Refund-free cancellations allowed up to…"
              control={<StatText>24 h before</StatText>}
            />
          </SettingsSection>

          {/* Integrations */}
          <SettingsSection
            heading="Integrations"
            subtitle="External systems Alfredo syncs with."
          >
            <SettingsRow
              title="OpenTable"
              subtitle="Menu + availability sync · cotogna-san-francisco"
              control={<StatusTag label="Connected" ok />}
            />
            <SettingsRow
              title="POS"
              subtitle="Ticket fire + seating time"
              control={<StatusTag label="Not connected" ok={false} />}
            />
            <SettingsRow
              title="Slack"
              subtitle="Post booking alerts into #front-of-house"
              control={<StatusTag label="Not connected" ok={false} />}
            />
          </SettingsSection>

          {/* Account / danger */}
          <SettingsSection
            heading="Account"
            subtitle="You're signed in as Victoria Wang · FoH manager."
          >
            <SettingsRow
              title="Sign out"
              subtitle="Ends this session on this device."
              control={
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="dop-btn"
                >
                  Sign out
                  <FaArrowRight size={11} />
                </button>
              }
            />
            <SettingsRow
              title="Delete restaurant"
              subtitle="Permanently remove this restaurant from Alfredo. This can't be undone."
              control={
                <button
                  type="button"
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border px-3.5 text-[13px] transition-colors hover:bg-[var(--color-status-red-light)]"
                  style={{
                    color: "var(--color-status-red)",
                    borderColor: "rgba(240, 78, 85, 0.25)",
                    fontWeight: 510,
                    fontVariationSettings: "'wght' 510",
                  }}
                >
                  Delete
                </button>
              }
            />
          </SettingsSection>
        </div>
      </main>
    </div>
  );
}

function EditButton() {
  return (
    <button
      type="button"
      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] px-3 text-[13px] text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-fg-strong)]"
      style={{
        fontWeight: 510,
        fontVariationSettings: "'wght' 510",
      }}
    >
      <FaPencil size={10} />
      Edit
    </button>
  );
}

function StatText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[13px] tabular-nums text-[var(--color-fg-strong)]"
      style={{
        fontWeight: 510,
        fontVariationSettings: "'wght' 510",
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </span>
  );
}

function StatusTag({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className="inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[11.5px]"
      style={{
        background: ok ? "#DBEDDB" : "var(--color-surface-hover)",
        color: "var(--color-fg-strong)",
        fontWeight: 510,
        fontVariationSettings: "'wght' 510",
        letterSpacing: "-0.005em",
      }}
    >
      <FaCircle
        size={6}
        style={{
          color: ok ? "var(--color-status-green)" : "var(--color-fg-tertiary)",
        }}
      />
      {label}
    </span>
  );
}

/** Osmo-style soft toggle. Local-state only; wire to real persistence
 *  when the settings API lands. */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="relative h-[22px] w-[38px] cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-border)]"
      style={{
        background: on
          ? "var(--color-accent)"
          : "var(--color-border-strong)",
      }}
    >
      <span
        className="absolute left-[2px] top-[2px] size-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform"
        style={{
          transform: on ? "translateX(16px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

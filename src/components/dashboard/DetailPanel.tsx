import type { ReactNode } from "react";
import { FaCircle, FaCircleCheck, FaXmark } from "react-icons/fa6";
import type { PartyMember, Restaurant, Session } from "@/app/dashboard/_data";

interface DetailPanelProps {
  restaurant: Restaurant;
  session: Session;
  onClose?: () => void;
}

type Severity = "critical" | "warning" | "info" | "none";

// Maps free-form dietary strings to kitchen-risk severity.
// critical = anaphylaxis-risk (nuts, shellfish). warning = medical
// (celiac, dairy intolerance). info = preference (vegetarian, vegan,
// halal, kosher). none = no flag.
function flagSeverity(dietary: string[] | undefined): Severity {
  if (!dietary || dietary.length === 0) return "none";
  const joined = dietary.join(" ").toLowerCase();
  if (/peanut|tree[- ]?nut|\bnut\b|shellfish|fish allergy|sesame/.test(joined))
    return "critical";
  if (/gluten|celiac|dairy|lactose|egg allergy|soy allergy/.test(joined))
    return "warning";
  return "info";
}

function severityColor(s: Severity): string | null {
  if (s === "critical") return "var(--color-status-red)";
  if (s === "warning") return "var(--color-status-amber)";
  if (s === "info") return "var(--color-status-green)";
  return null;
}

function stateLabel(state: Restaurant["confirmationState"]): {
  text: string;
  color: string;
} {
  switch (state) {
    case "confirmed":
      return { text: "Confirmed", color: "var(--color-status-green)" };
    case "seated":
      return { text: "Seated", color: "var(--color-accent)" };
    case "pending":
      return { text: "Pending", color: "var(--color-status-amber)" };
    case "cancelled":
      return { text: "Cancelled", color: "var(--color-status-red)" };
    default:
      return { text: "Unknown", color: "var(--color-fg-faint)" };
  }
}

export function DetailPanel({
  restaurant: r,
  session: s,
  onClose,
}: DetailPanelProps) {
  const state = stateLabel(r.confirmationState);

  return (
    <aside className="relative flex h-full w-[416px] shrink-0 flex-col rounded-[14px] bg-[var(--color-surface-raised)] p-3">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-5 right-5 z-10 flex size-8 items-center justify-center rounded-full text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <FaXmark size={13} />
        </button>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-5 pt-8 pb-6">
        {/* Heading — booking ID is the anchor; time/party live as a subtitle. */}
        <div>
          <div
            className="mb-2 text-[12px] uppercase tracking-[0.06em] text-[var(--color-fg-faint)]"
            style={{ fontWeight: 600 }}
          >
            Booking ID
          </div>
          <h2
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "var(--color-fg-strong)",
            }}
          >
            {r.bookingId}
          </h2>
          <div className="mt-3 flex items-center gap-3 text-[14px] text-[var(--color-fg-muted)]">
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: state.color, fontWeight: 510 }}
            >
              <FaCircle size={6} style={{ color: state.color }} />
              {state.text}
            </span>
            <span className="text-[var(--color-fg-faint)]">·</span>
            <span>
              {r.whenLabel} · Party of {r.partySize}
            </span>
          </div>
        </div>

        <Divider />

        {/* Guests & dietary flags — the reason the kitchen opens this panel. */}
        <Section label="Guests & dietary flags">
          <div className="flex flex-col">
            {s.members.map((m) => (
              <GuestRow key={m.id} member={m} />
            ))}
          </div>
        </Section>

        {/* Context from the booker chat — gives FoH the "why" of the booking. */}
        {s.chatContext && (
          <Section label="Booker notes">
            <p
              className="text-[14px] text-[var(--color-fg-secondary)]"
              style={{ lineHeight: "22px", letterSpacing: "-0.005em" }}
            >
              {s.chatContext}
            </p>
          </Section>
        )}

        <Section label="Booker contact">
          <dl className="flex flex-col gap-1.5">
            <KVRow label="Host">{r.hostName}</KVRow>
            <KVRow label="Source">{r.source}</KVRow>
            <KVRow label="Booked">{s.createdAt}</KVRow>
          </dl>
        </Section>

        <Section label="Seating & timing">
          <dl className="flex flex-col gap-1.5">
            <KVRow label="Requested">{s.dateTime}</KVRow>
            <KVRow label="Party size">{r.partySize} covers</KVRow>
            <KVRow label="Location">{s.location}</KVRow>
            <KVRow label="Picked by Alfredo">{s.pickedAt}</KVRow>
          </dl>
        </Section>

        {r.confirmation && (
          <Section label="Confirmation">
            <dl className="flex flex-col gap-1.5">
              <KVRow label="Short code">
                <span className="tabular-nums">{r.confirmation}</span>
              </KVRow>
              <KVRow label="State">
                <span style={{ color: state.color, fontWeight: 510 }}>
                  {state.text}
                </span>
              </KVRow>
            </dl>
          </Section>
        )}
      </div>
    </aside>
  );
}

function GuestRow({ member: m }: { member: PartyMember }) {
  const severity = flagSeverity(m.dietary);
  const dotColor = severityColor(severity);
  return (
    <div className="flex h-11 items-center justify-between">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ background: m.accentColor }}
          aria-hidden
        >
          {m.name[0]}
        </div>
        <span
          className="truncate text-[14px] text-[var(--color-fg-strong)]"
          style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
        >
          {m.name}
        </span>
        {m.host && (
          <span
            className="shrink-0 rounded-[4px] bg-black/5 px-1.5 py-0.5 text-[11px] font-medium leading-none text-[var(--color-fg-muted)]"
          >
            host
          </span>
        )}
      </div>
      {dotColor ? (
        <span
          className="inline-flex items-center gap-1.5 text-[12px]"
          style={{ color: "var(--color-fg-muted)", fontWeight: 510 }}
        >
          <FaCircle size={7} style={{ color: dotColor }} />
          {(m.dietary ?? []).join(", ")}
        </span>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 text-[12px]"
          style={{ color: "var(--color-fg-faint)" }}
        >
          <FaCircleCheck size={11} />
          no flags
        </span>
      )}
    </div>
  );
}

function KVRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className="text-[13px] text-[var(--color-fg-faint)]"
        style={{
          fontWeight: 500,
          fontVariationSettings: "'wght' 500",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </dt>
      <dd
        className="text-[13px] text-[var(--color-fg-muted)]"
        style={{
          fontWeight: 500,
          fontVariationSettings: "'wght' 500",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </dd>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <div
        className="mb-3 text-[13px] text-[var(--color-fg-muted)]"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="m-0 border-0 border-t border-[var(--color-border-subtle)]" />;
}

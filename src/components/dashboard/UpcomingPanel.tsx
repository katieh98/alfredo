import { FaCircle } from "react-icons/fa6";

interface UpcomingBooking {
  bookingId: string;
  hostName: string;
  partySize: number;
  time: string;
  source: "Alfredo" | "OpenTable" | "Direct" | "Resy" | "Phone";
  accentColor: string;
  notes?: string;
}

interface UpcomingDay {
  date: string;
  dateLabel: string;
  weekday: string;
  bookings: UpcomingBooking[];
}

// 7-day lookahead — hardcoded for the demo. Real version reads from
// Ghost DB session rows with status IN ('booked', 'processing') and
// group_by tagged_users[].booking_name / reservation time.
const UPCOMING: UpcomingDay[] = [
  {
    date: "2026-04-27",
    dateLabel: "Apr 27",
    weekday: "Sunday",
    bookings: [
      {
        bookingId: "H9L4K2WR",
        hostName: "Emma Thompson",
        partySize: 4,
        time: "6:30 PM",
        source: "Alfredo",
        accentColor: "#6840FF",
      },
      {
        bookingId: "J7X3N6MP",
        hostName: "David Park",
        partySize: 6,
        time: "7:15 PM",
        source: "OpenTable",
        accentColor: "#F59E0B",
      },
      {
        bookingId: "K5T8V2QL",
        hostName: "Sophia Reyes",
        partySize: 2,
        time: "8:00 PM",
        source: "Direct",
        accentColor: "#2ECC71",
        notes: "Anniversary — requesting window seat",
      },
    ],
  },
  {
    date: "2026-04-28",
    dateLabel: "Apr 28",
    weekday: "Monday",
    bookings: [
      {
        bookingId: "L2P6R9BN",
        hostName: "Chen Wei",
        partySize: 5,
        time: "7:00 PM",
        source: "Alfredo",
        accentColor: "#1132F5",
      },
      {
        bookingId: "M8Q4H5CV",
        hostName: "Isabella García",
        partySize: 3,
        time: "7:45 PM",
        source: "Resy",
        accentColor: "#F04E55",
      },
    ],
  },
  {
    date: "2026-04-30",
    dateLabel: "Apr 30",
    weekday: "Wednesday",
    bookings: [
      {
        bookingId: "N1D3Y7ZK",
        hostName: "Marcus Okafor",
        partySize: 10,
        time: "6:45 PM",
        source: "Direct",
        accentColor: "#C45538",
        notes: "Corporate dinner · expect earlier arrivals",
      },
      {
        bookingId: "P4F6G8XR",
        hostName: "Lena Müller",
        partySize: 4,
        time: "8:30 PM",
        source: "Alfredo",
        accentColor: "#D8A14A",
      },
    ],
  },
  {
    date: "2026-05-02",
    dateLabel: "May 2",
    weekday: "Friday",
    bookings: [
      {
        bookingId: "Q8J2L5HW",
        hostName: "Ben Sato",
        partySize: 8,
        time: "7:30 PM",
        source: "OpenTable",
        accentColor: "#8AB14B",
      },
      {
        bookingId: "R3K7M1DV",
        hostName: "Amara Okonkwo",
        partySize: 2,
        time: "9:00 PM",
        source: "Alfredo",
        accentColor: "#6B8B71",
      },
    ],
  },
];

const SOURCE_COLORS: Record<UpcomingBooking["source"], string> = {
  Alfredo: "#D8E2FE",
  OpenTable: "#FBE4E4",
  Resy: "#FADEC9",
  Direct: "#E3E2E0",
  Phone: "#E9E5E3",
};

/**
 * Upcoming reservations — next ~7 days, grouped by date. Each day is a
 * dop-card with a header strip (weekday + date + count) and a tight
 * row-per-booking table. Reuses the reservation-row visual language
 * from Tonight's Reservations so operators can pattern-match.
 */
export function UpcomingPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main className="dop-no-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-16 pt-10">
        <header className="flex shrink-0 flex-col gap-3">
          <h1 className="hero-title whitespace-nowrap">Upcoming</h1>
        </header>

        {UPCOMING.map((day) => (
          <DayCard key={day.date} day={day} />
        ))}
      </main>
    </div>
  );
}

function DayCard({ day }: { day: UpcomingDay }) {
  const covers = day.bookings.reduce((n, b) => n + b.partySize, 0);
  return (
    // shrink-0 is load-bearing — without it, the parent `flex flex-col
    // overflow-y-auto min-h-0` compresses each card below its natural
    // content height and the last row gets visually clipped, leaving a
    // phantom horizontal line that reads as "a row with no data".
    <section className="dop-card shrink-0 overflow-hidden">
      <div
        className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-5 py-3"
        style={{ color: "var(--color-fg-strong)" }}
      >
        <div className="flex items-baseline gap-3">
          <span
            className="text-[16px]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            {day.weekday}
          </span>
          <span className="text-[13px] text-[var(--color-fg-tertiary)]">
            {day.dateLabel}
          </span>
        </div>
        <span className="text-[12px] text-[var(--color-fg-tertiary)]">
          {day.bookings.length} bookings · {covers} covers
        </span>
      </div>

      <div>
        {day.bookings.map((b, i) => (
          <BookingRow
            key={b.bookingId}
            booking={b}
            isLast={i === day.bookings.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function BookingRow({
  booking: b,
  isLast,
}: {
  booking: UpcomingBooking;
  isLast: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-2 px-5 py-4 transition-colors hover:bg-[var(--color-surface-hover)] ${
        isLast ? "" : "border-b border-[var(--color-border-subtle)]"
      }`}
      style={{
        gridTemplateColumns: "88px minmax(0,1fr) 44px 88px 84px",
      }}
    >
      <span
        className="truncate text-[14px] tabular-nums text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
          letterSpacing: "-0.005em",
        }}
      >
        {b.bookingId}
      </span>

      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{
            background: b.accentColor,
            fontVariationSettings: "'wght' 600",
          }}
          aria-hidden
        >
          {initials(b.hostName)}
        </div>
        <div className="flex min-w-0 flex-col">
          <span
            className="truncate text-[14px] text-[var(--color-fg-strong)]"
            style={{
              fontWeight: 510,
              fontVariationSettings: "'wght' 510",
              letterSpacing: "-0.005em",
            }}
          >
            {b.hostName}
          </span>
          {b.notes && (
            <span className="truncate text-[12px] text-[var(--color-fg-tertiary)]">
              {b.notes}
            </span>
          )}
        </div>
      </div>

      <span
        className="text-[14px] tabular-nums text-[var(--color-fg-strong)]"
        style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
      >
        {b.partySize}
      </span>

      <div className="flex items-center gap-2 text-[14px]">
        <FaCircle size={6} style={{ color: "var(--color-status-green)" }} />
        <span
          className="text-[var(--color-fg-strong)]"
          style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
        >
          {b.time}
        </span>
      </div>

      <span
        className="inline-flex h-[22px] items-center justify-center rounded-[2px] px-2 text-[11px]"
        style={{
          background: SOURCE_COLORS[b.source],
          color: "var(--color-fg-strong)",
          fontWeight: 510,
          fontVariationSettings: "'wght' 510",
        }}
      >
        {b.source}
      </span>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

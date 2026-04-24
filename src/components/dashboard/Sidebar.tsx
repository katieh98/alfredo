import type { ReactNode } from "react";
import {
  FaHouse,
  FaInbox,
  FaUtensils,
  FaUsers,
  FaWaveSquare,
  FaGear,
  FaCircle,
} from "react-icons/fa6";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}

function NavItem({ icon, label, active, badge }: NavItemProps) {
  return (
    <div
      className={`flex h-12 items-center gap-3 rounded-[10px] px-3 text-[16px] transition-colors ${
        active
          ? "bg-[var(--color-surface)] text-[var(--color-fg-strong)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-hover)]"
      }`}
      style={{
        fontWeight: active ? 510 : 430,
        fontVariationSettings: active ? "'wght' 510" : "'wght' 430",
        letterSpacing: "-0.01em",
      }}
    >
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center ${
          active ? "text-[var(--color-fg-strong)]" : "text-[var(--color-fg-faint)]"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="rounded-[5px] bg-black/5 px-2 py-0.5 text-[12px] font-medium leading-none text-[var(--color-fg-muted)]">
          {badge}
        </span>
      )}
    </div>
  );
}

interface RecentSessionProps {
  title: string;
  date: string;
  status: "booked" | "fallback" | "no-overlap";
}

function RecentSession({ title, date, status }: RecentSessionProps) {
  const dotColor =
    status === "booked"
      ? "var(--color-status-green)"
      : status === "fallback"
        ? "var(--color-status-amber)"
        : "var(--color-status-red)";
  return (
    <div className="group flex h-10 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors hover:bg-[var(--color-surface-hover)]">
      <FaCircle size={7} style={{ color: dotColor }} className="shrink-0" />
      <span
        className="flex-1 truncate text-[var(--color-fg-strong)]"
        style={{
          fontWeight: 430,
          fontVariationSettings: "'wght' 430",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </span>
      <span className="shrink-0 text-[13px] text-[var(--color-fg-faint)]">
        {date}
      </span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-[296px] shrink-0 flex-col rounded-[14px] bg-[var(--color-surface-raised)] p-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 pb-4 pt-2.5">
        <span
          className="text-[24px] leading-none text-[var(--color-fg-strong)]"
          style={{
            fontWeight: 600,
            fontVariationSettings: "'wght' 600",
            letterSpacing: "-0.035em",
          }}
        >
          alfredo
        </span>
        <span
          className="size-[9px] rounded-full"
          style={{ background: "var(--color-status-red)" }}
          aria-hidden
        />
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5">
        <NavItem icon={<FaHouse size={20} />} label="Home" />
        <NavItem icon={<FaInbox size={20} />} label="Sessions" active badge="7" />
        <NavItem icon={<FaUtensils size={20} />} label="Restaurants" />
        <NavItem icon={<FaUsers size={20} />} label="Party members" />
        <NavItem icon={<FaWaveSquare size={20} />} label="Activity" />
      </nav>

      {/* Recent */}
      <div className="eyebrow-strong mt-7 mb-2.5 px-3">Recent sessions</div>
      <div className="flex flex-col gap-0.5">
        <RecentSession title="Saturday dinner" date="now" status="booked" />
        <RecentSession title="Brunch, Apr 18" date="6d" status="booked" />
        <RecentSession title="Mini golf, Apr 12" date="12d" status="fallback" />
        <RecentSession title="Team lunch, Apr 3" date="21d" status="no-overlap" />
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-0.5 pt-5">
        <NavItem icon={<FaGear size={20} />} label="Settings" />
        <div className="mt-3 flex items-center gap-3 rounded-[12px] bg-[var(--color-surface)] px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
            style={{
              background: "#F04E55",
              fontVariationSettings: "'wght' 600",
            }}
            aria-hidden
          >
            V
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="truncate text-[14px] leading-[1.2] text-[var(--color-fg-strong)]"
              style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
            >
              Victoria
            </div>
            <div className="truncate text-[12px] leading-[1.3] text-[var(--color-fg-faint)]">
              @victoria · host
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

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
      className={`flex h-8 items-center gap-2 rounded-[6px] px-2 text-[13px] transition-colors ${
        active
          ? "bg-[var(--color-surface)] text-[var(--color-fg-strong)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-hover)]"
      }`}
      style={{
        fontWeight: active ? 510 : 450,
        fontVariationSettings: active ? "'wght' 510" : "'wght' 450",
      }}
    >
      <span
        className={`flex size-[14px] shrink-0 items-center justify-center ${
          active ? "text-[var(--color-fg-strong)]" : "text-[var(--color-fg-faint)]"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="rounded-[4px] bg-black/5 px-1.5 py-px text-[10px] font-medium leading-none text-[var(--color-fg-muted)]">
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
    <div className="group flex h-8 items-center gap-2 rounded-[6px] px-2 text-[13px] transition-colors hover:bg-[var(--color-surface-hover)]">
      <FaCircle size={5} style={{ color: dotColor }} className="shrink-0" />
      <span className="flex-1 truncate text-[var(--color-fg-strong)]">
        {title}
      </span>
      <span className="shrink-0 text-[11px] text-[var(--color-fg-faint)]">
        {date}
      </span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col rounded-[12px] bg-[var(--color-surface-raised)] p-2">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 pb-2 pt-1.5">
        <span
          className="text-[17px] leading-none text-[var(--color-fg-strong)]"
          style={{
            fontWeight: 600,
            fontVariationSettings: "'wght' 600",
            letterSpacing: "-0.025em",
          }}
        >
          alfredo
        </span>
        <span
          className="size-[6px] rounded-full"
          style={{ background: "var(--color-status-red)" }}
          aria-hidden
        />
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-px">
        <NavItem icon={<FaHouse size={13} />} label="Home" />
        <NavItem icon={<FaInbox size={13} />} label="Sessions" active badge="7" />
        <NavItem icon={<FaUtensils size={13} />} label="Restaurants" />
        <NavItem icon={<FaUsers size={13} />} label="Party members" />
        <NavItem icon={<FaWaveSquare size={13} />} label="Activity" />
      </nav>

      {/* Recent */}
      <div className="eyebrow-strong mt-5 mb-1.5 px-2">Recent sessions</div>
      <div className="flex flex-col gap-px">
        <RecentSession title="Saturday dinner" date="now" status="booked" />
        <RecentSession title="Brunch, Apr 18" date="6d" status="booked" />
        <RecentSession title="Mini golf, Apr 12" date="12d" status="fallback" />
        <RecentSession title="Team lunch, Apr 3" date="21d" status="no-overlap" />
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-px pt-4">
        <NavItem icon={<FaGear size={13} />} label="Settings" />
        <div className="mt-2 flex items-center gap-2 rounded-[8px] bg-[var(--color-surface)] px-2 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ background: "#F04E55" }}
            aria-hidden
          >
            V
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium leading-[1.2] text-[var(--color-fg-strong)]">
              Victoria
            </div>
            <div className="truncate text-[10px] leading-[1.2] text-[var(--color-fg-faint)]">
              @victoria · host
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

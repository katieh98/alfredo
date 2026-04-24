import Link from "next/link";
import type { ReactNode } from "react";
import {
  FaClock,
  FaCalendarDays,
  FaBolt,
  FaAddressBook,
  FaChartLine,
  FaGear,
} from "react-icons/fa6";
import { Wordmark } from "@/components/site-chrome";

export type DashboardPage =
  | "tonight"
  | "upcoming"
  | "boost"
  | "guests"
  | "reports"
  | "settings";

interface SidebarProps {
  activePage?: DashboardPage;
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

function NavItem({ icon, label, href, active, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-12 items-center gap-3 rounded-[10px] px-3 text-[16px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-border)] ${
        active
          ? "bg-[var(--color-surface)] text-[var(--color-fg-strong)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-fg-strong)]"
      }`}
      style={{
        fontWeight: active ? 510 : 430,
        fontVariationSettings: active ? "'wght' 510" : "'wght' 430",
        letterSpacing: "-0.01em",
      }}
    >
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center ${
          active
            ? "text-[var(--color-fg-strong)]"
            : "text-[var(--color-fg-faint)]"
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
    </Link>
  );
}

export function Sidebar({ activePage = "tonight" }: SidebarProps) {
  return (
    <aside className="flex h-full w-[296px] shrink-0 flex-col rounded-[14px] bg-[var(--color-surface-raised)] p-3">
      {/* Brand — shares the exact SVG wordmark from the marketing topbar
          (see site-chrome.tsx `Wordmark`) so the mark reads identically in
          both surfaces. Wordmark renders its own <Link href="/">, so we just
          wrap it in a padded box for the sidebar's inset. */}
      <div className="flex items-center px-3 pb-4 pt-2.5">
        <Wordmark />
      </div>

      {/* Primary nav — restaurant operator surfaces */}
      <nav className="flex flex-col gap-0.5">
        <NavItem
          icon={<FaClock size={20} />}
          label="Tonight"
          href="/dashboard"
          active={activePage === "tonight"}
          badge="3"
        />
        <NavItem
          icon={<FaCalendarDays size={20} />}
          label="Upcoming"
          href="/dashboard/upcoming"
          active={activePage === "upcoming"}
          badge="14"
        />
        <NavItem
          icon={<FaBolt size={20} />}
          label="Boost panel"
          href="/dashboard/boost"
          active={activePage === "boost"}
        />
        <NavItem
          icon={<FaAddressBook size={20} />}
          label="Guest book"
          href="/dashboard#guests"
          active={activePage === "guests"}
        />
        <NavItem
          icon={<FaChartLine size={20} />}
          label="Reports"
          href="/dashboard/reports"
          active={activePage === "reports"}
        />
      </nav>

      {/* Tonight's flags + Next seatings now live above the reservations
       *  table in the main content area — see OpsPanel. Keeping the
       *  sidebar to nav only keeps it scannable at a glance. */}

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-0.5 pt-5">
        <NavItem
          icon={<FaGear size={20} />}
          label="Settings"
          href="/dashboard/settings"
          active={activePage === "settings"}
        />
        <Link
          href="/dashboard/settings"
          className="mt-3 flex items-center gap-3 rounded-[12px] bg-[var(--color-surface)] px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-border)]"
        >
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
              @victoria · FoH manager
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}

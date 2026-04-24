import Link from "next/link";
import {
  FaShareNodes,
  FaDownload,
  FaChevronRight,
} from "react-icons/fa6";

interface HeaderProps {
  sessionShortId: string;
}

export function Header({ sessionShortId }: HeaderProps) {
  return (
    <header className="flex h-[64px] shrink-0 items-center justify-between px-1">
      {/* Breadcrumbs — osmo pill pattern (h-8 / 14px / full-round) */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex h-8 items-center rounded-full bg-[var(--color-surface-hover)] px-3.5 text-[14px] font-normal text-[var(--color-fg-strong)] transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-border)]"
          style={{ letterSpacing: "-0.005em" }}
        >
          reservations
        </Link>
        <FaChevronRight size={10} className="text-[var(--color-fg-tertiary)]" />
        <span
          className="flex h-8 items-center rounded-[4px] bg-[var(--color-surface-raised)] px-3 text-[14px] text-[var(--color-fg-strong)]"
          style={{
            fontWeight: 510,
            fontVariationSettings: "'wght' 510",
            letterSpacing: "-0.005em",
          }}
        >
          {sessionShortId}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button type="button" className="dop-btn">
          <FaShareNodes size={12} />
          Share
        </button>
        <button type="button" className="dop-btn">
          <FaDownload size={12} />
          Export
        </button>
      </div>
    </header>
  );
}

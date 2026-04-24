import {
  FaShareNodes,
  FaDownload,
  FaArrowsRotate,
  FaCircle,
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
        <button
          type="button"
          className="flex h-8 items-center rounded-full bg-[var(--color-surface-hover)] px-3.5 text-[14px] font-normal text-[var(--color-fg-strong)] transition-colors hover:bg-black/10"
          style={{ letterSpacing: "-0.005em" }}
        >
          Sessions
        </button>
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
        <span
          className="ml-1 inline-flex h-[24px] items-center gap-1.5 rounded-full border border-[rgba(46,204,113,0.25)] bg-[var(--color-status-green-light)] px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-status-green)]"
        >
          <FaCircle size={6} />
          Booked
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
        <button type="button" className="dop-btn-primary">
          <FaArrowsRotate size={12} />
          Rerun pipeline
        </button>
      </div>
    </header>
  );
}

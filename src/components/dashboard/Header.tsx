import {
  FaArrowLeft,
  FaShareNodes,
  FaDownload,
  FaArrowsRotate,
  FaCircle,
} from "react-icons/fa6";

interface HeaderProps {
  sessionShortId: string;
}

export function Header({ sessionShortId }: HeaderProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between px-1 pr-2">
      {/* Breadcrumbs — osmo pill pattern */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[13px] text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <FaArrowLeft size={11} />
          Back
        </button>
        <span className="text-[12px] text-[var(--color-fg-tertiary)]">/</span>
        <button
          type="button"
          className="flex h-7 items-center rounded-full bg-[var(--color-surface-hover)] px-3 text-[13px] font-normal text-[var(--color-fg-strong)] transition-colors hover:bg-black/10"
        >
          Sessions
        </button>
        <span className="text-[12px] text-[var(--color-fg-tertiary)]">/</span>
        <span
          className="flex h-7 items-center rounded-[3px] bg-[var(--color-surface-raised)] px-3 text-[13px] text-[var(--color-fg-strong)]"
          style={{ fontWeight: 510, fontVariationSettings: "'wght' 510" }}
        >
          {sessionShortId}
        </span>
        <span
          className="ml-1 inline-flex h-[22px] items-center gap-1.5 rounded-full border border-[rgba(46,204,113,0.25)] bg-[var(--color-status-green-light)] px-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-status-green)]"
        >
          <FaCircle size={5} />
          Booked
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button type="button" className="dop-btn hover:bg-[var(--color-surface-hover)]">
          <FaShareNodes size={11} />
          Share
        </button>
        <button type="button" className="dop-btn hover:bg-[var(--color-surface-hover)]">
          <FaDownload size={11} />
          Export
        </button>
        <button
          type="button"
          className="dop-btn-primary hover:opacity-90"
        >
          <FaArrowsRotate size={11} />
          Rerun pipeline
        </button>
      </div>
    </header>
  );
}

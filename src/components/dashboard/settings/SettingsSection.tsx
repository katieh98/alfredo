import type { ReactNode } from "react";

interface SettingsSectionProps {
  heading?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Ported from doppel_desktop's Codex-style SettingsSection.
 * Optional H2 + subtitle on top, rows wrapped in a bordered rounded card
 * with hairline dividers between rows (provided by `.dop-settings-card`).
 */
export function SettingsSection({
  heading,
  subtitle,
  action,
  children,
}: SettingsSectionProps) {
  const hasHeader = heading || subtitle || action;
  return (
    <section className="flex flex-col gap-3">
      {hasHeader ? (
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {heading ? (
              <h2
                className="text-[14px] text-[var(--color-fg-strong)]"
                style={{
                  fontWeight: 510,
                  fontVariationSettings: "'wght' 510",
                  letterSpacing: "-0.005em",
                }}
              >
                {heading}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="text-[13px] text-[var(--color-fg-tertiary)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className="dop-settings-card">{children}</div>
    </section>
  );
}

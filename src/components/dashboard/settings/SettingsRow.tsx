import type { ReactNode } from "react";

interface SettingsRowProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  control: ReactNode;
}

/**
 * Ported from doppel_desktop's SettingsRow. `flex items-center justify-between`
 * with label + subtitle on the left and the control on the right. The parent
 * `.dop-settings-card` supplies the hairline divider between rows.
 */
export function SettingsRow({
  title,
  subtitle,
  icon,
  control,
}: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span className="shrink-0 text-[var(--color-fg-faint)]">{icon}</span>
        ) : null}
        <div className="flex min-w-0 flex-col gap-0.5">
          <div
            className="min-w-0 truncate text-[14px] text-[var(--color-fg-strong)]"
            style={{
              fontWeight: 510,
              fontVariationSettings: "'wght' 510",
              letterSpacing: "-0.005em",
              lineHeight: "20px",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              className="min-w-0 text-[13px] text-[var(--color-fg-secondary)]"
              style={{ lineHeight: "18px", letterSpacing: "-0.005em" }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{control}</div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import type { FieldDef, FilterOperator, FilterRule } from "@/lib/filters/types";
import { operatorRequiresValue } from "@/lib/filters/operators";
import { getFilterChipLabel } from "@/lib/filters/chip-label";
import { FieldIcon } from "./FieldIcon";
import { OperatorMenu, PopoverShell, ValueMultiSelect } from "./filter-dropdowns";

interface SimpleFilterChipProps {
  rule: FilterRule;
  field: FieldDef | undefined;
  onUpdate: (updates: Partial<FilterRule>) => void;
  onRemove: () => void;
}

export function SimpleFilterChip({ rule, field, onUpdate, onRemove }: SimpleFilterChipProps) {
  const label = getFilterChipLabel(rule, field);
  const requiresValue = operatorRequiresValue(rule.operator);
  const fieldType = field?.type ?? rule.fieldType;

  const [opOpen, setOpOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [draft, setDraft] = useState<string>(() =>
    typeof rule.value === "string" ? rule.value : "",
  );
  useEffect(() => {
    if (typeof rule.value === "string") setDraft(rule.value);
    else if (rule.value === null) setDraft("");
  }, [rule.value]);

  function handleOperatorChange(op: FilterOperator) {
    const needs = operatorRequiresValue(op);
    onUpdate({ operator: op, value: needs ? rule.value : null });
    setOpOpen(false);
  }

  function commitText(v: string) {
    const trimmed = v.trim();
    if (trimmed !== rule.value) onUpdate({ value: trimmed || null });
  }

  function toggleSelectValue(v: string) {
    const current = Array.isArray(rule.value) ? rule.value : [];
    const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    onUpdate({ value: next });
  }

  return (
    <div className="dop-filter-pill">
      <button type="button" className="dop-filter-segment" disabled>
        {field && <FieldIcon name={field.icon} />}
        <span style={{ fontWeight: 500 }}>{label.fieldLabel}</span>
      </button>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => {
            setOpOpen((v) => !v);
            setValueOpen(false);
            setMenuOpen(false);
          }}
          className="dop-filter-segment dop-filter-segment-muted"
        >
          {label.operatorLabel}
        </button>
        <PopoverShell open={opOpen} onClose={() => setOpOpen(false)}>
          <OperatorMenu
            fieldType={fieldType}
            current={rule.operator}
            onSelect={handleOperatorChange}
          />
        </PopoverShell>
      </div>

      {requiresValue &&
        (fieldType === "text" || fieldType === "number" || fieldType === "date") && (
          <input
            type={fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitText(e.currentTarget.value);
                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => commitText(e.target.value)}
            placeholder="enter value…"
            className="dop-filter-input"
          />
        )}

      {requiresValue && (fieldType === "select" || fieldType === "multiselect") && (
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setValueOpen((v) => !v);
              setOpOpen(false);
              setMenuOpen(false);
            }}
            className="dop-filter-segment"
            style={{ fontWeight: 500 }}
          >
            {label.valueLabel || <span style={{ color: "var(--color-fg-faint)" }}>select…</span>}
          </button>
          <PopoverShell open={valueOpen} onClose={() => setValueOpen(false)}>
            <ValueMultiSelect
              options={field?.options ?? []}
              selected={Array.isArray(rule.value) ? rule.value : []}
              onToggle={toggleSelectValue}
            />
          </PopoverShell>
        </div>
      )}

      {requiresValue && fieldType === "boolean" && (
        <button
          type="button"
          onClick={() =>
            onUpdate({ value: rule.value === "true" ? "false" : "true" })
          }
          className="dop-filter-segment"
          style={{ fontWeight: 500 }}
        >
          {rule.value === "true" ? "Yes" : rule.value === "false" ? "No" : "choose…"}
        </button>
      )}

      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => {
            setMenuOpen((v) => !v);
            setOpOpen(false);
            setValueOpen(false);
          }}
          aria-label="Filter options"
          className="dop-filter-segment dop-filter-segment-muted"
          style={{ paddingInline: 8 }}
        >
          <FaEllipsis size={12} />
        </button>
        <PopoverShell open={menuOpen} onClose={() => setMenuOpen(false)} align="right">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onRemove();
            }}
            className="dop-filter-menu-item dop-filter-menu-item--danger"
          >
            <FaTrash size={11} />
            Delete filter
          </button>
        </PopoverShell>
      </div>
    </div>
  );
}

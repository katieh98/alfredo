"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import type { FieldDef, FieldType, FilterOperator } from "@/lib/filters/types";
import { getOperatorsForType, operatorLabel } from "@/lib/filters/operators";
import { FieldIcon } from "./FieldIcon";

export function PopoverShell({
  open,
  onClose,
  align = "left",
  children,
}: {
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className="dop-filter-menu"
      style={{ top: "calc(100% + 4px)", [align]: 0 }}
    >
      {children}
    </div>
  );
}

export function FieldPicker({
  fields,
  onSelect,
}: {
  fields: ReadonlyArray<FieldDef>;
  onSelect: (field: FieldDef) => void;
}) {
  const [query, setQuery] = useState("");
  const lower = query.toLowerCase();
  const matches = lower
    ? fields.filter(
        (f) =>
          f.label.toLowerCase().includes(lower) ||
          f.id.toLowerCase().includes(lower),
      )
    : fields;

  return (
    <div style={{ width: 220 }}>
      <input
        autoFocus
        placeholder="Search attributes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="dop-filter-menu-search"
      />
      <div style={{ maxHeight: 240, overflowY: "auto" }} className="dop-no-scrollbar">
        {matches.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f)}
            className="dop-filter-menu-item"
          >
            <FieldIcon name={f.icon} />
            {f.label}
          </button>
        ))}
        {matches.length === 0 && (
          <div
            style={{
              padding: "12px 8px",
              fontSize: 12,
              color: "var(--color-fg-faint)",
              textAlign: "center",
            }}
          >
            No attributes match
          </div>
        )}
      </div>
    </div>
  );
}

export function OperatorMenu({
  fieldType,
  current,
  onSelect,
}: {
  fieldType: FieldType;
  current: FilterOperator;
  onSelect: (op: FilterOperator) => void;
}) {
  const ops = getOperatorsForType(fieldType);
  return (
    <div style={{ minWidth: 180 }}>
      {ops.map((op) => (
        <button
          key={op}
          type="button"
          onClick={() => onSelect(op)}
          className={`dop-filter-menu-item ${op === current ? "dop-filter-menu-item--active" : ""}`}
        >
          {operatorLabel(op)}
        </button>
      ))}
    </div>
  );
}

export function ValueMultiSelect({
  options,
  selected,
  onToggle,
}: {
  options: ReadonlyArray<string>;
  selected: ReadonlyArray<string>;
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) {
    return (
      <div
        style={{
          padding: 12,
          fontSize: 12,
          color: "var(--color-fg-faint)",
          textAlign: "center",
          minWidth: 180,
        }}
      >
        No values to choose from
      </div>
    );
  }
  return (
    <div style={{ minWidth: 200, maxHeight: 240, overflowY: "auto" }} className="dop-no-scrollbar">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="dop-filter-menu-item"
          >
            <span className={`dop-filter-checkbox ${on ? "dop-filter-checkbox--on" : ""}`}>
              {on && <Check size={10} strokeWidth={3} />}
            </span>
            <span style={{ textTransform: "capitalize" }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

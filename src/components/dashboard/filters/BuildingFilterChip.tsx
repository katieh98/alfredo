"use client";

import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import type { FieldType, FilterOperator } from "@/lib/filters/types";
import {
  defaultOperatorForType,
  operatorLabel,
  operatorRequiresValue,
} from "@/lib/filters/operators";
import { FieldIcon } from "./FieldIcon";
import { OperatorMenu, PopoverShell, ValueMultiSelect } from "./filter-dropdowns";

export interface BuildingState {
  id: string;
  fieldId: string;
  fieldType: FieldType;
  fieldLabel: string;
  fieldIcon: string;
  fieldOptions?: string[];
  step: "operator" | "value";
  operator?: FilterOperator;
}

interface BuildingFilterChipProps {
  building: BuildingState;
  onOperatorPicked: (op: FilterOperator) => void;
  onValueCommitted: (value: string | string[]) => void;
  onCancel: () => void;
}

export function BuildingFilterChip({
  building,
  onOperatorPicked,
  onValueCommitted,
  onCancel,
}: BuildingFilterChipProps) {
  const [opOpen, setOpOpen] = useState(building.step === "operator");
  const [valueOpen, setValueOpen] = useState(building.step === "value");

  useEffect(() => {
    setOpOpen(building.step === "operator");
    setValueOpen(building.step === "value");
  }, [building.step]);

  const operator = building.operator ?? defaultOperatorForType(building.fieldType);
  const requiresValue = building.step === "value" && operatorRequiresValue(operator);

  const [draft, setDraft] = useState("");
  const [multi, setMulti] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      building.step === "value" &&
      (building.fieldType === "text" ||
        building.fieldType === "number" ||
        building.fieldType === "date")
    ) {
      inputRef.current?.focus();
    }
  }, [building.step, building.fieldType]);

  function commitText() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onValueCommitted(trimmed);
  }

  function commitMulti() {
    if (multi.length === 0) return;
    onValueCommitted(multi);
  }

  function toggleMulti(v: string) {
    setMulti((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  return (
    <div className="dop-filter-pill">
      <button type="button" className="dop-filter-segment" disabled>
        <FieldIcon name={building.fieldIcon} />
        <span style={{ fontWeight: 500 }}>{building.fieldLabel}</span>
      </button>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => {
            setOpOpen((v) => !v);
            setValueOpen(false);
          }}
          className="dop-filter-segment dop-filter-segment-muted"
        >
          {building.operator ? operatorLabel(building.operator) : "choose…"}
        </button>
        <PopoverShell open={opOpen} onClose={() => setOpOpen(false)}>
          <OperatorMenu
            fieldType={building.fieldType}
            current={operator}
            onSelect={(op) => {
              setOpOpen(false);
              onOperatorPicked(op);
            }}
          />
        </PopoverShell>
      </div>

      {requiresValue && (
        <>
          {(building.fieldType === "text" ||
            building.fieldType === "number" ||
            building.fieldType === "date") && (
            <input
              ref={inputRef}
              type={
                building.fieldType === "number"
                  ? "number"
                  : building.fieldType === "date"
                    ? "date"
                    : "text"
              }
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitText();
                else if (e.key === "Escape") onCancel();
              }}
              onBlur={commitText}
              placeholder="enter value…"
              className="dop-filter-input"
            />
          )}

          {(building.fieldType === "select" || building.fieldType === "multiselect") && (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setValueOpen((v) => !v)}
                className="dop-filter-segment"
                style={{ fontWeight: 500 }}
              >
                {multi.length === 0 ? (
                  <span style={{ color: "var(--color-fg-faint)" }}>select…</span>
                ) : (
                  multi.slice(0, 2).join(", ") +
                  (multi.length > 2 ? ` +${multi.length - 2}` : "")
                )}
              </button>
              <PopoverShell
                open={valueOpen}
                onClose={() => {
                  setValueOpen(false);
                  commitMulti();
                }}
              >
                <ValueMultiSelect
                  options={building.fieldOptions ?? []}
                  selected={multi}
                  onToggle={toggleMulti}
                />
                <div className="dop-filter-menu-divider" />
                <button
                  type="button"
                  onClick={() => {
                    setValueOpen(false);
                    commitMulti();
                  }}
                  className="dop-filter-menu-item"
                  style={{ justifyContent: "center", fontWeight: 500 }}
                >
                  Apply
                </button>
              </PopoverShell>
            </div>
          )}

          {building.fieldType === "boolean" && (
            <div style={{ display: "inline-flex", gap: 0 }}>
              <button
                type="button"
                onClick={() => onValueCommitted("true")}
                className="dop-filter-segment"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onValueCommitted("false")}
                className="dop-filter-segment"
              >
                No
              </button>
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="dop-filter-segment dop-filter-segment-muted"
        style={{ paddingInline: 8 }}
        aria-label="Cancel"
      >
        <FaXmark size={12} />
      </button>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  GripVertical,
  Plus,
  X,
} from "lucide-react";
import { FaArrowsUpDown } from "react-icons/fa6";
import type { FieldDef, SortRule } from "@/lib/filters/types";
import { FieldIcon } from "./FieldIcon";
import { FieldPicker, PopoverShell } from "./filter-dropdowns";

interface SortPanelProps {
  fields: ReadonlyArray<FieldDef>;
  sorts: ReadonlyArray<SortRule>;
  onChange: (sorts: SortRule[]) => void;
}

/** Sort button + popover — literal port of
 *  doppel_desktop/src/components/filters/SortPanel.tsx, with CSS variable
 *  namespace swapped to alfredo's (--color-text → --color-fg-strong, etc). */
export function SortPanel({ fields, sorts, onChange }: SortPanelProps) {
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ordered = [...sorts].sort((a, b) => a.position - b.position);

  function addSort(field: FieldDef) {
    const next: SortRule = {
      fieldId: field.id,
      direction: "asc",
      position: ordered.length,
    };
    onChange([...ordered, next]);
    setPickerOpen(false);
  }

  function removeSort(fieldId: string) {
    const next = ordered
      .filter((s) => s.fieldId !== fieldId)
      .map((s, i) => ({ ...s, position: i }));
    onChange(next);
  }

  function flipDirection(fieldId: string) {
    onChange(
      ordered.map((s) =>
        s.fieldId === fieldId
          ? { ...s, direction: s.direction === "asc" ? "desc" : "asc" }
          : s,
      ),
    );
  }

  function move(fieldId: string, delta: -1 | 1) {
    const idx = ordered.findIndex((s) => s.fieldId === fieldId);
    if (idx === -1) return;
    const target = idx + delta;
    if (target < 0 || target >= ordered.length) return;
    const copy = [...ordered];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy.map((s, i) => ({ ...s, position: i })));
  }

  function clearAll() {
    onChange([]);
  }

  const usedIds = new Set(ordered.map((s) => s.fieldId));
  const available = fields.filter((f) => !usedIds.has(f.id));

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          ordered.length > 0
            ? "dop-filter-pill-add dop-filter-pill-add--solid"
            : "dop-filter-pill-add"
        }
        style={
          ordered.length > 0
            ? { color: "var(--color-fg-strong)" }
            : undefined
        }
      >
        <FaArrowsUpDown size={11} />
        Sort
        {ordered.length > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 8,
              background: "var(--color-accent)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {ordered.length}
          </span>
        )}
        <ChevronDown size={12} strokeWidth={1.75} />
      </button>

      {/* align="left" — Sort sits at the LEFT edge of the filter cluster, so
          a right-anchored popover (doppel's default) would extend leftward and
          clip off the main column. Left-anchor instead so it opens rightward. */}
      <PopoverShell open={open} onClose={() => setOpen(false)} align="left">
        <div style={{ minWidth: 280 }}>
          <div
            className="dop-filter-menu-section-label"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Sort by</span>
            {ordered.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                style={{
                  background: "transparent",
                  border: 0,
                  fontSize: 11,
                  color: "var(--color-fg-muted)",
                  cursor: "pointer",
                  textTransform: "none",
                  letterSpacing: 0,
                  padding: 0,
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {ordered.length === 0 ? (
            <div
              style={{
                padding: "12px 8px",
                fontSize: 12,
                color: "var(--color-fg-faint)",
              }}
            >
              No sorts applied. Add one to order rows.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {ordered.map((sort, i) => {
                const field = fields.find((f) => f.id === sort.fieldId);
                return (
                  <div
                    key={sort.fieldId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 6px",
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <button
                        type="button"
                        onClick={() => move(sort.fieldId, -1)}
                        disabled={i === 0}
                        aria-label="Move up"
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          cursor: i === 0 ? "default" : "pointer",
                          opacity: i === 0 ? 0.3 : 0.7,
                          color: "var(--color-fg-muted)",
                        }}
                      >
                        <GripVertical size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(sort.fieldId, 1)}
                        disabled={i === ordered.length - 1}
                        aria-label="Move down"
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          cursor:
                            i === ordered.length - 1 ? "default" : "pointer",
                          opacity: i === ordered.length - 1 ? 0.3 : 0.7,
                          color: "var(--color-fg-muted)",
                        }}
                      >
                        <GripVertical size={10} />
                      </button>
                    </div>

                    <span
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--color-fg-strong)",
                      }}
                    >
                      {field && <FieldIcon name={field.icon} />}
                      {field?.label ?? sort.fieldId}
                    </span>

                    <button
                      type="button"
                      onClick={() => flipDirection(sort.fieldId)}
                      className="dop-filter-menu-item"
                      style={{
                        width: "auto",
                        height: 24,
                        padding: "0 8px",
                        gap: 4,
                        fontSize: 11,
                        color: "var(--color-fg-muted)",
                      }}
                    >
                      {sort.direction === "asc" ? (
                        <ArrowUp size={11} />
                      ) : (
                        <ArrowDown size={11} />
                      )}
                      {sort.direction === "asc" ? "Asc" : "Desc"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSort(sort.fieldId)}
                      aria-label={`Remove ${field?.label ?? sort.fieldId} sort`}
                      style={{
                        background: "transparent",
                        border: 0,
                        padding: 4,
                        cursor: "pointer",
                        color: "var(--color-fg-muted)",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="dop-filter-menu-divider" />

          <AddSortRow
            availableFields={available}
            onSelect={addSort}
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
          />
        </div>
      </PopoverShell>
    </div>
  );
}

interface AddSortRowProps {
  availableFields: ReadonlyArray<FieldDef>;
  onSelect: (field: FieldDef) => void;
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
}

function AddSortRow({
  availableFields,
  onSelect,
  pickerOpen,
  setPickerOpen,
}: AddSortRowProps) {
  if (availableFields.length === 0) {
    return (
      <div
        style={{
          padding: "8px",
          fontSize: 12,
          color: "var(--color-fg-faint)",
          textAlign: "center",
        }}
      >
        All fields already sorted
      </div>
    );
  }
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setPickerOpen(!pickerOpen)}
        className="dop-filter-menu-item"
      >
        <Plus size={13} strokeWidth={2} />
        Add sort
      </button>
      <PopoverShell open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <FieldPicker fields={availableFields} onSelect={onSelect} />
      </PopoverShell>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Filter as FilterIcon } from "lucide-react";
import type { FieldDef, FilterGroup, FilterOperator, FilterRule } from "@/lib/filters/types";
import {
  addConditionToGroup,
  countConditions,
  isFilterGroup,
  removeNode,
  shortNodeId,
} from "@/lib/filters/filter-groups";
import { operatorRequiresValue } from "@/lib/filters/operators";
import { FieldPicker, PopoverShell } from "./filter-dropdowns";
import { SimpleFilterChip } from "./SimpleFilterChip";
import { BuildingFilterChip, type BuildingState } from "./BuildingFilterChip";

interface FilterChipBarProps {
  fields: ReadonlyArray<FieldDef>;
  group: FilterGroup;
  onChange: (group: FilterGroup) => void;
}

export function FilterChipBar({ fields, group, onChange }: FilterChipBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [building, setBuilding] = useState<BuildingState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!building) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setBuilding(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [building]);

  const simpleRules = group.conditions.filter(
    (n): n is FilterRule => !isFilterGroup(n),
  );

  function startBuilding(field: FieldDef) {
    setBuilding({
      id: shortNodeId(),
      fieldId: field.id,
      fieldType: field.type,
      fieldLabel: field.label,
      fieldIcon: field.icon,
      fieldOptions: field.options,
      step: "operator",
    });
    setPickerOpen(false);
  }

  function commitOperator(op: FilterOperator) {
    if (!building) return;
    if (!operatorRequiresValue(op)) {
      const rule: FilterRule = {
        id: building.id,
        fieldId: building.fieldId,
        fieldType: building.fieldType,
        operator: op,
        value: null,
      };
      onChange(addConditionToGroup(group, group.id, rule));
      setBuilding(null);
    } else {
      setBuilding({ ...building, step: "value", operator: op });
    }
  }

  function commitValue(value: string | string[]) {
    if (!building || !building.operator) return;
    const rule: FilterRule = {
      id: building.id,
      fieldId: building.fieldId,
      fieldType: building.fieldType,
      operator: building.operator,
      value,
    };
    onChange(addConditionToGroup(group, group.id, rule));
    setBuilding(null);
  }

  function updateRule(ruleId: string, updates: Partial<FilterRule>) {
    function step(g: FilterGroup): FilterGroup {
      return {
        ...g,
        conditions: g.conditions.map((node) => {
          if (isFilterGroup(node)) return step(node);
          if (node.id === ruleId) return { ...node, ...updates };
          return node;
        }),
      };
    }
    onChange(step(group));
  }

  function removeRule(id: string) {
    onChange(removeNode(group, id));
  }

  const usedIds = new Set(simpleRules.map((r) => r.fieldId));
  if (building) usedIds.add(building.fieldId);
  const availableFields = fields.filter((f) => !usedIds.has(f.id));

  const total = countConditions(group);

  if (total === 0 && !building) {
    return (
      <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="dop-filter-pill-add"
        >
          <FilterIcon size={13} strokeWidth={1.75} />
          Filter
        </button>
        <PopoverShell open={pickerOpen} onClose={() => setPickerOpen(false)}>
          <FieldPicker fields={availableFields} onSelect={startBuilding} />
        </PopoverShell>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
    >
      {simpleRules.map((rule) => (
        <SimpleFilterChip
          key={rule.id}
          rule={rule}
          field={fields.find((f) => f.id === rule.fieldId)}
          onUpdate={(updates) => updateRule(rule.id, updates)}
          onRemove={() => removeRule(rule.id)}
        />
      ))}

      {building && (
        <BuildingFilterChip
          building={building}
          onOperatorPicked={commitOperator}
          onValueCommitted={commitValue}
          onCancel={() => setBuilding(null)}
        />
      )}

      {!building && (
        <div style={{ position: "relative", display: "inline-flex" }}>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="dop-filter-pill-add"
            aria-label="Add filter"
          >
            <Plus size={13} strokeWidth={2} />
          </button>
          <PopoverShell open={pickerOpen} onClose={() => setPickerOpen(false)}>
            <FieldPicker fields={availableFields} onSelect={startBuilding} />
          </PopoverShell>
        </div>
      )}
    </div>
  );
}

import type { FilterRule, FieldDef } from "./types";
import { operatorLabel, operatorRequiresValue } from "./operators";

export interface ChipLabel {
  fieldLabel: string;
  operatorLabel: string;
  valueLabel: string;
}

const COMPACT_OPERATORS: Partial<Record<string, string>> = {
  eq: "=", neq: "≠", gt: ">", gte: "≥", lt: "<", lte: "≤",
  is_before: "before", is_after: "after",
  in: "is", not_in: "is not",
  contains: "contains", not_contains: "not",
  starts_with: "starts", ends_with: "ends",
  is_empty: "is empty", is_not_empty: "is set",
};

export function getFilterChipLabel(rule: FilterRule, field: FieldDef | undefined): ChipLabel {
  const fieldLabel = field?.label ?? rule.fieldId;
  const opLabel = COMPACT_OPERATORS[rule.operator] ?? operatorLabel(rule.operator);
  if (!operatorRequiresValue(rule.operator)) {
    return { fieldLabel, operatorLabel: opLabel, valueLabel: "" };
  }
  return { fieldLabel, operatorLabel: opLabel, valueLabel: formatValue(rule.value) };
}

function formatValue(value: string | string[] | null): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (value.length <= 2) return value.join(", ");
    return `${value[0]}, ${value[1]} +${value.length - 2}`;
  }
  return String(value);
}

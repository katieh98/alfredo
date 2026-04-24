import type { FieldType, FilterOperator } from "./types";

export const OPERATORS_BY_TYPE: Record<FieldType, FilterOperator[]> = {
  text: ["contains", "is", "is_not", "not_contains", "starts_with", "ends_with", "is_empty", "is_not_empty"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte", "is_empty", "is_not_empty"],
  date: ["is_before", "is_after", "is_today", "is_this_week", "is_past_month", "is_empty", "is_not_empty"],
  select: ["in", "not_in", "is_empty", "is_not_empty"],
  multiselect: ["in", "not_in", "is_empty", "is_not_empty"],
  boolean: ["is", "is_not"],
};

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  is: "is", is_not: "is not", contains: "contains", not_contains: "does not contain",
  starts_with: "starts with", ends_with: "ends with", is_empty: "is empty", is_not_empty: "is not empty",
  eq: "equals", neq: "does not equal", gt: "greater than", gte: "greater than or equal",
  lt: "less than", lte: "less than or equal",
  in: "is any of", not_in: "is none of",
  is_before: "is before", is_after: "is after", is_today: "is today",
  is_this_week: "is this week", is_past_month: "is in the past month",
};

const NO_VALUE_OPERATORS = new Set<FilterOperator>([
  "is_empty", "is_not_empty", "is_today", "is_this_week", "is_past_month",
]);

export function getOperatorsForType(type: FieldType): FilterOperator[] {
  return OPERATORS_BY_TYPE[type] ?? [];
}
export function operatorLabel(op: FilterOperator): string {
  return OPERATOR_LABELS[op] ?? op;
}
export function operatorRequiresValue(op: FilterOperator): boolean {
  return !NO_VALUE_OPERATORS.has(op);
}
export function defaultOperatorForType(type: FieldType): FilterOperator {
  switch (type) {
    case "text": return "contains";
    case "number": return "eq";
    case "date": return "is_after";
    case "select":
    case "multiselect": return "in";
    case "boolean": return "is";
  }
}

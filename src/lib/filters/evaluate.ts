import type { FilterGroup, FilterNode, FilterRule } from "./types";
import { isFilterGroup } from "./filter-groups";

type FieldValueFn = (rule: FilterRule) => unknown;

export function evaluateGroup(
  group: FilterGroup,
  getValue: FieldValueFn,
): boolean {
  if (group.conditions.length === 0) return true;
  const results = group.conditions.map((node) => evaluateNode(node, getValue));
  return group.conjunction === "and" ? results.every(Boolean) : results.some(Boolean);
}

function evaluateNode(node: FilterNode, getValue: FieldValueFn): boolean {
  if (isFilterGroup(node)) return evaluateGroup(node, getValue);
  return evaluateRule(node, getValue);
}

function evaluateRule(rule: FilterRule, getValue: FieldValueFn): boolean {
  const actual = getValue(rule);
  const { operator, value } = rule;

  const asString = (v: unknown) =>
    v === null || v === undefined ? "" : String(v).toLowerCase();
  const asArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x).toLowerCase()) : [asString(v)];
  const targetString = () => (typeof value === "string" ? value.toLowerCase() : "");
  const targetArray = () =>
    Array.isArray(value) ? value.map((x) => x.toLowerCase()) : [targetString()];

  switch (operator) {
    case "is": return asString(actual) === targetString();
    case "is_not": return asString(actual) !== targetString();
    case "contains": return asString(actual).includes(targetString());
    case "not_contains": return !asString(actual).includes(targetString());
    case "starts_with": return asString(actual).startsWith(targetString());
    case "ends_with": return asString(actual).endsWith(targetString());
    case "is_empty":
      return actual === null || actual === undefined || actual === "" ||
        (Array.isArray(actual) && actual.length === 0);
    case "is_not_empty":
      return !(actual === null || actual === undefined || actual === "" ||
        (Array.isArray(actual) && actual.length === 0));
    case "eq": return Number(actual) === Number(value);
    case "neq": return Number(actual) !== Number(value);
    case "gt": return Number(actual) > Number(value);
    case "gte": return Number(actual) >= Number(value);
    case "lt": return Number(actual) < Number(value);
    case "lte": return Number(actual) <= Number(value);
    case "in": {
      const targets = targetArray();
      const actuals = asArray(actual);
      return actuals.some((a) => targets.includes(a));
    }
    case "not_in": {
      const targets = targetArray();
      const actuals = asArray(actual);
      return !actuals.some((a) => targets.includes(a));
    }
    default:
      return true;
  }
}

import type { FilterRule, FilterGroup, FilterNode, SortRule } from "./types";
import { isFilterGroup } from "./filter-groups";

type AnyRecord = Record<string, unknown>;

function readField(row: AnyRecord, fieldId: string): unknown {
  return row[fieldId];
}

function isEmpty(v: unknown): boolean {
  return v === null || v === undefined || v === "";
}

function toComparableString(v: unknown): string {
  if (Array.isArray(v)) return v.join(",");
  if (v === null || v === undefined) return "";
  return String(v);
}

/** Match a single rule against a row. Text operators use case-insensitive
 *  comparison; number operators coerce both sides; date operators parse the
 *  cell as a Date. Unknown operators return true so a buggy rule never
 *  accidentally hides every row. */
function matchRule(row: AnyRecord, rule: FilterRule): boolean {
  const raw = readField(row, rule.fieldId);
  const { operator, value } = rule;

  switch (operator) {
    case "is_empty":
      if (Array.isArray(raw)) return raw.length === 0;
      return isEmpty(raw);

    case "is_not_empty":
      if (Array.isArray(raw)) return raw.length > 0;
      return !isEmpty(raw);

    case "is": {
      const a = toComparableString(raw).toLowerCase();
      const b = toComparableString(value).toLowerCase();
      return a === b;
    }
    case "is_not": {
      const a = toComparableString(raw).toLowerCase();
      const b = toComparableString(value).toLowerCase();
      return a !== b;
    }
    case "contains": {
      if (raw === null || raw === undefined) return false;
      return toComparableString(raw).toLowerCase().includes(toComparableString(value).toLowerCase());
    }
    case "not_contains": {
      if (raw === null || raw === undefined) return true;
      return !toComparableString(raw).toLowerCase().includes(toComparableString(value).toLowerCase());
    }
    case "starts_with": {
      if (raw === null || raw === undefined) return false;
      return toComparableString(raw).toLowerCase().startsWith(toComparableString(value).toLowerCase());
    }
    case "ends_with": {
      if (raw === null || raw === undefined) return false;
      return toComparableString(raw).toLowerCase().endsWith(toComparableString(value).toLowerCase());
    }

    case "in": {
      const needles = Array.isArray(value) ? value : [value ?? ""];
      if (Array.isArray(raw)) {
        const cellLower = raw.map((v) => toComparableString(v).toLowerCase());
        return needles.some((n) => cellLower.includes(toComparableString(n).toLowerCase()));
      }
      const cell = toComparableString(raw).toLowerCase();
      return needles.some((n) => toComparableString(n).toLowerCase() === cell);
    }
    case "not_in": {
      const needles = Array.isArray(value) ? value : [value ?? ""];
      if (Array.isArray(raw)) {
        const cellLower = raw.map((v) => toComparableString(v).toLowerCase());
        return !needles.some((n) => cellLower.includes(toComparableString(n).toLowerCase()));
      }
      const cell = toComparableString(raw).toLowerCase();
      return !needles.some((n) => toComparableString(n).toLowerCase() === cell);
    }

    case "eq":
      return Number(raw) === Number(value);
    case "neq":
      return Number(raw) !== Number(value);
    case "gt":
      return !isEmpty(raw) && Number(raw) > Number(value);
    case "gte":
      return !isEmpty(raw) && Number(raw) >= Number(value);
    case "lt":
      return !isEmpty(raw) && Number(raw) < Number(value);
    case "lte":
      return !isEmpty(raw) && Number(raw) <= Number(value);

    case "is_before": {
      if (isEmpty(raw) || isEmpty(value)) return false;
      return new Date(String(raw)) < new Date(String(value));
    }
    case "is_after": {
      if (isEmpty(raw) || isEmpty(value)) return false;
      return new Date(String(raw)) > new Date(String(value));
    }
    case "is_today": {
      if (isEmpty(raw)) return false;
      const d = new Date(String(raw));
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }
    case "is_this_week": {
      if (isEmpty(raw)) return false;
      const d = new Date(String(raw));
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      return d >= weekStart && d < weekEnd;
    }
    case "is_past_month": {
      if (isEmpty(raw)) return false;
      const d = new Date(String(raw));
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return d >= monthAgo && d <= now;
    }

    default:
      return true;
  }
}

/** Flat-AND filter for simple consumers. All rules must match. */
export function applyFilters<T extends AnyRecord>(records: T[], rules: FilterRule[]): T[] {
  if (rules.length === 0) return records;
  return records.filter((row) => rules.every((rule) => matchRule(row, rule)));
}

/** Tree evaluation honoring each group's AND/OR conjunction. */
export function applyFilterGroup<T extends AnyRecord>(records: T[], group: FilterGroup): T[] {
  if (group.conditions.length === 0) return records;
  return records.filter((row) => evaluateNode(row, group));
}

function evaluateNode(row: AnyRecord, node: FilterNode): boolean {
  if (isFilterGroup(node)) {
    if (node.conditions.length === 0) return true;
    if (node.conjunction === "and") {
      return node.conditions.every((child) => evaluateNode(row, child));
    }
    return node.conditions.some((child) => evaluateNode(row, child));
  }
  return matchRule(row, node);
}

/** Multi-key sort. Sorts are applied in `position` order; ties fall through
 *  to the next sort. Null/undefined cells sink to the end regardless of
 *  direction so "no data" rows don't pollute the top of the table. */
export function applySorts<T extends AnyRecord>(records: T[], sorts: SortRule[]): T[] {
  if (sorts.length === 0) return records;
  const ordered = [...sorts].sort((a, b) => a.position - b.position);
  const copy = [...records];

  copy.sort((a, b) => {
    for (const sort of ordered) {
      const av = readField(a, sort.fieldId);
      const bv = readField(b, sort.fieldId);

      if (av === null || av === undefined) return bv === null || bv === undefined ? 0 : 1;
      if (bv === null || bv === undefined) return -1;

      let cmp = 0;
      if (typeof av === "string" && typeof bv === "string") {
        cmp = av.localeCompare(bv, undefined, { sensitivity: "base", numeric: true });
      } else {
        cmp = Number(av) - Number(bv);
      }
      if (cmp !== 0) return sort.direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  return copy;
}

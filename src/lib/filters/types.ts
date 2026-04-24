/**
 * Core filter/sort type model. A FilterNode is either a leaf FilterRule
 * (one field/operator/value triple) or a FilterGroup (a conjunction of
 * child nodes). Groups can nest, so arbitrary AND/OR expressions are
 * representable as a tree without leaking into the UI layer.
 */

export type FieldType = "text" | "number" | "date" | "select" | "multiselect" | "boolean";

export type FilterOperator =
  // text
  | "is" | "is_not" | "contains" | "not_contains" | "starts_with" | "ends_with" | "is_empty" | "is_not_empty"
  // number
  | "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
  // select / multiselect
  | "in" | "not_in"
  // date
  | "is_before" | "is_after" | "is_today" | "is_this_week" | "is_past_month";

export interface FilterRule {
  id: string;
  fieldId: string;
  fieldType: FieldType;
  operator: FilterOperator;
  value: string | string[] | null;
}

export type FilterConjunction = "and" | "or";

export interface FilterGroup {
  id: string;
  conjunction: FilterConjunction;
  conditions: FilterNode[];
}

export type FilterNode = FilterRule | FilterGroup;

export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
  position: number;
}

export interface FilterSortState {
  group: FilterGroup;
  sorts: SortRule[];
}

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  /** lucide-react icon name (resolved in FieldIcon). */
  icon: string;
  visible: boolean;
  /** Choices for select / multiselect. Omit for free-text or number fields. */
  options?: string[];
}

export type FieldType = "text" | "number" | "date" | "select" | "multiselect" | "boolean";

export type FilterOperator =
  | "is" | "is_not" | "contains" | "not_contains" | "starts_with" | "ends_with" | "is_empty" | "is_not_empty"
  | "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
  | "in" | "not_in"
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

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  icon: string;
  options?: string[];
}

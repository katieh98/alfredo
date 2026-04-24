import type { FilterGroup, FilterNode, FilterRule } from "./types";

function shortId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

export function isFilterGroup(node: FilterNode): node is FilterGroup {
  return "conjunction" in node && "conditions" in node;
}

export function countConditions(group: FilterGroup): number {
  let total = 0;
  for (const node of group.conditions) {
    total += isFilterGroup(node) ? countConditions(node) : 1;
  }
  return total;
}

export function flattenConditions(group: FilterGroup): FilterRule[] {
  const out: FilterRule[] = [];
  for (const node of group.conditions) {
    if (isFilterGroup(node)) out.push(...flattenConditions(node));
    else out.push(node);
  }
  return out;
}

export function createRootGroup(conditions: FilterNode[] = []): FilterGroup {
  return { id: "root", conjunction: "and", conditions };
}

export function addConditionToGroup(
  root: FilterGroup,
  groupId: string,
  condition: FilterNode,
): FilterGroup {
  if (root.id === groupId) {
    return { ...root, conditions: [...root.conditions, condition] };
  }
  return {
    ...root,
    conditions: root.conditions.map((node) =>
      isFilterGroup(node) ? addConditionToGroup(node, groupId, condition) : node,
    ),
  };
}

export function removeNode(root: FilterGroup, nodeId: string): FilterGroup {
  const filtered = root.conditions
    .filter((node) => node.id !== nodeId)
    .map((node) => (isFilterGroup(node) ? removeNode(node, nodeId) : node));
  const collapsed = filtered.map((node) => {
    if (isFilterGroup(node) && node.conditions.length === 1) {
      return node.conditions[0];
    }
    return node;
  });
  return { ...root, conditions: collapsed };
}

export function clearAllFilters(root: FilterGroup): FilterGroup {
  return { ...root, conditions: [] };
}

export function updateRule(
  root: FilterGroup,
  ruleId: string,
  updates: Partial<FilterRule>,
): FilterGroup {
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
  return step(root);
}

export { shortId as shortNodeId };

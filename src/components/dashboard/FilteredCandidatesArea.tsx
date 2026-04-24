"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, LayoutGrid, List } from "lucide-react";
import type { Restaurant } from "@/app/dashboard/_data";
import { FilterChipBar } from "@/components/dashboard/filters/FilterChipBar";
import { RestaurantList } from "@/components/dashboard/RestaurantList";
import type { FilterGroup, SortRule } from "@/lib/filters/types";
import { createRootGroup } from "@/lib/filters/filter-groups";
import { applyFilterGroup, applySorts } from "@/lib/filters/apply-filters";
import {
  buildRestaurantFields,
  restaurantToFilterRow,
} from "@/lib/filters/restaurant-fields";

interface FilteredCandidatesAreaProps {
  restaurants: Restaurant[];
  selectedId: string;
  onSelect?: (id: string) => void;
}

/** Mirrors doppel_desktop's DropsView pipeline:
 *  indexed = [{drop, ...row, __i}, …] → applyFilterGroup → applySorts
 *  → map back to original objects. Carrying the original Restaurant
 *  alongside its filter projection preserves identity across the pipeline. */
export function FilteredCandidatesArea({
  restaurants,
  selectedId,
}: FilteredCandidatesAreaProps) {
  const [group, setGroup] = useState<FilterGroup>(() => createRootGroup());
  const [sorts] = useState<SortRule[]>([]);

  const fields = useMemo(() => buildRestaurantFields(restaurants), [restaurants]);

  const visible = useMemo(() => {
    if (group.conditions.length === 0 && sorts.length === 0) return restaurants;
    const indexed = restaurants.map((r, i) => ({
      r,
      ...restaurantToFilterRow(r),
      __i: i,
    }));
    const matched = applyFilterGroup(indexed, group);
    const sorted = applySorts(matched, sorts);
    return sorted.map((row) => (row as { r: Restaurant }).r);
  }, [restaurants, group, sorts]);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FilterChipBar fields={fields} group={group} onChange={setGroup} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[13px] text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            <ArrowUpDown size={13} strokeWidth={1.75} />
            Best match
            <ChevronDown size={12} strokeWidth={1.75} />
          </button>
          <div className="flex h-9 overflow-hidden rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
            <button
              type="button"
              title="List view"
              className="flex h-full w-9 items-center justify-center text-[var(--color-fg-strong)]"
              style={{ background: "var(--color-surface-hover)" }}
            >
              <List size={14} strokeWidth={1.75} />
            </button>
            <span className="w-px bg-[var(--color-border-subtle)]" />
            <button
              type="button"
              title="Grid view"
              className="flex h-full w-9 items-center justify-center text-[var(--color-fg-faint)] hover:text-[var(--color-fg-muted)]"
            >
              <LayoutGrid size={14} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <section>
        <RestaurantList restaurants={visible} selectedId={selectedId} />
      </section>
    </>
  );
}

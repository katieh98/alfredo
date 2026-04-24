"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import type { Restaurant } from "@/app/dashboard/_data";
import { FilterChipBar } from "@/components/dashboard/filters/FilterChipBar";
import { SortPanel } from "@/components/dashboard/filters/SortPanel";
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
  onSelect,
}: FilteredCandidatesAreaProps) {
  const [group, setGroup] = useState<FilterGroup>(() => createRootGroup());
  const [sorts, setSorts] = useState<SortRule[]>([]);

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
    <section className="flex flex-col">
      {/* Section title — sits above the filter row so the table reads as
          "Tonight's reservations → narrow with filters → table". */}
      <header className="mb-4">
        <h2
          className="text-[20px] text-[var(--color-fg-strong)]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Tonight&apos;s reservations
        </h2>
      </header>

      {/* Filter / sort / view toggles — tight gap below so the controls
          read as the table's toolbar, not as their own section. */}
      <div className="mb-3 flex items-center justify-between gap-4">
        {/* Sort sits to the LEFT of Filter (per doppel's DropsView pattern;
            operator convention puts ordering controls before narrowing). */}
        <div className="flex items-center gap-2">
          <SortPanel fields={fields} sorts={sorts} onChange={setSorts} />
          <FilterChipBar fields={fields} group={group} onChange={setGroup} />
        </div>

        <div className="flex items-center gap-2">
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

      <RestaurantList
        restaurants={visible}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  );
}

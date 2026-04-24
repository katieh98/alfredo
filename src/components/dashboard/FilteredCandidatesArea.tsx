"use client";

import { useMemo, useState } from "react";
import {
  FaBarsStaggered,
  FaChevronDown,
  FaListUl,
  FaTableCellsLarge,
} from "react-icons/fa6";
import type { Restaurant } from "@/app/dashboard/_data";
import { FilterChipBar } from "@/components/dashboard/filters/FilterChipBar";
import { RestaurantList } from "@/components/dashboard/RestaurantList";
import type { FilterGroup } from "@/lib/filters/types";
import { createRootGroup } from "@/lib/filters/filter-groups";
import { evaluateGroup } from "@/lib/filters/evaluate";
import {
  RESTAURANT_FIELDS,
  getRestaurantFieldValue,
} from "@/lib/filters/fields";

interface FilteredCandidatesAreaProps {
  restaurants: Restaurant[];
  selectedId: string;
}

export function FilteredCandidatesArea({
  restaurants,
  selectedId,
}: FilteredCandidatesAreaProps) {
  const [group, setGroup] = useState<FilterGroup>(() => createRootGroup());

  const visible = useMemo(
    () =>
      restaurants.filter((r) =>
        evaluateGroup(group, (rule) => getRestaurantFieldValue(r, rule)),
      ),
    [restaurants, group],
  );

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChipBar
            fields={RESTAURANT_FIELDS}
            group={group}
            onChange={setGroup}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="dop-chip hover:bg-[var(--color-surface-hover)]"
          >
            <FaBarsStaggered size={11} />
            Best match
            <FaChevronDown size={9} />
          </button>
          <div className="flex h-8 overflow-hidden rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
            <button
              type="button"
              title="List view"
              className="flex h-full w-9 items-center justify-center text-[var(--color-fg-strong)]"
              style={{ background: "var(--color-surface-hover)" }}
            >
              <FaListUl size={12} />
            </button>
            <span className="w-px bg-[var(--color-border-subtle)]" />
            <button
              type="button"
              title="Grid view"
              className="flex h-full w-9 items-center justify-center text-[var(--color-fg-faint)] hover:text-[var(--color-fg-muted)]"
            >
              <FaTableCellsLarge size={12} />
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

import type { Restaurant } from "@/app/dashboard/_data";
import type { FieldDef } from "./types";

/** Static schema. Dynamic option lists (cuisine, neighborhood) are
 *  populated at runtime from the actual restaurant set — see
 *  `buildRestaurantFields`. Mirrors doppel_desktop's workflow-fields.ts. */
const STATIC_FIELDS: ReadonlyArray<FieldDef> = [
  { id: "name",         label: "Name",         type: "text",        icon: "type",        visible: true },
  { id: "cuisine",      label: "Cuisine",      type: "select",      icon: "tag",         visible: true, options: [] },
  { id: "priceRange",   label: "Price",        type: "select",      icon: "hash",        visible: true, options: ["$", "$$", "$$$", "$$$$"] },
  { id: "dietary",      label: "Dietary",      type: "multiselect", icon: "grid",        visible: true, options: ["Vegetarian", "Vegan", "Gluten-free"] },
  { id: "neighborhood", label: "Neighborhood", type: "select",      icon: "align-left",  visible: true, options: [] },
  { id: "rating",       label: "Rating",       type: "number",      icon: "hash",        visible: true },
  { id: "score",        label: "Score",        type: "number",      icon: "hash",        visible: true },
  { id: "available",    label: "Availability", type: "boolean",     icon: "boolean",     visible: true },
];

/** Schema with select/multiselect option lists populated from the actual
 *  restaurants in scope (sorted, deduped). */
export function buildRestaurantFields(restaurants: ReadonlyArray<Restaurant>): FieldDef[] {
  const cuisines = new Set<string>();
  const neighborhoods = new Set<string>();
  for (const r of restaurants) {
    if (r.cuisine) cuisines.add(r.cuisine);
    if (r.neighborhood) neighborhoods.add(r.neighborhood);
  }
  const cuisineOpts = [...cuisines].sort();
  const neighborhoodOpts = [...neighborhoods].sort();

  return STATIC_FIELDS.map((f) => {
    if (f.id === "cuisine") return { ...f, options: cuisineOpts };
    if (f.id === "neighborhood") return { ...f, options: neighborhoodOpts };
    return { ...f };
  });
}

/** Project a Restaurant into a plain record the filter engine can read.
 *  The filter engine treats records as `Record<string, unknown>` and looks
 *  up fields by id — so as long as the keys match `FieldDef.id` we're set. */
export function restaurantToFilterRow(r: Restaurant): Record<string, unknown> {
  const dietaryTags: string[] = [];
  if (r.dietary.vegetarian) dietaryTags.push("Vegetarian");
  if (r.dietary.vegan) dietaryTags.push("Vegan");
  if (r.dietary.glutenFree) dietaryTags.push("Gluten-free");

  return {
    name: r.name,
    cuisine: r.cuisine,
    priceRange: r.priceRange,
    dietary: dietaryTags,
    neighborhood: r.neighborhood,
    rating: r.rating,
    score: r.score,
    available: r.availability.some((s) => s.available) ? "true" : "false",
  };
}

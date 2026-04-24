import type { FieldDef } from "./types";
import type { Restaurant } from "@/app/dashboard/_data";
import type { FilterRule } from "./types";

export const RESTAURANT_FIELDS: FieldDef[] = [
  {
    id: "cuisine",
    label: "Cuisine",
    type: "multiselect",
    icon: "tag",
    options: ["Italian", "Japanese", "Mexican", "Thai", "Indian", "Mediterranean", "French", "American"],
  },
  {
    id: "priceRange",
    label: "Price",
    type: "select",
    icon: "hash",
    options: ["$", "$$", "$$$", "$$$$"],
  },
  {
    id: "dietary",
    label: "Dietary",
    type: "multiselect",
    icon: "tag",
    options: ["Vegetarian", "Vegan", "Gluten-free"],
  },
  {
    id: "neighborhood",
    label: "Neighborhood",
    type: "text",
    icon: "text",
  },
  {
    id: "rating",
    label: "Rating",
    type: "number",
    icon: "hash",
  },
  {
    id: "score",
    label: "Score",
    type: "number",
    icon: "hash",
  },
  {
    id: "availability",
    label: "Availability",
    type: "boolean",
    icon: "boolean",
  },
];

export function getRestaurantFieldValue(r: Restaurant, rule: FilterRule): unknown {
  switch (rule.fieldId) {
    case "cuisine": return r.cuisine;
    case "priceRange": return r.priceRange;
    case "dietary": {
      const tags: string[] = [];
      if (r.dietary.vegetarian) tags.push("Vegetarian");
      if (r.dietary.vegan) tags.push("Vegan");
      if (r.dietary.glutenFree) tags.push("Gluten-free");
      return tags;
    }
    case "neighborhood": return r.neighborhood;
    case "rating": return r.rating;
    case "score": return r.score;
    case "availability": {
      const anyOpen = r.availability.some((s) => s.available);
      return anyOpen ? "true" : "false";
    }
    default: return undefined;
  }
}

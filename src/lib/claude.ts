import OpenAI from "openai";
import type { Slot } from "./slots";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  phone?: string;
  openTableId?: string;
  enrichment?: {
    topDishes: string[];
    vibeSummary: string;
  };
}

interface UserPrefs {
  discordId: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  priceRange: string;
}

export interface RestaurantPick {
  restaurantId: string;
  restaurant: Restaurant;
  slotKey: string;
  date: string;
  time: string;
  reasoning: string;
  partySize: number;
}

export async function pickRestaurant({
  restaurants,
  users,
  context,
  slots,
  partySize,
}: {
  restaurants: Restaurant[];
  users: UserPrefs[];
  context: string;
  slots: Slot[];
  partySize: number;
}): Promise<RestaurantPick> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    max_tokens: 500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `Pick the best restaurant for this group and which time slot to book.

Group preferences: ${JSON.stringify(users, null, 2)}

Recent chat context (use for vibe/cuisine hints): ${context}

Available time slots:
${slots.map((s) => `- ${s.key}: ${s.label} — ${s.date} from ${s.startTime} to ${s.endTime}`).join("\n")}

Available restaurants: ${JSON.stringify(restaurants, null, 2)}

Rules:
- Dietary restrictions are HARD constraints — never pick a place that can't accommodate them
- Cuisine preferences and chat context are soft signals
- Pick the slot with the most restaurant availability

Return ONLY valid JSON:
{
  "restaurantId": "...",
  "slotKey": "sat_evening",
  "date": "Saturday, April 26, 2026",
  "time": "7:00 PM",
  "reasoning": "One short sentence (max 15 words) explaining why this fits the group."
}`,
      },
    ],
  });

  const text = response.choices[0].message.content ?? "";
  const pick = JSON.parse(text);
  const restaurant = restaurants.find((r) => r.id === pick.restaurantId);

  return {
    ...pick,
    restaurant: restaurant ?? restaurants[0],
    partySize,
  };
}

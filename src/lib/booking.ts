import { TinyFish } from "@tiny-fish/sdk";
import type { RestaurantPick } from "./claude";

interface BookingContact {
  booking_name: string;
  booking_phone: string;
  booking_email: string;
}

export interface BookingResult {
  success: boolean;
  confirmation?: string;
  directUrl?: string;
}

export async function bookRestaurant(
  _pick: RestaurantPick,
  _invoker: BookingContact,
): Promise<BookingResult> {
  return {
    success: true,
    confirmation: "AF" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  };
}

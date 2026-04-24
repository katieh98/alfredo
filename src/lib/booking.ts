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
  pick: RestaurantPick,
  invoker: BookingContact,
): Promise<BookingResult> {
  const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });

  try {
    const result = await tf.agent.run({
      url: "https://www.opentable.com",
      goal: `
        Search for "${pick.restaurant.name}" in San Francisco, CA.
        Book a table for ${pick.partySize} people on ${pick.date} at ${pick.time}.
        If that exact time is not available, try 30 minutes earlier or 30 minutes later.
        Name: ${invoker.booking_name}
        Email: ${invoker.booking_email}
        Phone: ${invoker.booking_phone}
        Do NOT proceed if a credit card is required. Return an error instead.
        Return only the confirmation number when complete.
      `,
      browser_profile: "stealth",
    });

    const output = JSON.stringify(result.result ?? "");
    const confirmationMatch = output.match(
      /confirmation[:\s#]*([A-Z0-9-]+)/i,
    );

    return {
      success: result.status === "COMPLETED",
      confirmation: confirmationMatch?.[1] ?? "PENDING",
    };
  } catch {
    return {
      success: false,
      directUrl: pick.restaurant.openTableId
        ? `https://www.opentable.com/r/${pick.restaurant.openTableId}`
        : `https://www.opentable.com/s?term=${encodeURIComponent(pick.restaurant.name)}&covers=${pick.partySize}&dateTime=${encodeURIComponent(pick.date)}`,
    };
  }
}

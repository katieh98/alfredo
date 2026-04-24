import { TinyFish } from "@tiny-fish/sdk";
import type { RestaurantPick } from "./claude";

const TINYFISH_TIMEOUT_MS = 120_000;
const DEMO_PHONE = "+17039156060";

interface BookingContact {
  booking_name: string;
  booking_phone: string;
  booking_email: string;
}

export interface BookingResult {
  success: boolean;
  confirmation?: string;
  directUrl?: string;
  callInitiated?: boolean;
}

async function tryTinyFish(
  pick: RestaurantPick,
  invoker: BookingContact,
): Promise<BookingResult> {
  const tf = new TinyFish({ apiKey: process.env.TINYFISH_API_KEY });

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TinyFish timeout")), TINYFISH_TIMEOUT_MS),
  );

  const result = await Promise.race([
    tf.agent.run({
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
    }),
    timeout,
  ]);

  const output = JSON.stringify(result.result ?? "");
  const confirmationMatch = output.match(/confirmation[:\s#]*([A-Z0-9-]+)/i);

  return {
    success: result.status === "COMPLETED",
    confirmation: confirmationMatch?.[1] ?? "PENDING",
  };
}

async function callViaVapi(pick: RestaurantPick, invoker: BookingContact, demo: boolean): Promise<BookingResult> {
  const vapiKey = process.env.VAPI_API_KEY;
  const vapiPhoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  if (!vapiKey || !vapiPhoneNumberId) {
    return {
      success: false,
      directUrl: `https://www.opentable.com/s?term=${encodeURIComponent(pick.restaurant.name)}&covers=${pick.partySize}`,
    };
  }

  console.log(`[booking] VAPI calling ${DEMO_PHONE} for ${pick.restaurant.name}`);

  const res = await fetch("https://api.vapi.ai/call/phone", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vapiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumberId: vapiPhoneNumberId,
      customer: { number: DEMO_PHONE },
      assistant: {
        firstMessage: `Hi! I'm calling on behalf of ${invoker.booking_name} to make a dinner reservation at ${pick.restaurant.name} for ${pick.partySize} people on ${pick.date} at ${pick.time}. Can you help with that?`,
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant calling ${pick.restaurant.name} in San Francisco to book a table for ${pick.partySize} people on ${pick.date} at ${pick.time}, under the name ${invoker.booking_name} (phone: ${invoker.booking_phone}). If that exact time isn't available, try 30 minutes earlier or later. Once booked, confirm the details and politely end the call.`,
            },
          ],
        },
        voice: { provider: "11labs", voiceId: "paula" },
      },
    }),
  });

  if (!res.ok) {
    console.error("VAPI call failed:", res.status, await res.text());
    return {
      success: false,
      directUrl: `https://www.opentable.com/s?term=${encodeURIComponent(pick.restaurant.name)}&covers=${pick.partySize}`,
    };
  }

  return { success: false, callInitiated: true };
}

export async function bookRestaurant(
  pick: RestaurantPick,
  invoker: BookingContact,
  demo = false,
): Promise<BookingResult> {
  if (!demo) {
    try {
      return await tryTinyFish(pick, invoker);
    } catch {
      console.log("[booking] TinyFish failed or timed out, falling back to VAPI");
    }
  } else {
    console.log("[booking] Demo mode — skipping TinyFish since it takes too long, going straight to VAPI call");
  }

  return callViaVapi(pick, invoker, demo);
}

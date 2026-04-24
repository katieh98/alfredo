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
  vapiCallId?: string;
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

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
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
        serverUrl: `${appUrl}/api/vapi-webhook`,
        firstMessage: `Hi, I'd like to make a reservation for ${pick.partySize} people at ${pick.time} on ${pick.date} under the name ${invoker.booking_name}. Is that possible?`,
        endCallFunctionEnabled: true,
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are calling to book a restaurant reservation. Your only job is:
1. You have already asked for a reservation for ${pick.partySize} people at ${pick.time} on ${pick.date} under ${invoker.booking_name}.
2. If they confirm (say yes, sure, absolutely, confirmed, no problem, etc.) — say exactly: "Perfect, thank you so much! Goodbye!" then end the call.
3. If they say it's not available — say: "No problem, thank you anyway! Goodbye!" then end the call.
4. Do not say anything else. Do not ask any other questions.`,
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

  const data = await res.json();
  return { success: false, callInitiated: true, vapiCallId: data.id };
}

export async function bookRestaurant(
  pick: RestaurantPick,
  invoker: BookingContact,
  demo = false,
): Promise<BookingResult> {
  const skipTinyFish = demo || process.env.SKIP_TINYFISH === "true";

  if (!skipTinyFish) {
    try {
      return await tryTinyFish(pick, invoker);
    } catch {
      console.log("[booking] TinyFish failed or timed out, falling back to VAPI");
    }
  } else {
    console.log("[booking] Skipping TinyFish, going straight to VAPI call");
  }

  return callViaVapi(pick, invoker, demo);
}

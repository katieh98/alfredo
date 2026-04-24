import { type Client, type TextChannel } from "discord.js";
import { getUsersDb, getSessionsDb } from "@/lib/db";
import { computeOverlap } from "@/lib/slots";
import { pickRestaurant, type RestaurantPick } from "@/lib/claude";
import { bookRestaurant, type BookingResult } from "@/lib/booking";

async function querySubgraphs(
  userIds: string[],
  slots: Array<{ date: string; startTime: string; endTime: string }>,
  partySize: number,
) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  console.log("querySubgraphs called, appUrl:", appUrl);

  const usersGql = {
    query: `query Users($ids: [ID!]!) { users(ids: $ids) { discordId dietaryRestrictions cuisinePreferences priceRange bookingName bookingPhone bookingEmail } }`,
    variables: { ids: userIds },
  };

  const restaurantsGql = {
    query: `query Restaurants($near: String!, $partySize: Int!, $availableIn: [TimeSlotInput!]!) { restaurants(near: $near, partySize: $partySize, availableIn: $availableIn) { id name cuisine priceRange rating openTableId availableSlots { date time } enrichment { topDishes vibeSummary transitInfo } } }`,
    variables: { near: "San Francisco, CA", partySize, availableIn: slots },
  };

  const [usersRes, restaurantsRes] = await Promise.all([
    fetch(`${appUrl}/api/subgraph/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usersGql),
    }),
    fetch(`${appUrl}/api/subgraph/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantsGql),
    }),
  ]);

  const [usersJson, restaurantsJson] = await Promise.all([
    usersRes.json(),
    restaurantsRes.json(),
  ]);

  console.log("Users subgraph response:", JSON.stringify(usersJson).slice(0, 500));
  console.log("Restaurants subgraph response:", JSON.stringify(restaurantsJson).slice(0, 500));

  return {
    users: usersJson.data?.users ?? [],
    restaurants: restaurantsJson.data?.restaurants ?? [],
  };
}

async function postResult(
  client: Client,
  channelId: string,
  pick: RestaurantPick,
  booking: BookingResult,
) {
  const channel = (await client.channels.fetch(channelId)) as TextChannel;

  if (booking.success) {
    await channel.send(
      `Booked!\n\n` +
        `${pick.restaurant.name}\n` +
        `${pick.date} - ${pick.time} - ${pick.partySize} people\n` +
        `Confirmation #${booking.confirmation}\n\n` +
        `Why Alfredo picked it:\n${pick.reasoning}`,
    );
  } else {
    await channel.send(
      `${pick.restaurant.name}\n` +
        `${pick.date} - ${pick.time} - ${pick.partySize} people\n\n` +
        `Alfredo found the perfect spot but couldn't grab the reservation automatically.\n` +
        `Book it here: ${booking.directUrl}\n\n` +
        `Why Alfredo picked it:\n${pick.reasoning}`,
    );
  }
}

export async function runAgentPipeline(client: Client, sessionId: string) {
  console.log(`[pipeline] Starting for session ${sessionId}`);
  const sessDb = getSessionsDb();
  const usrDb = getUsersDb();
  if (!sessDb || !usrDb) {
    console.error("[pipeline] Database not configured");
    throw new Error("Database not configured");
  }

  try {

  const [sessionResult, responsesResult] = await Promise.all([
    sessDb.query("SELECT * FROM sessions WHERE id = $1", [sessionId]),
    sessDb.query(
      "SELECT discord_id, slots FROM availability_responses WHERE session_id = $1",
      [sessionId],
    ),
  ]);

  const session = sessionResult.rows[0];
  if (session.status !== "collecting") {
    console.log(`[pipeline] Session ${sessionId} already ${session.status}, skipping`);
    return;
  }

  // Atomic status update to prevent race condition
  const updated = await sessDb.query(
    "UPDATE sessions SET status = 'processing' WHERE id = $1 AND status = 'collecting' RETURNING id",
    [sessionId],
  );
  if (updated.rows.length === 0) {
    console.log(`[pipeline] Lost race for session ${sessionId}, skipping`);
    return;
  }

  const responses = responsesResult.rows.filter(
    (r: { slots: string[] }) => !r.slots.includes("none"),
  );

  const overlappingSlots = computeOverlap(
    responses.length > 0 ? responses : [{ slots: ["sat_evening"] }],
  );

  if (overlappingSlots.length === 0) {
    const channel = (await client.channels.fetch(
      session.channel_id,
    )) as TextChannel;
    await channel.send(
      "Couldn't find a time that works for everyone this weekend.",
    );
    return;
  }

  const taggedUsers: string[] = session.tagged_users;
  const partySize = taggedUsers.length + 1;

  const data = await querySubgraphs(
    taggedUsers,
    overlappingSlots.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    partySize,
  );
  console.log(`[pipeline] Got ${data.restaurants.length} restaurants, ${data.users.length} users`);

  if (data.restaurants.length === 0) {
    const channel = (await client.channels.fetch(session.channel_id)) as TextChannel;
    await channel.send("Couldn't find any restaurants nearby. Try again later.");
    return;
  }

  console.log("[pipeline] Calling OpenAI to pick restaurant...");
  const pick = await pickRestaurant({
    restaurants: data.restaurants,
    users: data.users,
    context: session.context ?? "",
    slots: overlappingSlots,
    partySize,
  });
  console.log(`[pipeline] OpenAI picked: ${pick.restaurant?.name}`);

  const invokerRow = await usrDb.query(
    "SELECT * FROM users WHERE discord_id = $1",
    [session.invoker_id],
  );

  console.log("[pipeline] Attempting TinyFish booking...");
  const booking = await bookRestaurant(pick, invokerRow.rows[0]);
  console.log(`[pipeline] Booking result: success=${booking.success}`);

  await sessDb.query(
    "UPDATE sessions SET status = $1, confirmation = $2 WHERE id = $3",
    [booking.success ? "booked" : "fallback", booking.confirmation ?? null, sessionId],
  );

  await postResult(client, session.channel_id, pick, booking);
    console.log(`[pipeline] Completed for session ${sessionId}`);
  } catch (err) {
    console.error(`[pipeline] Error for session ${sessionId}:`, err);
    try {
      const channel = (await client.channels.fetch(
        (await sessDb.query("SELECT channel_id FROM sessions WHERE id = $1", [sessionId])).rows[0]?.channel_id,
      )) as TextChannel;
      await channel.send("Something went wrong while finding a restaurant. Please try again.");
    } catch {
      // can't even post error to channel
    }
  }
}

import { type Client, type TextChannel } from "discord.js";
import { getUsersDb, getSessionsDb } from "@/lib/db";
import { computeOverlap } from "@/lib/slots";
import { pickRestaurant, type RestaurantPick } from "@/lib/claude";
import { bookRestaurant, type BookingResult } from "@/lib/booking";

async function querySupergraph(
  userIds: string[],
  slots: Array<{ date: string; startTime: string; endTime: string }>,
  partySize: number,
) {
  const routerUrl = process.env.WUNDERGRAPH_ROUTER_URL;
  if (!routerUrl) throw new Error("WUNDERGRAPH_ROUTER_URL not configured");

  const query = `
    query FindRestaurants($userIds: [ID!]!, $near: String!, $partySize: Int!, $availableIn: [TimeSlotInput!]!) {
      users(ids: $userIds) {
        discordId
        dietaryRestrictions
        cuisinePreferences
        priceRange
        bookingName
        bookingPhone
        bookingEmail
      }
      restaurants(near: $near, partySize: $partySize, availableIn: $availableIn) {
        id
        name
        cuisine
        priceRange
        rating
        openTableId
        availableSlots { date time }
        enrichment { topDishes vibeSummary transitInfo }
      }
    }
  `;

  const res = await fetch(routerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        userIds,
        near: "San Francisco, CA",
        partySize,
        availableIn: slots.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      },
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("Supergraph errors:", json.errors);
    throw new Error(`Supergraph query failed: ${json.errors[0].message}`);
  }
  return json.data;
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
  const sessDb = getSessionsDb();
  const usrDb = getUsersDb();
  if (!sessDb || !usrDb)
    throw new Error("Database not configured");

  const [sessionResult, responsesResult] = await Promise.all([
    sessDb.query("SELECT * FROM sessions WHERE id = $1", [sessionId]),
    sessDb.query(
      "SELECT discord_id, slots FROM availability_responses WHERE session_id = $1",
      [sessionId],
    ),
  ]);

  const session = sessionResult.rows[0];
  const responses = responsesResult.rows;

  const overlappingSlots = computeOverlap(responses);

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

  const data = await querySupergraph(
    taggedUsers,
    overlappingSlots.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    partySize,
  );

  const pick = await pickRestaurant({
    restaurants: data.restaurants,
    users: data.users,
    context: session.context ?? "",
    slots: overlappingSlots,
    partySize,
  });

  const invokerRow = await usrDb.query(
    "SELECT * FROM users WHERE discord_id = $1",
    [session.invoker_id],
  );

  const booking = await bookRestaurant(pick, invokerRow.rows[0]);

  await sessDb.query(
    "UPDATE sessions SET status = $1, confirmation = $2 WHERE id = $3",
    [booking.success ? "booked" : "fallback", booking.confirmation ?? null, sessionId],
  );

  await postResult(client, session.channel_id, pick, booking);
}

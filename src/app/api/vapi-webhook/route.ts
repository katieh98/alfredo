import { NextRequest, NextResponse } from "next/server";
import { getSessionsDb } from "@/lib/db";
import { getBotClient } from "@/lib/bot-client";
import type { TextChannel } from "discord.js";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body?.message;

  if (message?.type !== "end-of-call-report") {
    return NextResponse.json({ ok: true });
  }

  const callId = message?.call?.id;
  if (!callId) return NextResponse.json({ ok: true });

  const summary: string = message?.analysis?.summary ?? message?.transcript ?? "";
  console.log(`[vapi-webhook] Call ended: ${callId}, summary: ${summary.slice(0, 200)}`);

  const sessDb = getSessionsDb();
  const botClient = getBotClient();
  if (!sessDb || !botClient) return NextResponse.json({ ok: true });

  const result = await sessDb.query(
    "SELECT id, channel_id FROM sessions WHERE vapi_call_id = $1",
    [callId],
  );
  if (result.rows.length === 0) return NextResponse.json({ ok: true });

  const { id: sessionId, channel_id } = result.rows[0];

  const successKeywords = ["confirmed", "reservation", "booked", "confirmation"];
  const wasBooked = successKeywords.some((kw) => summary.toLowerCase().includes(kw));

  const channel = (await botClient.channels.fetch(channel_id)) as TextChannel;

  if (wasBooked) {
    await channel.send(`🎉 **reservation confirmed!** the call went through and your table is booked.`);
    await sessDb.query("UPDATE sessions SET status = 'booked' WHERE id = $1", [sessionId]);
  } else {
    await channel.send(`📞 the call finished but we couldn't confirm the booking — give them a ring at 703-915-6060 to double check!`);
  }

  return NextResponse.json({ ok: true });
}

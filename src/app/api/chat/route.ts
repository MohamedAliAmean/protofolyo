import { NextResponse } from "next/server";
import {
  getMessagesForSession,
  sendVisitorMessage,
} from "@/lib/chat";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ messages: [], enabled: false });
  }

  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const result = await getMessagesForSession(sessionId);
    return NextResponse.json({ ...result, enabled: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load chat" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as {
      sessionId?: string;
      content?: string;
      name?: string;
      email?: string;
    };

    if (!body.sessionId || !body.content?.trim()) {
      return NextResponse.json(
        { error: "sessionId and content required" },
        { status: 400 },
      );
    }

    const message = await sendVisitorMessage({
      sessionId: body.sessionId,
      content: body.content,
      name: body.name,
      email: body.email,
    });

    return NextResponse.json({ message, enabled: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send message" },
      { status: 500 },
    );
  }
}

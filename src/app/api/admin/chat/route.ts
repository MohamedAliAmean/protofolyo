import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getConversationMessages } from "@/lib/chat";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = new URL(request.url).searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  try {
    const { messages } = await getConversationMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load messages" },
      { status: 500 },
    );
  }
}

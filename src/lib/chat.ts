import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatMessage, Conversation } from "@/lib/chat-types";

export async function getOrCreateConversation(
  sessionId: string,
  name?: string,
  email?: string,
) {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("visitor_session", sessionId)
    .maybeSingle();

  if (existing) {
    if ((name || email) && (!existing.visitor_name || !existing.visitor_email)) {
      await supabase
        .from("conversations")
        .update({
          visitor_name: name ?? existing.visitor_name,
          visitor_email: email ?? existing.visitor_email,
        })
        .eq("id", existing.id);
    }
    return existing as Conversation;
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      visitor_session: sessionId,
      visitor_name: name ?? null,
      visitor_email: email ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Conversation;
}

export async function getMessagesForSession(sessionId: string) {
  const supabase = createAdminClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("visitor_session", sessionId)
    .maybeSingle();

  if (!conversation) {
    return { conversationId: null, messages: [] as ChatMessage[] };
  }

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  return {
    conversationId: conversation.id,
    messages: (messages ?? []) as ChatMessage[],
  };
}

export async function sendVisitorMessage({
  sessionId,
  content,
  name,
  email,
}: {
  sessionId: string;
  content: string;
  name?: string;
  email?: string;
}) {
  const conversation = await getOrCreateConversation(sessionId, name, email);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversation.id,
      sender: "visitor",
      content: content.trim(),
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversation.id);

  return data as ChatMessage;
}

export async function sendAdminMessage(conversationId: string, content: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      sender: "admin",
      content: content.trim(),
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as ChatMessage;
}

export async function listConversations() {
  const supabase = createAdminClient();

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) throw error;

  const results = await Promise.all(
    (conversations ?? []).map(async (conv) => {
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("content, created_at")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const { count } = await supabase
        .from("chat_messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", conv.id);

      return {
        ...conv,
        last_message: messages?.[0]?.content ?? "",
        message_count: count ?? 0,
      };
    }),
  );

  return results;
}

export async function getConversationMessages(conversationId: string) {
  const supabase = createAdminClient();

  const [{ data: conversation }, { data: messages }] = await Promise.all([
    supabase.from("conversations").select("*").eq("id", conversationId).single(),
    supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    conversation: conversation as Conversation,
    messages: (messages ?? []) as ChatMessage[],
  };
}

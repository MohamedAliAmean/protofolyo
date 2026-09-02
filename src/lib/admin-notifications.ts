import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export type AdminNotificationCounts = {
  unreadMessages: number;
  unseenVisitors: number;
};

async function getLastSeenTimestamps() {
  const fallback = new Date(0).toISOString();

  if (!isSupabaseConfigured()) {
    return {
      lastSeenVisitorsAt: fallback,
      lastSeenMessagesAt: fallback,
    };
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_stats")
    .select("last_seen_visitors_at, last_seen_messages_at")
    .eq("id", 1)
    .maybeSingle();

  return {
    lastSeenVisitorsAt: data?.last_seen_visitors_at ?? fallback,
    lastSeenMessagesAt: data?.last_seen_messages_at ?? fallback,
  };
}

export async function getAdminNotificationCounts(): Promise<AdminNotificationCounts> {
  if (!isSupabaseConfigured()) {
    return { unreadMessages: 0, unseenVisitors: 0 };
  }

  const supabase = createAdminClient();
  const { lastSeenVisitorsAt, lastSeenMessagesAt } =
    await getLastSeenTimestamps();

  const [visitorsResult, messagesResult] = await Promise.all([
    supabase
      .from("visitors")
      .select("id", { count: "exact", head: true })
      .gt("visited_at", lastSeenVisitorsAt),
    supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("sender", "visitor")
      .gt("created_at", lastSeenMessagesAt),
  ]);

  return {
    unseenVisitors: visitorsResult.count ?? 0,
    unreadMessages: messagesResult.count ?? 0,
  };
}

export async function markVisitorsSeen() {
  if (!isSupabaseConfigured()) return;

  const supabase = createAdminClient();
  await supabase
    .from("site_stats")
    .update({ last_seen_visitors_at: new Date().toISOString() })
    .eq("id", 1);
}

export async function markMessagesSeen() {
  if (!isSupabaseConfigured()) return;

  const supabase = createAdminClient();
  await supabase
    .from("site_stats")
    .update({ last_seen_messages_at: new Date().toISOString() })
    .eq("id", 1);
}

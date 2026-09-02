import { NextResponse } from "next/server";
import { getAdminNotificationCounts } from "@/lib/admin-notifications";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ unreadMessages: 0, unseenVisitors: 0 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const counts = await getAdminNotificationCounts();
  return NextResponse.json(counts);
}

import { VisitorsTable } from "@/components/admin/VisitorsTable";
import { requireAdmin } from "@/lib/admin-auth";
import { markVisitorsSeen } from "@/lib/admin-notifications";
import { createAdminClient } from "@/lib/supabase/admin";
import type { VisitorRecord } from "@/lib/types";

export default async function AdminVisitorsPage() {
  await requireAdmin();
  await markVisitorsSeen();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("visitors")
    .select("*, visitor_section_times(section, duration_seconds)")
    .order("visited_at", { ascending: false })
    .limit(100);

  const visitors = (data ?? []) as VisitorRecord[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Visitors</h1>
      <p className="mt-2 text-ink-muted">
        Recent visits with IP, approximate location, and time spent on each section.
      </p>

      <VisitorsTable visitors={visitors} />
    </div>
  );
}

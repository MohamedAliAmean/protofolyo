import { MarkAdminSeen } from "@/components/admin/MarkAdminSeen";
import { VisitorsTable } from "@/components/admin/VisitorsTable";
import { requireAdmin } from "@/lib/admin-auth";
import { listVisitorsForAdmin } from "@/lib/visits";
import type { VisitorRecord } from "@/lib/types";

export default async function AdminVisitorsPage() {
  await requireAdmin();
  const visitors = (await listVisitorsForAdmin()) as VisitorRecord[];

  return (
    <div>
      <MarkAdminSeen target="visitors" />
      <h1 className="font-display text-3xl font-bold text-navy-deep">Visitors</h1>
      <p className="mt-2 text-ink-muted">
        Recent visits with IP, approximate location, and time spent on each section.
      </p>

      <VisitorsTable visitors={visitors} />
    </div>
  );
}

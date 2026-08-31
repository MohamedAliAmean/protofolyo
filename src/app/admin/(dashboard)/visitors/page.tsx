import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { VisitorRecord } from "@/lib/types";

export default async function AdminVisitorsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("visitors")
    .select("*")
    .order("visited_at", { ascending: false })
    .limit(100);

  const visitors = (data ?? []) as VisitorRecord[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Visitors</h1>
      <p className="mt-2 text-ink-muted">
        Recent visits with IP and approximate location.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-soft text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">IP</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Region</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No visitors logged yet.
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <tr key={visitor.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">
                    {new Date(visitor.visited_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{visitor.ip}</td>
                  <td className="px-4 py-3">{visitor.country ?? "—"}</td>
                  <td className="px-4 py-3">{visitor.city ?? "—"}</td>
                  <td className="px-4 py-3">{visitor.region ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

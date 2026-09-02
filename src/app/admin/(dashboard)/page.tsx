import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminNotificationCounts } from "@/lib/admin-notifications";
import { createAdminClient } from "@/lib/supabase/admin";
import { getVisitCount } from "@/lib/visits";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const notificationCounts = await getAdminNotificationCounts();

  const [visits, experience, projects, skills, visitors] = await Promise.all([
    getVisitCount(),
    supabase.from("experience").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("skill_groups").select("id", { count: "exact", head: true }),
    supabase.from("visitors").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total visits", value: visits },
    { label: "Experience items", value: experience.count ?? 0 },
    { label: "Projects", value: projects.count ?? 0 },
    { label: "Skill groups", value: skills.count ?? 0 },
    { label: "Visitor logs", value: visitors.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Dashboard</h1>
      <p className="mt-2 text-ink-muted">
        Manage your portfolio content and track visitors.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <p className="text-sm text-ink-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-navy-deep">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/profile" className="surface-card block p-5 hover:-translate-y-0.5">
          Edit About & Profile Image
        </Link>
        <Link href="/admin/messages" className="surface-card block p-5 hover:-translate-y-0.5">
          <span className="flex items-center gap-2">
            View & Reply to Messages
            {notificationCounts.unreadMessages > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white">
                {notificationCounts.unreadMessages > 99
                  ? "99+"
                  : notificationCounts.unreadMessages}
              </span>
            ) : null}
          </span>
        </Link>
        <Link href="/admin/visitors" className="surface-card block p-5 hover:-translate-y-0.5">
          <span className="flex items-center gap-2">
            View Visitors
            {notificationCounts.unseenVisitors > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white">
                {notificationCounts.unseenVisitors > 99
                  ? "99+"
                  : notificationCounts.unseenVisitors}
              </span>
            ) : null}
          </span>
        </Link>
      </div>
    </div>
  );
}

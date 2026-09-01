import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getVisitCount } from "@/lib/visits";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = createAdminClient();

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
          View & Reply to Messages
        </Link>
      </div>
    </div>
  );
}

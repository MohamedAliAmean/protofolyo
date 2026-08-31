import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteExperience, saveExperience } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import type { DbExperience } from "@/lib/types";

export default async function AdminExperiencePage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as DbExperience[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Experience</h1>
      <p className="mt-2 text-ink-muted">Manage where you shipped production systems.</p>

      <div className="mt-8 space-y-8">
        {items.map((item) => (
          <form key={item.id} action={saveExperience} className="surface-card space-y-4 p-5">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Company" name="company" defaultValue={item.company} />
              <AdminField label="Role" name="role" defaultValue={item.role} />
              <AdminField label="Period" name="period" defaultValue={item.period} />
              <AdminField label="Location" name="location" defaultValue={item.location} />
              <AdminField label="Stack" name="stack" defaultValue={item.stack} />
              <AdminField label="Sort order" name="sort_order" defaultValue={String(item.sort_order)} />
            </div>
            <AdminField
              label="Bullet points (one per line)"
              name="points"
              defaultValue={item.points.join("\n")}
              rows={5}
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
                Save
              </button>
              <button
                formAction={deleteExperience.bind(null, item.id)}
                className="rounded-xl border border-red-400/40 px-4 py-2 text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <form action={saveExperience} className="surface-card space-y-4 border-dashed p-5">
          <h2 className="font-display text-lg font-bold text-navy-deep">Add experience</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Company" name="company" />
            <AdminField label="Role" name="role" />
            <AdminField label="Period" name="period" />
            <AdminField label="Location" name="location" />
            <AdminField label="Stack" name="stack" />
            <AdminField label="Sort order" name="sort_order" defaultValue="0" />
          </div>
          <AdminField label="Bullet points (one per line)" name="points" rows={5} />
          <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteSkillGroup, saveSkillGroup } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import type { DbSkillGroup } from "@/lib/types";

export default async function AdminSkillsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("skill_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as DbSkillGroup[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Skills</h1>
      <p className="mt-2 text-ink-muted">Manage tools you use to ship.</p>

      <div className="mt-8 space-y-8">
        {items.map((item) => (
          <form key={item.id} action={saveSkillGroup} className="surface-card space-y-4 p-5">
            <input type="hidden" name="id" value={item.id} />
            <AdminField label="Group title" name="title" defaultValue={item.title} />
            <AdminField
              label="Skills (one per line)"
              name="items"
              defaultValue={item.items.join("\n")}
              rows={6}
            />
            <AdminField label="Sort order" name="sort_order" defaultValue={String(item.sort_order)} />
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
                Save
              </button>
              <button
                formAction={deleteSkillGroup.bind(null, item.id)}
                className="rounded-xl border border-red-400/40 px-4 py-2 text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <form action={saveSkillGroup} className="surface-card space-y-4 border-dashed p-5">
          <h2 className="font-display text-lg font-bold text-navy-deep">Add skill group</h2>
          <AdminField label="Group title" name="title" />
          <AdminField label="Skills (one per line)" name="items" rows={6} />
          <AdminField label="Sort order" name="sort_order" defaultValue="0" />
          <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

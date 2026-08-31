import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteProject, saveProject } from "@/app/admin/actions";
import { AdminField } from "@/components/admin/AdminField";
import type { DbProject } from "@/lib/types";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as DbProject[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">Projects</h1>
      <p className="mt-2 text-ink-muted">Manage selected work worth opening.</p>

      <div className="mt-8 space-y-8">
        {items.map((item) => (
          <form key={item.id} action={saveProject} className="surface-card space-y-4 p-5">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Title" name="title" defaultValue={item.title} />
              <AdminField label="Period" name="period" defaultValue={item.period} />
              <AdminField label="Stack (comma separated)" name="stack" defaultValue={item.stack.join(", ")} />
              <AdminField label="GitHub URL" name="href" defaultValue={item.href ?? ""} />
              <AdminField label="Sort order" name="sort_order" defaultValue={String(item.sort_order)} />
            </div>
            <AdminField label="Description" name="description" defaultValue={item.description} rows={4} />
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
                Save
              </button>
              <button
                formAction={deleteProject.bind(null, item.id)}
                className="rounded-xl border border-red-400/40 px-4 py-2 text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <form action={saveProject} className="surface-card space-y-4 border-dashed p-5">
          <h2 className="font-display text-lg font-bold text-navy-deep">Add project</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title" name="title" />
            <AdminField label="Period" name="period" />
            <AdminField label="Stack (comma separated)" name="stack" />
            <AdminField label="GitHub URL" name="href" />
            <AdminField label="Sort order" name="sort_order" defaultValue="0" />
          </div>
          <AdminField label="Description" name="description" rows={4} />
          <button type="submit" className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-btn-fg">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

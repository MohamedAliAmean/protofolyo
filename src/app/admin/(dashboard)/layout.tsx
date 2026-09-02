import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminNotificationCounts } from "@/lib/admin-notifications";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const notificationCounts = await getAdminNotificationCounts();

  return (
    <div className="min-h-screen bg-bg text-ink md:flex">
      <AdminNav initialCounts={notificationCounts} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}

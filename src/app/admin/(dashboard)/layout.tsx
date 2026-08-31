import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-ink md:flex">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}

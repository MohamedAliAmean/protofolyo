import Link from "next/link";
import { signOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "About & Image" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/visitors", label: "Visitors" },
];

export function AdminNav() {
  return (
    <aside className="border-b border-[var(--line)] bg-[var(--surface)] md:min-h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="p-5">
        <p className="font-display text-lg font-bold text-navy-deep">Admin</p>
        <p className="mt-1 text-xs text-ink-muted">Portfolio CMS</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-2 md:pb-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-bg-soft hover:text-navy-deep"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden border-t border-[var(--line)] p-4 md:block">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-medium text-ink-muted transition hover:border-accent/40"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="mt-2 block text-center text-xs text-accent hover:underline"
        >
          View site
        </Link>
      </div>
    </aside>
  );
}

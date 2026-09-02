"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "@/app/admin/actions";
import type { AdminNotificationCounts } from "@/lib/admin-notifications";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/profile", label: "About & Image" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  {
    href: "/admin/visitors",
    label: "Visitors",
    badgeKey: "unseenVisitors" as const,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    badgeKey: "unreadMessages" as const,
  },
];

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.65rem] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminNavProps = {
  initialCounts: AdminNotificationCounts;
};

export function AdminNav({ initialCounts }: AdminNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState(initialCounts);

  useEffect(() => {
    setCounts(initialCounts);
  }, [initialCounts]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    async function refreshCounts() {
      try {
        const response = await fetch("/api/admin/notifications", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as AdminNotificationCounts;
        setCounts(data);
      } catch {
        // Ignore polling failures
      }
    }

    refreshCounts();
    const interval = window.setInterval(refreshCounts, 15000);
    return () => window.clearInterval(interval);
  }, []);

  function linkClass(href: string, exact?: boolean, mobile = false) {
    const active = isActivePath(pathname, href, exact);

    if (mobile) {
      return active
        ? "flex w-full items-center gap-2 rounded-xl bg-bg-soft px-4 py-3 text-base font-semibold text-navy-deep"
        : "flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition hover:bg-bg-soft hover:text-navy-deep";
    }

    return active
      ? "flex items-center gap-2 rounded-lg bg-bg-soft px-3 py-2 text-sm font-semibold text-navy-deep"
      : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-bg-soft hover:text-navy-deep";
  }

  function getBadgeCount(badgeKey?: keyof AdminNotificationCounts) {
    if (!badgeKey) return 0;
    return counts[badgeKey];
  }

  const navLinks = links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      onClick={() => setOpen(false)}
      className={linkClass(link.href, link.exact)}
    >
      <span>{link.label}</span>
      <NavBadge count={getBadgeCount(link.badgeKey)} />
    </Link>
  ));

  return (
    <>
      <aside className="hidden border-r border-[var(--line)] bg-[var(--surface)] md:flex md:min-h-screen md:w-56 md:flex-col">
        <div className="p-5">
          <p className="font-display text-lg font-bold text-navy-deep">Admin</p>
          <p className="mt-1 text-xs text-ink-muted">Portfolio CMS</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">{navLinks}</nav>

        <div className="border-t border-[var(--line)] p-4">
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

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)] md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-display text-lg font-bold text-navy-deep">Admin</p>
            <p className="text-xs text-ink-muted">Portfolio CMS</p>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)]"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full bg-navy-deep transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-full bg-navy-deep transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full bg-navy-deep transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,320px)] flex-col border-l border-[var(--line)] bg-[var(--surface)] p-4 shadow-2xl md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-lg font-bold text-navy-deep">Menu</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 text-sm text-ink-muted"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(link.href, link.exact, true)}
                  >
                    <span>{link.label}</span>
                    <NavBadge count={getBadgeCount(link.badgeKey)} />
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-[var(--line)] pt-4">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-medium text-ink-muted"
                  >
                    Sign out
                  </button>
                </form>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="mt-3 block text-center text-sm text-accent hover:underline"
                >
                  View site
                </Link>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

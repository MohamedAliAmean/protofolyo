"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, profile } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";

const sectionIds = navLinks.map((link) => link.href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let nextActive = "";
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextActive = id;
          }
        }

        if (window.scrollY < 120) {
          setActiveId("");
          return;
        }

        if (nextActive) setActiveId(nextActive);
      },
      {
        root: null,
        // Account for fixed header + bias toward the section in the upper viewport
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const linkClass = (href: string, mobile = false) => {
    const id = href.slice(1);
    const active = activeId === id;

    if (mobile) {
      return `rounded-xl px-3 py-3 text-base font-medium transition-colors ${
        active
          ? "bg-bg-soft text-accent"
          : "text-navy-deep hover:bg-bg-soft"
      }`;
    }

    return `relative text-[0.92rem] font-medium tracking-[-0.01em] transition-colors ${
      active
        ? "text-accent"
        : "text-ink-muted hover:text-navy-deep"
    }`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-[var(--line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={
        scrolled || open
          ? { backgroundColor: "var(--header-bg)" }
          : undefined
      }
    >
      <div className="section-pad container-max flex h-16 items-center justify-between md:h-[4.5rem]">
        <a
          href="#top"
          className="font-display text-[1.15rem] font-bold text-navy-deep md:text-[1.3rem]"
        >
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "true" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
          <ThemeToggle />
          <a
            href="#contact"
            className="rounded-xl bg-navy px-4 py-2 text-[0.92rem] font-semibold text-btn-fg transition hover:opacity-90"
          >
            Hire me
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)]"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-0.5 w-full bg-navy transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-full bg-navy transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-full bg-navy transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="section-pad border-t border-[var(--line)] pb-6 pt-2 md:hidden"
            style={{ backgroundColor: "var(--header-bg)" }}
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={
                    activeId === link.href.slice(1) ? "true" : undefined
                  }
                  onClick={() => setOpen(false)}
                  className={linkClass(link.href, true)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-navy px-3 py-3 text-center text-base font-semibold text-btn-fg"
              >
                Hire me
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

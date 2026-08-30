import { profile } from "@/data/portfolio";
import { VisitCounter } from "@/components/VisitCounter";

export function Footer() {
  return (
    <footer className="section-pad border-t border-[var(--line)] py-8">
      <div className="container-max flex flex-col gap-3 text-sm font-medium tracking-[-0.01em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.fullName}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <VisitCounter />
          <span>Full Stack Developer · Cairo, Egypt</span>
        </p>
      </div>
    </footer>
  );
}

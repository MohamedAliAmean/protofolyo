"use client";

import { Fragment, useState } from "react";
import { LocalDateTime } from "@/components/admin/LocalDateTime";
import { formatDuration } from "@/lib/format-duration";
import type { VisitorRecord } from "@/lib/types";

const SECTION_ORDER = [
  "top",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
] as const;

const SECTION_LABELS: Record<(typeof SECTION_ORDER)[number], string> = {
  top: "Hero",
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  contact: "Contact",
};

type VisitorsTableProps = {
  visitors: VisitorRecord[];
};

export function VisitorsTable({ visitors }: VisitorsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpanded(visitorId: string) {
    setExpandedId((current) => (current === visitorId ? null : visitorId));
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-bg-soft text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">IP</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Region</th>
            <th className="px-4 py-3 font-medium">Time on site</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                No visitors logged yet.
              </td>
            </tr>
          ) : (
            visitors.map((visitor) => {
              const sectionTimes = visitor.visitor_section_times ?? [];
              const hasBreakdown = sectionTimes.some(
                (entry) => entry.duration_seconds > 0,
              );
              const isExpanded = expandedId === visitor.id;

              return (
                <Fragment key={visitor.id}>
                  <tr className="border-t border-[var(--line)]">
                    <td className="px-4 py-3">
                      <LocalDateTime value={visitor.visited_at} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{visitor.ip}</td>
                    <td className="px-4 py-3">{visitor.country ?? "—"}</td>
                    <td className="px-4 py-3">{visitor.city ?? "—"}</td>
                    <td className="px-4 py-3">{visitor.region ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(visitor.id)}
                        disabled={!hasBreakdown && !visitor.total_time_seconds}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-left font-medium text-accent transition hover:bg-accent/10 disabled:cursor-default disabled:text-ink-muted disabled:hover:bg-transparent"
                        aria-expanded={isExpanded}
                      >
                        <span>{formatDuration(visitor.total_time_seconds)}</span>
                        {(hasBreakdown || visitor.total_time_seconds) ? (
                          <span className="text-xs text-ink-muted">
                            {isExpanded ? "Hide" : "Details"}
                          </span>
                        ) : null}
                      </button>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr className="border-t border-[var(--line)] bg-bg-soft/60">
                      <td colSpan={6} className="px-4 py-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                          Time per section
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {SECTION_ORDER.map((section) => {
                            const entry = sectionTimes.find(
                              (item) => item.section === section,
                            );
                            const seconds = entry?.duration_seconds ?? 0;

                            return (
                              <div
                                key={section}
                                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-bg px-3 py-2"
                              >
                                <span className="text-ink-muted">
                                  {SECTION_LABELS[section]}
                                </span>
                                <span className="font-medium text-navy-deep">
                                  {formatDuration(seconds)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

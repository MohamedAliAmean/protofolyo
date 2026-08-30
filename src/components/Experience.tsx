"use client";

import { experience } from "@/data/portfolio";
import { Reveal, SectionHeading } from "@/components/Reveal";

export function Experience() {
  return (
    <section id="experience" className="section-pad py-20 md:py-28">
      <div className="container-max">
        <SectionHeading
          eyebrow="Experience"
          title="Where I’ve shipped production systems"
          description="Wedding marketplaces, CRM platforms, event registration, and LMS modules — owned end to end."
        />

        <div className="relative space-y-0 border-l border-[var(--line)] pl-6 md:pl-8">
          {experience.map((job, index) => (
            <Reveal key={`${job.company}-${job.period}`} delay={Math.min(index * 0.04, 0.24)}>
              <article className="relative pb-12 last:pb-0">
                <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-[var(--bg-elevated)] md:-left-[2.4rem]" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-display text-[1.3rem] font-bold leading-snug text-navy-deep md:text-[1.55rem]">
                      {job.company}
                    </h3>
                    <p className="mt-1.5 text-[0.98rem] font-semibold tracking-[-0.01em] text-accent">
                      {job.role}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-ink-muted">
                    {job.period} · {job.location}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-ink-muted">{job.stack}</p>
                <ul className="mt-4 space-y-2.5">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-4 text-[0.98rem] leading-[1.7] text-ink-muted before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-sky"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

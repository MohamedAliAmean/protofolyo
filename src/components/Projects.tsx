"use client";

import { Reveal, SectionHeading } from "@/components/Reveal";
import type { ProjectItem } from "@/lib/types";

export function Projects({ items }: { items: ProjectItem[] }) {
  return (
    <section id="projects" className="section-pad py-20 md:py-28">
      <div className="container-max">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work worth opening"
          description="Systems focused on concurrency, roles, APIs, and real production constraints."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((project, index) => (
            <Reveal key={project.title} delay={Math.min(index * 0.06, 0.24)}>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface-card group block h-full p-6 hover:-translate-y-1"
                >
                  <ProjectBody project={project} withLink />
                </a>
              ) : (
                <div className="surface-card group block h-full p-6 hover:-translate-y-1">
                  <ProjectBody project={project} />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectBody({
  project,
  withLink = false,
}: {
  project: ProjectItem;
  withLink?: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[1.25rem] font-bold leading-snug text-navy-deep transition group-hover:text-accent-strong md:text-[1.35rem]">
          {project.title}
        </h3>
        <span className="shrink-0 pt-1 text-xs font-medium text-ink-muted">
          {project.period}
        </span>
      </div>
      <p className="mt-3 text-[0.98rem] leading-[1.7] text-ink-muted">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-lg bg-bg-soft px-2.5 py-1 text-xs font-semibold tracking-[-0.01em] text-navy"
          >
            {tech}
          </span>
        ))}
      </div>
      {withLink ? (
        <p className="mt-5 text-sm font-semibold text-accent">
          View on GitHub →
        </p>
      ) : null}
    </>
  );
}

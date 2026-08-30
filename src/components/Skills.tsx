"use client";

import { skillGroups } from "@/data/portfolio";
import { Reveal, SectionHeading } from "@/components/Reveal";

export function Skills() {
  return (
    <section id="skills" className="section-pad py-20 md:py-28">
      <div className="container-max">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I use to ship"
          description="From Laravel and Node APIs to Angular UIs, Firebase, and Dockerized services."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.06}>
              <h3 className="font-display text-[1.15rem] font-bold text-navy-deep">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-[var(--line)] pb-2.5 text-[0.95rem] font-medium tracking-[-0.01em] text-ink-muted last:border-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

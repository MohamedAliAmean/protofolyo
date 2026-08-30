"use client";

import { profile } from "@/data/portfolio";
import { Reveal, SectionHeading } from "@/components/Reveal";

export function About() {
  return (
    <section id="about" className="section-pad py-20 md:py-28">
      <div className="container-max">
        <SectionHeading
          eyebrow="About"
          title="Production-minded full stack work"
          description={profile.summary}
        />

        <div className="grid gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-2">
          {profile.education.map((item, i) => (
            <Reveal key={item.school} delay={i * 0.08}>
              <p className="eyebrow text-[0.7rem] text-gold">Education</p>
              <h3 className="mt-3 font-display text-[1.25rem] font-bold leading-snug text-navy-deep md:text-[1.35rem]">
                {item.school}
              </h3>
              <p className="mt-2 text-[0.98rem] leading-[1.7] text-ink-muted">
                {item.detail}
              </p>
              <p className="mt-1 text-sm font-medium text-ink-muted/80">
                {item.period}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

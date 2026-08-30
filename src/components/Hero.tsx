"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

export function Hero() {
  return (
    <section
      id="top"
      className="section-pad relative min-h-[100svh] pb-16 pt-28 md:pb-24 md:pt-32"
    >
      <div className="container-max grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="eyebrow mb-5">{profile.title}</p>
          <h1 className="font-display text-[clamp(2.85rem,7.2vw,5rem)] font-bold leading-[0.92] text-navy-deep">
            {profile.name}
          </h1>
          <p className="mt-4 font-display text-[clamp(1.15rem,2.4vw,1.55rem)] font-medium leading-snug text-navy">
            {profile.stackLine}
          </p>
          <p className="lead mt-6 max-w-md">{profile.shortPitch}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-xl bg-navy px-5 py-3 text-[0.95rem] font-semibold tracking-[-0.01em] text-btn-fg transition hover:opacity-90"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-[0.95rem] font-semibold tracking-[-0.01em] text-navy transition hover:border-accent/40"
            >
              Contact me
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-medium text-ink-muted">
            <span>{profile.location}</span>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="photo-frame float-soft mx-auto w-full max-w-[420px] lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-navy-deep shadow-[var(--shadow)]">
            <Image
              src="/profile.jpeg"
              alt={`${profile.fullName} — Full Stack Developer`}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover object-[50%_18%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

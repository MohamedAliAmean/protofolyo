"use client";

import { StarField } from "@/components/StarField";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="bg-base-gradient absolute inset-0 transition-[background] duration-300" />
      <div className="mesh-orb mesh-orb--one -left-[8%] top-[-6%]" />
      <div className="mesh-orb mesh-orb--two right-[-10%] top-[18%]" />
      <div className="mesh-orb mesh-orb--three bottom-[4%] left-[28%]" />
      <StarField />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
    </div>
  );
}

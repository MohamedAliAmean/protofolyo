"use client";

import { useEffect, useRef } from "react";

import { VISITOR_ID_KEY } from "@/components/VisitTracker";

const SECTIONS = [
  "top",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
] as const;

const FLUSH_INTERVAL_MS = 5000;
const TICK_INTERVAL_MS = 500;

type SectionId = (typeof SECTIONS)[number];

function getVisitorId() {
  return sessionStorage.getItem(VISITOR_ID_KEY);
}

function snapshotDurations(
  durations: Record<SectionId, number>,
  activeSection: SectionId | null,
  activeSince: number | null,
) {
  const next = { ...durations };

  if (activeSection && activeSince) {
    const elapsed = (Date.now() - activeSince) / 1000;
    next[activeSection] = (next[activeSection] ?? 0) + elapsed;
  }

  return next;
}

function resolveActiveSection(): SectionId | null {
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const focusLine = viewportHeight * 0.38;

  for (const section of SECTIONS) {
    const element = document.getElementById(section);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (rect.top <= focusLine && rect.bottom >= focusLine) {
      return section;
    }
  }

  let bestSection: SectionId | null = null;
  let bestVisible = 0;

  for (const section of SECTIONS) {
    const element = document.getElementById(section);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const visibleHeight =
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

    if (visibleHeight > bestVisible) {
      bestVisible = visibleHeight;
      bestSection = section;
    }
  }

  return bestVisible >= 120 ? bestSection : null;
}

async function sendEngagement(
  visitorId: string,
  sections: Record<SectionId, number>,
) {
  const totalSeconds = Object.values(sections).reduce(
    (sum, value) => sum + value,
    0,
  );

  if (totalSeconds < 1) return;

  const payload = JSON.stringify({
    visitorId,
    sections,
    totalSeconds: Math.round(totalSeconds),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/visits/engagement", blob);
      return;
    }

    await fetch("/api/visits/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Ignore tracking failures silently
  }
}

export function SectionTimeTracker() {
  const durationsRef = useRef<Record<SectionId, number>>({
    top: 0,
    about: 0,
    experience: 0,
    projects: 0,
    skills: 0,
    contact: 0,
  });
  const activeSectionRef = useRef<SectionId | null>(null);
  const activeSinceRef = useRef<number | null>(null);
  const hasVisitorIdRef = useRef(false);

  useEffect(() => {
    const hasSections = SECTIONS.some(
      (section) => document.getElementById(section) instanceof HTMLElement,
    );

    if (!hasSections) return;

    function setActiveSection(section: SectionId | null) {
      if (activeSectionRef.current === section) return;

      const now = Date.now();
      if (activeSectionRef.current && activeSinceRef.current) {
        const elapsed = (now - activeSinceRef.current) / 1000;
        durationsRef.current[activeSectionRef.current] =
          (durationsRef.current[activeSectionRef.current] ?? 0) + elapsed;
      }

      activeSectionRef.current = section;
      activeSinceRef.current = section ? now : null;
    }

    function flush(useBeacon = false) {
      const visitorId = getVisitorId();
      if (!visitorId) return;

      hasVisitorIdRef.current = true;

      const sections = snapshotDurations(
        durationsRef.current,
        activeSectionRef.current,
        activeSinceRef.current,
      );

      durationsRef.current = sections;
      if (activeSectionRef.current) {
        activeSinceRef.current = Date.now();
      }

      void sendEngagement(visitorId, sections);
    }

    function tickActiveSection() {
      setActiveSection(resolveActiveSection());
    }

    let scrollTimer: number | null = null;

    function handleScroll() {
      if (scrollTimer !== null) return;
      scrollTimer = window.setTimeout(() => {
        scrollTimer = null;
        tickActiveSection();
      }, 150);
    }

    tickActiveSection();

    const tickId = window.setInterval(tickActiveSection, TICK_INTERVAL_MS);
    const flushId = window.setInterval(() => flush(false), FLUSH_INTERVAL_MS);
    const visitorIdPollId = window.setInterval(() => {
      if (!hasVisitorIdRef.current && getVisitorId()) {
        flush(false);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", tickActiveSection);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        tickActiveSection();
        flush(true);
      }
    }

    function handlePageHide() {
      tickActiveSection();
      flush(true);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.clearInterval(tickId);
      window.clearInterval(flushId);
      window.clearInterval(visitorIdPollId);
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", tickActiveSection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      tickActiveSection();
      flush(true);
    };
  }, []);

  return null;
}

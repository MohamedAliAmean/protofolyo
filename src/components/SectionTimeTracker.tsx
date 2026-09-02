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

  useEffect(() => {
    const elements = SECTIONS.map((section) => ({
      section,
      element: document.getElementById(section),
    })).filter(
      (entry): entry is { section: SectionId; element: HTMLElement } =>
        entry.element instanceof HTMLElement,
    );

    if (elements.length === 0) return;

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

      const sections = snapshotDurations(
        durationsRef.current,
        activeSectionRef.current,
        activeSinceRef.current,
      );

      durationsRef.current = sections;
      if (activeSectionRef.current) {
        activeSinceRef.current = Date.now();
      }

      if (useBeacon) {
        void sendEngagement(visitorId, sections);
        return;
      }

      void sendEngagement(visitorId, sections);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        setActiveSection((visible[0]?.target.id as SectionId | undefined) ?? null);
      },
      { threshold: [0.5] },
    );

    for (const { element } of elements) {
      observer.observe(element);
    }

    const initiallyVisible = elements
      .map(({ section, element }) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight =
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const ratio = visibleHeight / Math.max(rect.height, 1);
        return { section, ratio };
      })
      .filter((entry) => entry.ratio >= 0.5)
      .sort((a, b) => b.ratio - a.ratio);

    setActiveSection(initiallyVisible[0]?.section ?? null);

    const intervalId = window.setInterval(() => flush(false), 20000);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flush(true);
      }
    }

    function handlePageHide() {
      flush(true);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      flush(true);
    };
  }, []);

  return null;
}

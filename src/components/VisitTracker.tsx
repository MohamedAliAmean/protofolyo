"use client";

import { useEffect } from "react";

const SESSION_KEY = "md-portfolio-visit-counted";
export const VISITOR_ID_KEY = "md-portfolio-visitor-id";

export function VisitTracker() {
  useEffect(() => {
    let cancelled = false;
    let started = false;

    async function trackVisit() {
      if (cancelled || started) return;
      started = true;

      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

        const response = await fetch("/api/visits", {
          method: alreadyCounted ? "GET" : "POST",
          cache: "no-store",
        });
        const data = (await response.json()) as {
          visitorId?: string | null;
          skipped?: boolean;
        };

        if (data.visitorId) {
          sessionStorage.setItem(VISITOR_ID_KEY, data.visitorId);
        }

        if (!alreadyCounted && !data.skipped) {
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        // Ignore tracking failures silently
      } finally {
        cleanup();
      }
    }

    function onHumanSignal() {
      void trackVisit();
    }

    function cleanup() {
      window.removeEventListener("pointerdown", onHumanSignal);
      window.removeEventListener("keydown", onHumanSignal);
      window.removeEventListener("scroll", onHumanSignal, true);
      window.removeEventListener("touchstart", onHumanSignal);
    }

    // Don't count until there is a real human signal (filters many bots).
    window.addEventListener("pointerdown", onHumanSignal, { once: true });
    window.addEventListener("keydown", onHumanSignal, { once: true });
    window.addEventListener("scroll", onHumanSignal, { once: true, capture: true });
    window.addEventListener("touchstart", onHumanSignal, { once: true });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}

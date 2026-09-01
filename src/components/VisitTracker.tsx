"use client";

import { useEffect } from "react";

const SESSION_KEY = "md-portfolio-visit-counted";

export function VisitTracker() {
  useEffect(() => {
    async function trackVisit() {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

        await fetch("/api/visits", {
          method: alreadyCounted ? "GET" : "POST",
          cache: "no-store",
        });

        if (!alreadyCounted) {
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        // Ignore tracking failures silently
      }
    }

    trackVisit();
  }, []);

  return null;
}

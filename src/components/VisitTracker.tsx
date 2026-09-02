"use client";

import { useEffect } from "react";

const SESSION_KEY = "md-portfolio-visit-counted";
export const VISITOR_ID_KEY = "md-portfolio-visitor-id";

export function VisitTracker() {
  useEffect(() => {
    async function trackVisit() {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

        const response = await fetch("/api/visits", {
          method: alreadyCounted ? "GET" : "POST",
          cache: "no-store",
        });
        const data = (await response.json()) as {
          visitorId?: string | null;
        };

        if (data.visitorId) {
          sessionStorage.setItem(VISITOR_ID_KEY, data.visitorId);
        }

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

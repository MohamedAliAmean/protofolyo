"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "md-portfolio-visit-counted";

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function trackVisit() {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

        const response = await fetch("/api/visits", {
          method: alreadyCounted ? "GET" : "POST",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          count: number;
          enabled: boolean;
        };

        if (!cancelled && data.enabled) {
          setCount(data.count);
          if (!alreadyCounted) {
            sessionStorage.setItem(SESSION_KEY, "1");
          }
        }
      } catch {
        // Ignore counter failures silently
      }
    }

    trackVisit();

    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <span aria-hidden className="text-accent">
        •
      </span>
      <span>{count.toLocaleString()} visits</span>
    </span>
  );
}

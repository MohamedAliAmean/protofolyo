"use client";

import { useEffect, useState } from "react";

type LocalDateTimeProps = {
  value: string;
  className?: string;
};

export function LocalDateTime({ value, className }: LocalDateTimeProps) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(
      new Date(value).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "medium",
      }),
    );
  }, [value]);

  return <span className={className}>{formatted || "—"}</span>;
}

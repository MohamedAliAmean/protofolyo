"use client";

import { useEffect } from "react";
import {
  markMessagesSeenAction,
  markVisitorsSeenAction,
} from "@/app/admin/actions";

type MarkAdminSeenProps = {
  target: "visitors" | "messages";
};

export function MarkAdminSeen({ target }: MarkAdminSeenProps) {
  useEffect(() => {
    if (target === "visitors") {
      void markVisitorsSeenAction();
      return;
    }

    void markMessagesSeenAction();
  }, [target]);

  return null;
}

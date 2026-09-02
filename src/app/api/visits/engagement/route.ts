import { NextResponse } from "next/server";
import {
  isVisitTrackingEnabled,
  updateVisitorEngagement,
  type VisitorEngagementPayload,
} from "@/lib/visits";

function isValidPayload(body: unknown): body is VisitorEngagementPayload {
  if (!body || typeof body !== "object") return false;

  const payload = body as VisitorEngagementPayload;
  return (
    typeof payload.visitorId === "string" &&
    payload.visitorId.length > 0 &&
    typeof payload.sections === "object" &&
    payload.sections !== null &&
    typeof payload.totalSeconds === "number"
  );
}

export async function POST(request: Request) {
  if (!isVisitTrackingEnabled()) {
    return NextResponse.json({ ok: false, enabled: false }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const ok = await updateVisitorEngagement(body);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

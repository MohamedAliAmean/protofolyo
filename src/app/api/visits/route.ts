import { NextResponse } from "next/server";
import {
  getVisitCount,
  isVisitTrackingEnabled,
  trackVisit,
} from "@/lib/visits";

export async function GET() {
  if (!isVisitTrackingEnabled()) {
    return NextResponse.json({ count: 0, enabled: false });
  }

  const count = await getVisitCount();
  return NextResponse.json({ count, enabled: true });
}

export async function POST(request: Request) {
  if (!isVisitTrackingEnabled()) {
    return NextResponse.json({ count: 0, enabled: false });
  }

  const count = await trackVisit(request);
  return NextResponse.json({ count, enabled: true });
}

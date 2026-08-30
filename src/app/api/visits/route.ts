import { NextResponse } from "next/server";
import {
  getVisitCount,
  incrementVisitCount,
  isVisitTrackingEnabled,
} from "@/lib/visits";

export async function GET() {
  if (!isVisitTrackingEnabled()) {
    return NextResponse.json({ count: 0, enabled: false });
  }

  const count = await getVisitCount();
  return NextResponse.json({ count, enabled: true });
}

export async function POST() {
  if (!isVisitTrackingEnabled()) {
    return NextResponse.json({ count: 0, enabled: false });
  }

  const count = await incrementVisitCount();
  return NextResponse.json({ count, enabled: true });
}

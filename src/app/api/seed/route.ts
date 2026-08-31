import { NextResponse } from "next/server";
import { seedPortfolioData } from "@/lib/portfolio-data";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const result = await seedPortfolioData();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 },
    );
  }
}

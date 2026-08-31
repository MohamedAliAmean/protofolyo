import { NextResponse } from "next/server";
import { seedPortfolioData } from "@/lib/portfolio-data";
import {
  getSupabaseConfigStatus,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

async function runSeed() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase not configured on Vercel",
        missing: getSupabaseConfigStatus(),
        hint: "Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environments → Environment Variables, then Redeploy.",
      },
      { status: 500 },
    );
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

export async function GET() {
  return runSeed();
}

export async function POST() {
  return runSeed();
}

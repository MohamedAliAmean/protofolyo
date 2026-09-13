import { shouldSkipVisitTracking } from "@/lib/bot-filter";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

type GeoData = {
  country: string | null;
  city: string | null;
  region: string | null;
  org: string | null;
  isHosting: boolean;
  isProxy: boolean;
};

const DEDUPE_WINDOW_MINUTES = 60;

async function geolocateIp(ip: string): Promise<GeoData> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return {
      country: "Local",
      city: "Localhost",
      region: null,
      org: null,
      isHosting: false,
      isProxy: false,
    };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,org,proxy,hosting`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (data.status !== "success") {
      return {
        country: null,
        city: null,
        region: null,
        org: null,
        isHosting: false,
        isProxy: false,
      };
    }
    return {
      country: data.country ?? null,
      city: data.city ?? null,
      region: data.regionName ?? null,
      org: data.org ?? null,
      isHosting: Boolean(data.hosting),
      isProxy: Boolean(data.proxy),
    };
  } catch {
    return {
      country: null,
      city: null,
      region: null,
      org: null,
      isHosting: false,
      isProxy: false,
    };
  }
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function getVisitCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_stats")
    .select("total_visits")
    .eq("id", 1)
    .maybeSingle();

  return data?.total_visits ?? 0;
}

const TRACKED_SECTIONS = [
  "top",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
] as const;

export type TrackVisitResult = {
  count: number;
  visitorId: string | null;
};

export type VisitorEngagementPayload = {
  visitorId: string;
  sections: Record<string, number>;
  totalSeconds: number;
};

export async function trackVisit(request: Request): Promise<TrackVisitResult> {
  if (!isSupabaseConfigured()) return { count: 0, visitorId: null };

  const supabase = createAdminClient();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  const geo = await geolocateIp(ip);

  if (
    shouldSkipVisitTracking({
      userAgent,
      ip,
      city: geo.city,
      org: geo.org,
      isHosting: geo.isHosting,
      isProxy: geo.isProxy,
    })
  ) {
    const count = await getVisitCount();
    return { count, visitorId: null };
  }

  // Avoid spam rows from the same IP within a short window
  const since = new Date(
    Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { data: recent } = await supabase
    .from("visitors")
    .select("id")
    .eq("ip", ip)
    .gte("visited_at", since)
    .order("visited_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent?.id) {
    const count = await getVisitCount();
    return { count, visitorId: recent.id };
  }

  const { data: inserted } = await supabase
    .from("visitors")
    .insert({
      ip,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  const current = await getVisitCount();
  const next = current + 1;

  await supabase
    .from("site_stats")
    .update({ total_visits: next })
    .eq("id", 1);

  return { count: next, visitorId: inserted?.id ?? null };
}

export async function updateVisitorEngagement(
  payload: VisitorEngagementPayload,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createAdminClient();
  const sections = Object.fromEntries(
    Object.entries(payload.sections).filter(([section, seconds]) => {
      return (
        TRACKED_SECTIONS.includes(
          section as (typeof TRACKED_SECTIONS)[number],
        ) && Number.isFinite(seconds)
      );
    }),
  );

  const totalSeconds = Math.max(
    0,
    Math.round(
      Number.isFinite(payload.totalSeconds)
        ? payload.totalSeconds
        : Object.values(sections).reduce((sum, value) => sum + value, 0),
    ),
  );

  const { error: visitorError } = await supabase
    .from("visitors")
    .update({ total_time_seconds: totalSeconds })
    .eq("id", payload.visitorId);

  if (visitorError) return false;

  const rows = Object.entries(sections).map(([section, duration_seconds]) => ({
    visitor_id: payload.visitorId,
    section,
    duration_seconds: Math.max(0, Math.round(duration_seconds)),
  }));

  if (rows.length === 0) return true;

  const { error: sectionError } = await supabase
    .from("visitor_section_times")
    .upsert(rows, { onConflict: "visitor_id,section" });

  return !sectionError;
}

export function isVisitTrackingEnabled() {
  return isSupabaseConfigured();
}

export async function listVisitorsForAdmin(limit = 100) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const withSections = await supabase
    .from("visitors")
    .select("*, visitor_section_times(section, duration_seconds)")
    .order("visited_at", { ascending: false })
    .limit(limit);

  if (!withSections.error) {
    return withSections.data ?? [];
  }

  const basic = await supabase
    .from("visitors")
    .select("*")
    .order("visited_at", { ascending: false })
    .limit(limit);

  return basic.data ?? [];
}

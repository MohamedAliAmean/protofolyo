import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

type GeoData = {
  country: string | null;
  city: string | null;
  region: string | null;
};

async function geolocateIp(ip: string): Promise<GeoData> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return { country: "Local", city: "Localhost", region: null };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (data.status !== "success") {
      return { country: null, city: null, region: null };
    }
    return {
      country: data.country ?? null,
      city: data.city ?? null,
      region: data.regionName ?? null,
    };
  } catch {
    return { country: null, city: null, region: null };
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

export async function trackVisit(request: Request): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = createAdminClient();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  const geo = await geolocateIp(ip);

  await supabase.from("visitors").insert({
    ip,
    country: geo.country,
    city: geo.city,
    region: geo.region,
    user_agent: userAgent,
  });

  const current = await getVisitCount();
  const next = current + 1;

  await supabase
    .from("site_stats")
    .update({ total_visits: next })
    .eq("id", 1);

  return next;
}

export function isVisitTrackingEnabled() {
  return isSupabaseConfigured();
}

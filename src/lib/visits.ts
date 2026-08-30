const VISITS_KEY = "portfolio:visits";

type UpstashResponse = {
  result?: number;
  error?: string;
};

async function upstash(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as UpstashResponse;
  return typeof data.result === "number" ? data.result : null;
}

export async function getVisitCount(): Promise<number> {
  const count = await upstash(["GET", VISITS_KEY]);
  return count ?? 0;
}

export async function incrementVisitCount(): Promise<number> {
  const count = await upstash(["INCR", VISITS_KEY]);
  return count ?? 0;
}

export function isVisitTrackingEnabled() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

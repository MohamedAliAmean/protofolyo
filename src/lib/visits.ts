import { Redis } from "@upstash/redis";

const VISITS_KEY = "portfolio:visits";

function getRedis() {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

export async function getVisitCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;

  const count = await redis.get<number>(VISITS_KEY);
  return count ?? 0;
}

export async function incrementVisitCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;

  return redis.incr(VISITS_KEY);
}

export function isVisitTrackingEnabled() {
  return Boolean(getRedis());
}

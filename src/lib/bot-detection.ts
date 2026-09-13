const BOT_UA_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /bingpreview/i,
  /facebookexternalhit/i,
  /embedly/i,
  /quora link preview/i,
  /whatsapp/i,
  /telegram/i,
  /discordbot/i,
  /linkedinbot/i,
  /twitterbot/i,
  /applebot/i,
  /yandex/i,
  /baidu/i,
  /duckduckbot/i,
  /semrush/i,
  /ahrefs/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /claudebot/i,
  /anthropic/i,
  /chatgpt/i,
  /headless/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /httpclient/i,
  /python-requests/i,
  /go-http-client/i,
  /curl\//i,
  /wget\//i,
  /libwww/i,
  /scrapy/i,
  /node-fetch/i,
  /axios\//i,
  /vercel-screenshot/i,
  /lighthouse/i,
  /chrome-lighthouse/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /monitor/i,
];

/** Datacenter locations that almost always mean cloud bots on this site. */
const BOT_CITIES = new Set([
  "boydton", // Microsoft Azure health checks / crawlers
]);

export function isBotUserAgent(userAgent: string | null | undefined) {
  if (!userAgent || userAgent.trim().length < 12) return true;
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function isBotGeo(geo: {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}) {
  const city = geo.city?.trim().toLowerCase() ?? "";
  return Boolean(city && BOT_CITIES.has(city));
}

export function isLikelyBotRequest(
  request: Request,
  geo?: { city?: string | null; region?: string | null; country?: string | null },
) {
  const userAgent = request.headers.get("user-agent");
  if (isBotUserAgent(userAgent)) return true;

  // Real browsers usually send Accept-Language.
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return true;

  if (geo && isBotGeo(geo)) return true;

  return false;
}

type BotCheckInput = {
  userAgent: string | null;
  ip: string;
  city?: string | null;
  org?: string | null;
  isHosting?: boolean;
  isProxy?: boolean;
};

const BOT_UA_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /httpclient/i,
  /go-http-client/i,
  /java\//i,
  /libwww/i,
  /scrapy/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /selenium/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /vercel-screenshot/i,
  /vercel-favicon/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /preview/i,
  /monitor/i,
  /health.?check/i,
  /bytespider/i,
  /semrush/i,
  /ahrefs/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /yandexbot/i,
  /bingbot/i,
  /googlebot/i,
  /applebot/i,
  /duckduckbot/i,
];

const DATACENTER_CITY_HINTS = [
  "boydton",
  "ashburn",
  "sterling",
  "des moines",
  "council bluffs",
  "the dalles",
  "quincy",
  "boardman",
];

const DATACENTER_ORG_HINTS = [
  "microsoft",
  "azure",
  "amazon",
  "aws",
  "google",
  "gcp",
  "digitalocean",
  "ovh",
  "hetzner",
  "linode",
  "vultr",
  "cloudflare",
  "oracle cloud",
  "alibaba",
];

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim().length < 12) return true;
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function isLikelyDatacenterBot(input: BotCheckInput): boolean {
  if (isBotUserAgent(input.userAgent)) return true;

  const city = (input.city ?? "").toLowerCase();
  const org = (input.org ?? "").toLowerCase();

  const cityHit = DATACENTER_CITY_HINTS.some((hint) => city.includes(hint));
  const orgHit = DATACENTER_ORG_HINTS.some((hint) => org.includes(hint));

  // Cloud/VPS ranges (Azure Boydton, AWS, etc.)
  if (input.isHosting && (cityHit || orgHit)) return true;
  if (input.isProxy && (cityHit || orgHit)) return true;

  return false;
}

export function shouldSkipVisitTracking(input: BotCheckInput): boolean {
  return isLikelyDatacenterBot(input);
}

export const ATTR_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'av_campinas_attr';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_KEYS = ['gclid', 'fbclid', 'gbraid', 'wbraid'] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type ClickKey = (typeof CLICK_KEYS)[number];

export type Attribution = {
  first_seen: number;
  expires: number;
  traffic_source: string;
} & Partial<Record<UtmKey | ClickKey, string>>;

export function attributionFromUrl(url: URL, referrer: string, now: number): Attribution {
  const attr: Attribution = {
    first_seen: now,
    expires: now + ATTR_TTL_MS,
    traffic_source: 'direct',
  };
  for (const key of UTM_KEYS) {
    const value = cleanUtm(url.searchParams.get(key));
    if (value) attr[key] = value;
  }
  for (const key of CLICK_KEYS) {
    const value = cleanClickId(url.searchParams.get(key));
    if (value) attr[key] = value;
  }
  attr.traffic_source = deriveSource(attr, referrer);
  return attr;
}

export function hasCampaign(attr: Attribution): boolean {
  return UTM_KEYS.some((key) => Boolean(attr[key])) || CLICK_KEYS.some((key) => Boolean(attr[key]));
}

/** Primeira visita vale até expirar. Um acesso direto anterior absorve o clique pago que chegar depois. */
export function mergeAttribution(prev: Attribution | null, incoming: Attribution, now: number): Attribution {
  if (!prev || prev.expires <= now) return incoming;
  if (!hasCampaign(prev) && hasCampaign(incoming)) {
    return { ...incoming, first_seen: prev.first_seen, expires: prev.expires };
  }
  return prev;
}

export function attributionParams(attr: Attribution): Record<string, string> {
  const out: Record<string, string> = { traffic_source: attr.traffic_source };
  for (const key of [...UTM_KEYS, ...CLICK_KEYS]) {
    const value = attr[key];
    if (value) out[key] = value;
  }
  return out;
}

export function loadAndCapture(input: {
  stored: string | null;
  url: string;
  referrer: string;
  now: number;
}): { attr: Attribution; serialized: string } {
  const incoming = attributionFromUrl(new URL(input.url), input.referrer, input.now);
  const prev = parseStored(input.stored);
  const attr = mergeAttribution(prev, incoming, input.now);
  return { attr, serialized: JSON.stringify(attr) };
}

export const ATTRIBUTION_STORAGE_KEY = STORAGE_KEY;

function parseStored(raw: string | null): Attribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed || typeof parsed.expires !== 'number' || typeof parsed.traffic_source !== 'string') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function deriveSource(attr: Attribution, referrer: string): string {
  if (attr.gclid || attr.gbraid || attr.wbraid) return 'google_ads';
  if (attr.fbclid) return 'meta';
  if (attr.utm_source) return attr.utm_source.slice(0, 40);
  const host = referrerHost(referrer);
  if (!host) return 'direct';
  if (/google\.|bing\.|yahoo\.|duckduckgo\./i.test(host)) return 'organic';
  if (/facebook\.|instagram\.|fb\.me|^fb\.com$/i.test(host)) return 'meta';
  return 'referral';
}

function referrerHost(referrer: string): string {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function cleanUtm(value: string | null): string {
  if (!value) return '';
  const trimmed = value.trim().slice(0, 80);
  if (!trimmed || /@/.test(trimmed) || looksLikePhone(trimmed)) return '';
  if (!/^[\p{L}\p{N} ._|:/-]+$/u.test(trimmed)) return '';
  return trimmed;
}

function cleanClickId(value: string | null): string {
  if (!value) return '';
  const trimmed = value.trim();
  return /^[A-Za-z0-9._~-]{1,200}$/.test(trimmed) ? trimmed : '';
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

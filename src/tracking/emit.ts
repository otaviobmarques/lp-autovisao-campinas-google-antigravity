import { attributionParams, type Attribution } from './attribution';
import { EVENTS, safeEventName } from './events';
import { interestFields } from './interest';
import { trackingIds } from './runtimeIds';
import { sanitizeParams } from './sanitize';

export type MetaCall = {
  method: 'track' | 'trackCustom';
  name: string;
  params?: Record<string, unknown>;
};

type EmitExtra = {
  meta?: MetaCall[];
  userProperties?: Record<string, string>;
  interestList?: string[];
};

export function emit(
  eventName: string,
  params: Record<string, unknown>,
  extra: EmitExtra = {},
  deps: {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    gadsId?: string;
    attribution?: Attribution;
    interest?: string[];
  } = {}
): Record<string, unknown> {
  const name = safeEventName(eventName);
  const interest = deps.interest ?? readInterestSafe();
  const attribution = deps.attribution ?? readAttributionSafe();
  const safe = sanitizeParams({
    page_path: typeof location === 'undefined' ? '/' : location.pathname,
    ...attributionParams(attribution),
    ...interestFields(interest),
    ...params,
  });

  const payload: Record<string, unknown> = { event: name, av_source: 'app', ...safe };
  const list = extra.interestList ?? interest;
  if (list.length) payload.interest_services_list = list;
  const last = list[list.length - 1];
  if (last || extra.userProperties) {
    payload.user_properties = {
      ...(last ? { interest_last: last } : {}),
      ...extra.userProperties,
    };
  }

  try {
    const layer = deps.dataLayer ?? (window.dataLayer = window.dataLayer || []);
    layer.push(payload);
  } catch {
    // dataLayer indisponível
  }

  try {
    const fbq = deps.fbq ?? window.fbq;
    if (typeof fbq === 'function') {
      for (const call of extra.meta ?? []) {
        fbq(call.method, call.name, sanitizeParams(call.params ?? safe));
      }
    }
  } catch {
    // pixel indisponível
  }

  try {
    const gadsId = deps.gadsId ?? trackingIds.gadsId;
    const gtag = deps.gtag ?? window.gtag;
    if (gadsId && typeof gtag === 'function') {
      // Evento de remarketing para a conta AW. A conversão (send_to com label)
      // fica no GTM, no acionador whatsapp_click, para não contar duas vezes.
      gtag('event', name, { send_to: gadsId, ...safe });
    }
  } catch {
    // gtag indisponível
  }

  return payload;
}

export function metaContact(channel: 'whatsapp' | 'phone', contentName: string): MetaCall {
  return {
    method: 'track',
    name: 'Contact',
    params: { content_name: contentName, contact_channel: channel },
  };
}

export function metaLead(contentName: string): MetaCall {
  return {
    method: 'track',
    name: 'Lead',
    params: { content_name: contentName, content_category: 'whatsapp' },
  };
}

export function metaViewContent(contentName: string): MetaCall {
  return {
    method: 'track',
    name: 'ViewContent',
    params: { content_name: contentName, content_category: 'servico' },
  };
}

export function metaCustom(name: string, params: Record<string, unknown>): MetaCall {
  return { method: 'trackCustom', name, params };
}

export { EVENTS };

function readInterestSafe(): string[] {
  try {
    const raw = localStorage.getItem('av_campinas_interest');
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function readAttributionSafe(): Attribution {
  try {
    const raw = localStorage.getItem('av_campinas_attr') || sessionStorage.getItem('av_campinas_attr');
    if (!raw) return { first_seen: 0, expires: 0, traffic_source: 'direct' };
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed?.traffic_source) return { first_seen: 0, expires: 0, traffic_source: 'direct' };
    return parsed;
  } catch {
    return { first_seen: 0, expires: 0, traffic_source: 'direct' };
  }
}

/**
 * Única fonte dos IDs de rastreamento.
 *
 * Para trocar um ID: edite o `.env` (ou as variáveis de ambiente do projeto na
 * Vercel). Se a variável não existir, vale o padrão abaixo. String vazia
 * desliga aquele script. O GA4 não carrega um gtag próprio: o ID só é exposto
 * para a tag do GA4 dentro do GTM.
 *
 * Não usar GTM-5L9MXBST nem AW-17096558483 (contas de outra unidade).
 * A conta ativa do Google Ads é AW-18272410217 (Auto Visão 838-196-4384).
 * VITE_GADS_WHATSAPP_LABEL é o rótulo da conversão de WhatsApp para o GTM.
 * O site não dispara gtag('event', 'conversion'): a tag de conversão fica no GTM.
 */
export const TRACKING_FALLBACKS = {
  VITE_GTM_ID: 'GTM-KSQPSJ6',
  VITE_GADS_ID: 'AW-18272410217',
  VITE_META_PIXEL_ID: '885945550716019',
  VITE_GA4_ID: 'G-SK9H5S6H1K',
  VITE_GADS_WHATSAPP_LABEL: 'zlu4CNuHttQcEOm0-4hE',
} as const;

const BANNED_IDS = new Set(['GTM-5L9MXBST', 'AW-17096558483']);

export type TrackingEnvKey = keyof typeof TRACKING_FALLBACKS;

export type TrackingEnv = Partial<Record<TrackingEnvKey, string | undefined>>;

export type TrackingIds = {
  gtmId: string;
  gadsId: string;
  metaPixelId: string;
  ga4Id: string;
  /** Rótulo da conversão de WhatsApp. O GTM usa; o site não dispara a conversão. */
  gadsWhatsappLabel: string;
};

export function resolveTrackingIds(env: TrackingEnv = {}): TrackingIds {
  const read = (key: TrackingEnvKey) => {
    if (!Object.prototype.hasOwnProperty.call(env, key) || env[key] === undefined) {
      return TRACKING_FALLBACKS[key];
    }
    const value = String(env[key]).trim();
    if (BANNED_IDS.has(value)) return TRACKING_FALLBACKS[key];
    return value;
  };

  return activeIds({
    gtmId: read('VITE_GTM_ID'),
    gadsId: read('VITE_GADS_ID'),
    metaPixelId: read('VITE_META_PIXEL_ID'),
    ga4Id: read('VITE_GA4_ID'),
    gadsWhatsappLabel: read('VITE_GADS_WHATSAPP_LABEL'),
  });
}

export function activeIds(ids: TrackingIds): TrackingIds {
  return {
    gtmId: /^GTM-[A-Z0-9]+$/.test(ids.gtmId) ? ids.gtmId : '',
    gadsId: /^AW-\d+$/.test(ids.gadsId) ? ids.gadsId : '',
    metaPixelId: /^\d{5,20}$/.test(ids.metaPixelId) ? ids.metaPixelId : '',
    ga4Id: /^G-[A-Z0-9]+$/.test(ids.ga4Id) ? ids.ga4Id : '',
    gadsWhatsappLabel: /^[A-Za-z0-9_-]{4,64}$/.test(ids.gadsWhatsappLabel) ? ids.gadsWhatsappLabel : '',
  };
}

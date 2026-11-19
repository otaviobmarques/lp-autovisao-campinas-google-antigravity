import { activeIds, resolveTrackingIds, TRACKING_FALLBACKS } from './config';
import { attributionFromUrl, loadAndCapture, mergeAttribution } from './attribution';
import { allCatalogIds, serviceFromLabel, serviceFromPath, SERVICE_NAMES } from './catalog';
import { createEngagement } from './engagement';
import { EVENTS, RESERVED_GA4_EVENTS, safeEventName } from './events';
import { renderTrackingSnippets } from './htmlSnippet';
import { interestFields, recentInterestParam, rememberInterest } from './interest';
import { sanitizeParams } from './sanitize';
import { crossedScrollMarks, scrollPercent } from './scroll';

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const ids = resolveTrackingIds({});
assert(ids.gtmId === 'GTM-KSQPSJ6', 'gtm padrão');
assert(ids.gadsId === 'AW-18272410217', 'ads padrão');
assert(ids.gadsWhatsappLabel === 'zlu4CNuHttQcEOm0-4hE', 'label do WhatsApp');
assert(ids.metaPixelId === '885945550716019', 'pixel padrão');
assert(ids.ga4Id === 'G-SK9H5S6H1K', 'ga4 padrão');
assert(ids.gtmId !== 'GTM-5L9MXBST' && ids.gadsId !== 'AW-17096558483', 'ids antigos fora');

const banned = resolveTrackingIds({
  VITE_GTM_ID: 'GTM-5L9MXBST',
  VITE_GADS_ID: 'AW-17096558483',
});
assert(banned.gtmId === TRACKING_FALLBACKS.VITE_GTM_ID, 'gtm banido volta ao padrão');
assert(banned.gadsId === TRACKING_FALLBACKS.VITE_GADS_ID, 'ads banido volta ao padrão');
const disabled = resolveTrackingIds({
  VITE_GTM_ID: '',
  VITE_GADS_ID: '',
  VITE_META_PIXEL_ID: '',
  VITE_GA4_ID: '',
});
assert(!disabled.gtmId && !disabled.gadsId && !disabled.metaPixelId && !disabled.ga4Id, 'vazio desliga');
assert(activeIds({ ...ids, gtmId: 'nope' }).gtmId === '', 'gtm inválido não entra');

const html = renderTrackingSnippets(ids);
const combined = `${html.head}\n${html.bodyStart}`;
assert(combined.includes('GTM-KSQPSJ6'), 'snippet gtm');
assert(combined.includes('ns.html?id=GTM-KSQPSJ6'), 'noscript gtm');
assert(combined.includes('AW-18272410217'), 'snippet ads');
assert(combined.includes('zlu4CNuHttQcEOm0-4hE'), 'label exposto para o GTM');
assert(!combined.includes("gtag('event', 'conversion'"), 'sem conversão no HTML');
assert(!combined.includes('AW-16735543241'), 'snippet sem conta suspensa');
assert(combined.includes('send_page_view: false'), 'ads sem page_view automático');
assert(combined.includes('885945550716019'), 'snippet pixel');
assert(combined.includes("fbq('track', 'PageView')"), 'pageview inicial do pixel');
assert(combined.includes('G-SK9H5S6H1K'), 'ga4 exposto');
assert(combined.includes('ga4_measurement_id'), 'ga4 no dataLayer');
assert(!combined.includes('gtag/js?id=G-'), 'sem gtag do GA4');
assert(!combined.includes("gtag('config', \"G-"), 'sem config do GA4');
assert(!combined.includes('GTM-5L9MXBST'), 'snippet sem gtm antigo');
assert(!combined.includes('AW-17096558483'), 'snippet sem ads antigo');
assert((combined.match(/fbq\('track', 'PageView'\)/g) || []).length === 1, 'um PageView no HTML');

const off = renderTrackingSnippets(disabled);
assert(!off.head.includes('gtm.js') && !off.bodyStart.includes('ns.html'), 'gtm some sem id');
assert(!off.head.includes('fbevents') && !off.head.includes('gtag/js'), 'pixel e ads somem sem id');

for (const name of Object.values(EVENTS)) {
  assert(!(RESERVED_GA4_EVENTS as readonly string[]).includes(name), `${name} não colide`);
  assert(safeEventName(name) === name, `${name} permanece`);
}
assert(safeEventName('scroll') === 'av_scroll', 'scroll automático é renomeado');
assert(safeEventName('page_view') === 'av_page_view', 'page_view automático é renomeado');

const clean = sanitizeParams({
  service_name: 'Cautelar',
  nome: 'João',
  email: 'joao@example.com',
  telefone: '(19) 99224-8383',
  button_location: 'formulario',
  note: 'ligar (19) 99224-8383',
  percent: 50,
});
assert(clean.service_name === 'Cautelar', 'serviço permanece');
assert(clean.button_location === 'formulario', 'local permanece');
assert(clean.percent === 50, 'número permanece');
assert(!('nome' in clean) && !('email' in clean) && !('telefone' in clean), 'chaves pessoais fora');
assert(!('note' in clean), 'telefone no valor fica de fora');

assert(serviceFromPath('/vistoria-cautelar')?.name === 'Cautelar', 'cautelar');
assert(serviceFromPath('/transferencia')?.name === 'Transferência DETRAN', 'alias transferência');
assert(serviceFromPath('/vistoria-km-scanner')?.name === 'Scanner de KM', 'scanner');
assert(serviceFromPath('/vistoria-bateria-eletricos')?.name === 'Certificado Bateria', 'certificado');
assert(serviceFromPath('/vistoria-360')?.name === 'Vistoria 360 Plus Max', 'plus e max');
assert(serviceFromPath('/sobre-nos') === null, 'sitelink não é serviço');
assert(serviceFromLabel('Vistoria Cautelar Completa')?.id === 'vistoria-cautelar', 'rótulo do formulário');
assert(
  serviceFromLabel('Combo Vistoria Cautelar + Transferência DETRAN')?.id === 'combo-cautelar-transferencia',
  'combo'
);
assert(serviceFromLabel('(19) 99999-9999') === null, 'rótulo pessoal não vira serviço');
for (const id of allCatalogIds()) {
  assert(SERVICE_NAMES[id], `nome estável de ${id}`);
  assert(id.length <= 36, `${id} cabe em user property`);
}

const direct = attributionFromUrl(new URL('https://campinas.autovisao.com/'), '', 1_000);
assert(direct.traffic_source === 'direct', 'direto');
const paid = attributionFromUrl(
  new URL('https://campinas.autovisao.com/?utm_source=google&utm_medium=cpc&gclid=TeSt-click_123'),
  '',
  2_000
);
assert(paid.traffic_source === 'google_ads' && paid.gclid === 'TeSt-click_123', 'google ads');
const meta = attributionFromUrl(new URL('https://campinas.autovisao.com/?fbclid=IwAR123test'), '', 2_000);
assert(meta.traffic_source === 'meta', 'meta');
const organic = attributionFromUrl(
  new URL('https://campinas.autovisao.com/'),
  'https://www.google.com/search?q=vistoria',
  2_000
);
assert(organic.traffic_source === 'organic', 'orgânico');
const kept = mergeAttribution(paid, direct, 3_000);
assert(kept.gclid === 'TeSt-click_123', 'primeira visita com clique permanece');
const upgraded = mergeAttribution(direct, paid, 3_000);
assert(upgraded.gclid === 'TeSt-click_123' && upgraded.first_seen === direct.first_seen, 'direto absorve o clique');
const captured = loadAndCapture({
  stored: null,
  url: 'https://campinas.autovisao.com/?utm_campaign=campinas&utm_source=newsletter',
  referrer: '',
  now: 5_000,
});
assert(captured.attr.traffic_source === 'newsletter', 'utm vira a origem');
assert(!captured.serialized.includes('@'), 'atribuição sem e-mail');

let interest = rememberInterest([], 'vistoria-cautelar');
interest = rememberInterest(interest, 'vistoria-360');
interest = rememberInterest(interest, 'vistoria-cautelar');
assert(interest.join(',') === 'vistoria-360,vistoria-cautelar', 'interesse mais recente no fim');
const fields = interestFields(interest);
assert(fields.interest_last === 'vistoria-cautelar', 'último interesse');
assert(String(fields.interest_services).length <= 100, 'parâmetro cabe no GA4');
assert(recentInterestParam(allCatalogIds()).length <= 100, 'lista cheia cabe no parâmetro');

assert(scrollPercent(0, 1000, 1000) === 0, 'sem rolagem possível');
assert(scrollPercent(250, 2000, 1000) === 25, '25%');
const seen = new Set<number>();
assert(crossedScrollMarks(80, seen).join(',') === '25,50,75', 'marcos cruzados');
crossedScrollMarks(80, seen).forEach((mark) => seen.add(mark));
assert(crossedScrollMarks(100, seen).join(',') === '90', '90 uma vez');

const marks: number[] = [];
let time = 0;
let visible = true;
const queue: { id: number; at: number; fn: () => void; cancelled: boolean }[] = [];
let nextId = 1;
const engagement = createEngagement({
  marksMs: [30_000, 60_000],
  onMark: (seconds) => marks.push(seconds),
  isVisible: () => visible,
  now: () => time,
  schedule: (fn, ms) => {
    const id = nextId++;
    queue.push({ id, at: time + ms, fn, cancelled: false });
    return id;
  },
  cancel: (id) => {
    const item = queue.find((entry) => entry.id === id);
    if (item) item.cancelled = true;
  },
});
const flush = () => {
  const due = queue.filter((item) => !item.cancelled && item.at <= time);
  for (const item of due) item.cancelled = true;
  for (const item of due) item.fn();
};
engagement.sync();
time = 10_000;
visible = false;
engagement.sync();
time = 40_000;
flush();
assert(marks.length === 0, 'aba oculta não conta');
visible = true;
engagement.sync();
time = 60_000;
flush();
assert(marks.join(',') === '30', '30s de tempo visível');
time = 90_000;
flush();
assert(marks.join(',') === '30,60', '60s de tempo visível');
engagement.stop();
time = 200_000;
flush();
assert(marks.join(',') === '30,60', 'parar não dispara de novo');

console.log('tracking ok');

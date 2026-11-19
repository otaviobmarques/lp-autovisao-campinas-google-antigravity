import {
  ATTRIBUTION_STORAGE_KEY,
  loadAndCapture,
  type Attribution,
} from './attribution';
import { CAMPINAS_UNITS } from '../data/campinasData';
import { serviceFromLabel, serviceFromPath, serviceRefFromId, type ServiceRef } from './catalog';
import { createEngagement } from './engagement';
import {
  emit,
  EVENTS,
  metaContact,
  metaCustom,
  metaLead,
  metaViewContent,
} from './emit';
import { INTEREST_STORAGE_KEY, rememberInterest, SERVICE_VIEW_SESSION_KEY } from './interest';
import { crossedScrollMarks, scrollPercent } from './scroll';

const WA_HREF = /wa\.me|api\.whatsapp\.com|whatsapp\.com\/send/i;
const MAP_HREF = /google\.[^/]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps|waze\.com/i;
const WA_DIGITS = '992248383';

const PAGE_SERVICE_LOCATIONS = new Set([
  'topbar',
  'header',
  'fab',
  'barra_mobile',
  'cta_final',
  'lp_hero',
  'lp_topo',
  'lp_outros',
  'lp_incluso',
  'lp_upsell',
  'atendimento_movel',
]);

const UNIT_HINTS: [string, string][] = [
  ['ponte-preta', 'Aboli'],
  ['taquaral', 'Imperatriz'],
  ['centro', 'Andrade'],
  ['campos-eliseos', 'Pacheco'],
  ['parque-industrial', 'Amoreiras'],
];

let attribution: Attribution = { first_seen: 0, expires: 0, traffic_source: 'direct' };
let interest: string[] = [];
let seenServices = new Set<string>();
let scrollSeen = new Set<number>();
let engagementStop: (() => void) | null = null;
let scrollTick = false;
let scrollArmed = true;
let scrollWatch = 0;
let lastRouteKey = '';

export function startTracking(): void {
  attribution = captureAttribution();
  interest = readList(localStorage, INTEREST_STORAGE_KEY);
  seenServices = new Set(readList(sessionStorage, SERVICE_VIEW_SESSION_KEY));
  patchHistory();
  document.addEventListener('click', onClick, true);
  document.addEventListener('submit', onSubmit, true);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('popstate', onRoute);
  startPageEngagement();
  watchServices();
  onScroll();
}

function captureAttribution(): Attribution {
  const stored =
    readStorage(localStorage, ATTRIBUTION_STORAGE_KEY) ||
    readStorage(sessionStorage, ATTRIBUTION_STORAGE_KEY);
  const { attr, serialized } = loadAndCapture({
    stored,
    url: location.href,
    referrer: document.referrer,
    now: Date.now(),
  });
  writeStorage(localStorage, ATTRIBUTION_STORAGE_KEY, serialized);
  writeStorage(sessionStorage, ATTRIBUTION_STORAGE_KEY, serialized);
  return attr;
}

function onClick(event: Event) {
  try {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('form.schedule-form button[type="submit"], form.schedule-form input[type="submit"]')) {
      return;
    }
    const el = target.closest('a, button');
    if (!(el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement)) return;
    if (isWhatsapp(el)) {
      trackWhatsapp(el);
      deferSameTabNavigation(event, el);
      return;
    }
    if (isPhone(el)) {
      trackPhone(el);
      deferSameTabNavigation(event, el);
      return;
    }
    if (isAddress(el)) {
      trackLocation(el, EVENTS.address, 'endereco');
      deferSameTabNavigation(event, el);
      return;
    }
    if (isMap(el)) {
      trackLocation(el, EVENTS.map, mapProvider(el));
      deferSameTabNavigation(event, el);
      return;
    }
    const service = serviceFromAnchor(el);
    if (service) trackServiceClick(el, service);
  } catch {
    // clique segue normalmente
  }
}

function onSubmit(event: Event) {
  try {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.classList.contains('schedule-form')) return;
    const select = form.querySelector('#sch-service');
    const label = select instanceof HTMLSelectElement ? select.value : '';
    const service = serviceFromLabel(label);
    const contentName = service?.name || 'whatsapp';
    emit(
      EVENTS.whatsapp,
      {
        button_location: 'formulario',
        contact_channel: 'whatsapp',
        ...(service ? { service_id: service.id, service_name: service.name, content_name: service.name } : {}),
      },
      {
        meta: [metaContact('whatsapp', contentName), metaLead(contentName)],
      },
      context()
    );
  } catch {
    // o envio ao WhatsApp continua
  }
}

function trackWhatsapp(el: Element) {
  const service = serviceForClick(el);
  const contentName = service?.name || 'whatsapp';
  const upsell = safeSlug(el.closest('[data-upsell]')?.getAttribute('data-upsell'));
  emit(
    EVENTS.whatsapp,
    {
      button_location: buttonLocation(el),
      contact_channel: 'whatsapp',
      ...(service ? { service_id: service.id, service_name: service.name, content_name: service.name } : {}),
      ...(upsell ? { upsell_item: upsell } : {}),
    },
    { meta: [metaContact('whatsapp', contentName), metaLead(contentName)] },
    context()
  );
}

function trackPhone(el: Element) {
  emit(
    EVENTS.phone,
    { button_location: buttonLocation(el), contact_channel: 'phone', content_name: 'telefone' },
    { meta: [metaContact('phone', 'telefone')] },
    context()
  );
}

function trackLocation(el: Element, eventName: string, provider: string) {
  const unitId = unitFrom(el);
  emit(
    eventName,
    {
      button_location: buttonLocation(el),
      map_provider: provider,
      ...(unitId ? { unit_id: unitId, content_name: unitId } : { content_name: provider }),
    },
    {
      meta: [
        metaCustom('FindLocation', {
          map_provider: provider,
          ...(unitId ? { unit_id: unitId, content_name: unitId } : { content_name: provider }),
        }),
      ],
    },
    context()
  );
}

function trackServiceClick(el: Element, service: ServiceRef) {
  emit(
    EVENTS.serviceClick,
    {
      button_location: buttonLocation(el),
      service_id: service.id,
      service_name: service.name,
      content_name: service.name,
      content_category: 'servico',
    },
    {
      meta: [
        metaCustom('ServiceClick', {
          service_id: service.id,
          service_name: service.name,
          content_name: service.name,
          content_category: 'servico',
          button_location: buttonLocation(el),
        }),
      ],
    },
    context()
  );
}

function trackServiceView(id: string, location: string) {
  if (seenServices.has(id)) return;
  const service = serviceRefFromId(id);
  if (!service) return;
  seenServices.add(id);
  writeList(sessionStorage, SERVICE_VIEW_SESSION_KEY, [...seenServices]);
  interest = rememberInterest(interest, service.id);
  writeList(localStorage, INTEREST_STORAGE_KEY, interest);
  emit(
    EVENTS.serviceView,
    {
      button_location: location,
      service_id: service.id,
      service_name: service.name,
      content_name: service.name,
      content_category: 'servico',
    },
    {
      meta: [metaViewContent(service.name)],
      userProperties: { interest_last: service.id },
      interestList: interest,
    },
    { ...context(), interest }
  );
}

function onScroll() {
  if (!scrollArmed) {
    if (window.scrollY > 8) return;
    scrollArmed = true;
    cancelAnimationFrame(scrollWatch);
  }
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    scrollTick = false;
    try {
      const root = document.documentElement;
      const percent = scrollPercent(window.scrollY, root.scrollHeight, window.innerHeight);
      for (const mark of crossedScrollMarks(percent, scrollSeen)) {
        scrollSeen.add(mark);
        emit(
          EVENTS.scroll,
          { percent: mark },
          { meta: [metaCustom('ScrollDepth', { percent: mark })] },
          context()
        );
      }
    } catch {
      // rolagem segue
    }
  });
}

function startPageEngagement() {
  engagementStop?.();
  const clock = createEngagement({
    onMark: (seconds) => {
      emit(
        EVENTS.time,
        { seconds },
        { meta: [metaCustom('Engaged', { seconds })] },
        context()
      );
    },
    isVisible: () => document.visibilityState === 'visible',
    now: () => performance.now(),
    schedule: (fn, ms) => window.setTimeout(fn, ms),
    cancel: (id) => window.clearTimeout(id),
  });
  engagementStop = clock.stop;
  document.addEventListener('visibilitychange', clock.sync);
  clock.sync();
  const previous = engagementStop;
  engagementStop = () => {
    document.removeEventListener('visibilitychange', clock.sync);
    previous();
  };
}

function resetPageMetrics() {
  scrollSeen = new Set();
  scrollTick = false;
  engagementStop?.();
  engagementStop = null;
  startPageEngagement();
  cancelAnimationFrame(scrollWatch);
  // A rolagem suave até o topo ainda carrega a posição da página anterior.
  scrollArmed = false;
  let lastY = window.scrollY;
  let stableFrames = 0;
  let frames = 0;
  const watch = () => {
    if (scrollArmed) return;
    const y = window.scrollY;
    stableFrames = Math.abs(y - lastY) < 2 ? stableFrames + 1 : 0;
    lastY = y;
    frames += 1;
    if (y <= 8 || stableFrames >= 8 || frames > 180) {
      scrollArmed = true;
      onScroll();
      return;
    }
    scrollWatch = requestAnimationFrame(watch);
  };
  scrollWatch = requestAnimationFrame(watch);
}

function onRoute() {
  try {
    const key = `${location.pathname}${location.search}`;
    if (key === lastRouteKey) return;
    lastRouteKey = key;
    resetPageMetrics();
    emit(EVENTS.spa, { page_path: location.pathname, page_title: document.title.slice(0, 120) }, {}, context());
    try {
      window.fbq?.('track', 'PageView');
    } catch {
      // pixel indisponível
    }
  } catch {
    // navegação segue
  }
}

function patchHistory() {
  lastRouteKey = `${location.pathname}${location.search}`;
  const flag = '__avHistoryPatched';
  if ((window as unknown as Record<string, boolean>)[flag]) return;
  (window as unknown as Record<string, boolean>)[flag] = true;
  const push = history.pushState.bind(history);
  const replace = history.replaceState.bind(history);
  history.pushState = (...args) => {
    const result = push(...args);
    try {
      window.dispatchEvent(new Event('av:navigation'));
    } catch {
      // a troca de rota segue
    }
    return result;
  };
  history.replaceState = (...args) => {
    const result = replace(...args);
    try {
      window.dispatchEvent(new Event('av:navigation'));
    } catch {
      // a troca de rota segue
    }
    return result;
  };
  window.addEventListener('av:navigation', onRoute);
}

function watchServices() {
  const visible = new WeakMap<Element, boolean>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible.set(entry.target, entry.isIntersecting && entry.intersectionRatio >= 0.25);
        viewIfReady(entry.target, visible);
      }
    },
    { threshold: [0, 0.25, 0.5] }
  );

  const scan = (node: Node) => {
    if (!(node instanceof Element)) return;
    if (node.hasAttribute('data-service-view')) observer.observe(node);
    node.querySelectorAll('[data-service-view]').forEach((el) => observer.observe(el));
  };

  scan(document.body);
  const mutations = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof Element) {
        observer.observe(record.target);
        viewIfReady(record.target, visible);
      }
      record.addedNodes.forEach(scan);
    }
  });
  mutations.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-service-view'],
  });
}

function viewIfReady(el: Element, visible: WeakMap<Element, boolean>) {
  if (!visible.get(el)) return;
  const id = el.getAttribute('data-service-view');
  if (!id) return;
  trackServiceView(id, buttonLocation(el));
}

function serviceForClick(el: Element): ServiceRef | null {
  const named = closestAttr(el, 'data-service-name');
  const id = closestAttr(el, 'data-service-id') || closestAttr(el, 'data-service-view');
  const fromId = serviceRefFromId(id);
  if (fromId) return fromId;
  if (named) return { id: '', name: named };
  // `place` não pode se chamar `location`: isso sombreia window.location e
  // `location.pathname` vira undefined, o push do evento estoura e some.
  const place = buttonLocation(el);
  if (PAGE_SERVICE_LOCATIONS.has(place)) return serviceFromPath(window.location.pathname);
  return null;
}

function serviceFromAnchor(el: Element): ServiceRef | null {
  if (!(el instanceof HTMLAnchorElement)) return null;
  const raw = el.getAttribute('href') || '';
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  return serviceFromPath(new URL(raw, location.origin).pathname);
}

/** Links externos na mesma aba esperam o dataLayer antes de navegar. Os de WhatsApp abrem em outra aba. */
function deferSameTabNavigation(event: Event, el: Element) {
  if (!(el instanceof HTMLAnchorElement) || el.target === '_blank') return;
  if (event.defaultPrevented || ('button' in event && event.button !== 0)) return;
  const raw = el.getAttribute('href') || '';
  if (!raw || raw.startsWith('#') || raw.startsWith('/') || raw.startsWith('javascript:')) return;
  event.preventDefault();
  window.setTimeout(() => {
    window.location.assign(el.href);
  }, 300);
}

function isWhatsapp(el: Element): boolean {
  const href = hrefOf(el);
  if (WA_HREF.test(href)) return true;
  const digits = (el.textContent || '').replace(/\D/g, '');
  return digits.includes(WA_DIGITS);
}

function isPhone(el: Element): boolean {
  return hrefOf(el).toLowerCase().startsWith('tel:');
}

function isMap(el: Element): boolean {
  return MAP_HREF.test(hrefOf(el));
}

function isAddress(el: Element): boolean {
  const href = hrefOf(el);
  return href.toLowerCase().startsWith('geo:') || el.getAttribute('data-track-event') === 'address';
}

function mapProvider(el: Element): string {
  return /waze\.com/i.test(hrefOf(el)) ? 'waze' : 'google_maps';
}

function hrefOf(el: Element): string {
  if (el instanceof HTMLAnchorElement) return el.href || el.getAttribute('href') || '';
  return el.getAttribute('href') || '';
}

function unitFrom(el: Element): string {
  const host = el.closest('[id^="loja-"]');
  if (host?.id.startsWith('loja-')) return host.id.slice('loja-'.length);
  const href = decodeURIComponent(hrefOf(el));
  const hinted = UNIT_HINTS.find(([, hint]) => href.includes(hint));
  if (hinted) return hinted[0];
  const unit = CAMPINAS_UNITS.find((item) => item.mapsUrl === href || item.wazeUrl === href);
  return unit?.id || '';
}

export function buttonLocation(el: Element): string {
  const marked = el.closest('[data-track-location]')?.getAttribute('data-track-location');
  if (marked && /^[a-z0-9_-]{1,40}$/.test(marked)) return marked;
  if (el.closest('.topbar')) return 'topbar';
  if (el.closest('.mbar')) return 'barra_mobile';
  if (el.closest('.fab')) return 'fab';
  if (el.closest('.sheet-panel')) return 'gaveta_mobile';
  if (el.closest('.schedule-form')) return 'formulario';
  if (el.closest('.ft')) return 'rodape';
  if (el.closest('.wz-out, .wizard')) return 'wizard';
  if (el.closest('.duty-bar')) return 'plantao';
  if (el.closest('.flagship-card')) return 'card_destaque';
  if (el.closest('article.sv')) return 'card_servico';
  if (el.closest('.pj-strip')) return serviceFromPath(location.pathname) ? 'lp_upsell' : 'faixa_pj';
  if (el.closest('.lp-two-cols')) return 'lp_incluso';
  if (el.closest('.unit-help')) return 'ajuda_lojas';
  if (el.closest('article.unit')) return 'card_loja';
  if (el.closest('.final')) return 'cta_final';
  if (el.closest('.faq-side')) return 'duvidas';
  if (el.closest('.svc-hero')) return 'lp_hero';
  if (el.closest('.lp-banner-top')) return 'lp_topo';
  if (el.closest('.hero')) return 'hero';
  if (el.closest('header')) return 'header';
  if (el.closest('#nossas-lojas')) return 'lojas';
  return 'pagina';
}

function closestAttr(el: Element, name: string): string {
  return el.closest(`[${name}]`)?.getAttribute(name)?.trim() || '';
}

function safeSlug(value: string | null | undefined): string {
  return value && /^[a-z0-9-]{1,40}$/.test(value) ? value : '';
}

function context() {
  return { attribution, interest };
}

function readList(storage: Storage, key: string): string[] {
  try {
    const parsed = JSON.parse(storage.getItem(key) || '[]') as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(storage: Storage, key: string, list: string[]) {
  try {
    storage.setItem(key, JSON.stringify(list));
  } catch {
    // storage bloqueado
  }
}

function readStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // storage bloqueado
  }
}

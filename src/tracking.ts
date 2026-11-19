/**
 * Rastreamento da LP Auto Visão Campinas.
 *
 * IDs (os mesmos de unidades.autovisao.com):
 * - GTM-5L9MXBST          (snippet no index.html)
 * - AW-17096558483       (gtag direto, remarketing Google Ads)
 * - 885945550716019      (Meta Pixel "Auto Visão und campinas")
 *
 * Decisão do page_view do Google Ads
 * -----------------------------------
 * O snippet direto chama
 *   gtag('config', 'AW-17096558483', { send_page_view: false })
 * para NÃO disparar o page_view automático do gtag.js. O contêiner
 * GTM-5L9MXBST (o mesmo da página de unidades) pode ter uma tag de
 * remarketing desse AW id; se o config daqui também enviasse page_view,
 * a visita inicial seria contada duas vezes.
 *
 * Depois que o GTM sinaliza `gtm.load` (ou após 3s, se o contêiner não
 * carregar), enviamos UM page_view manual para AW-17096558483 somente
 * se o dataLayer ainda não tiver um config/page_view desse id. Assim o
 * remarketing existe mesmo que o contêiner não tenha tag para esta
 * página, e não duplica quando o GTM já disparou.
 *
 * Nas trocas de rota da SPA (`pushState` / `replaceState` / `popstate` /
 * `hashchange`) o acionador "All Pages" do GTM não enxerga a navegação.
 * Por isso cada rota nova dispara:
 * - fbq('track', 'PageView') — o PageView do snippet cobre só a carga
 *   inicial; este módulo não repete esse primeiro hit;
 * - gtag('event', 'page_view', { send_to: 'AW-17096558483' }).
 *
 * Contact e Lead no WhatsApp
 * ---------------------------
 * O clique no WhatsApp dispara os dois eventos padrão da Meta.
 * Contact mede a intenção de contato (padrão para clique em WhatsApp).
 * Lead mede a conversão: nesta LP não há página de obrigado — o clique
 * (ou o formulário, que só abre o WhatsApp) É o lead. No Gerenciador de
 * Eventos, otimize a campanha em Lead e use Contact para remarketing,
 * para não otimizar os dois ao mesmo tempo.
 *
 * Tudo aqui é à prova de falha: se fbq, gtag ou dataLayer não existirem,
 * a função retorna sem lançar erro e sem alterar o clique.
 */

export const GTM_ID = 'GTM-5L9MXBST';
export const GOOGLE_ADS_ID = 'AW-17096558483';
export const META_PIXEL_ID = '885945550716019';

const INSTALL_FLAG = '__avCampinasTracking';
const DEFAULT_GTM_WAIT_MS = 3000;

type DataLayerEntry = unknown;

interface TrackingState {
  installed: boolean;
  lastKey: string;
  spaAdsPageViewSent: boolean;
}

interface TrackingWindow extends Window {
  dataLayer?: DataLayerEntry[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  __AV_GTM_WAIT_MS?: number;
  [INSTALL_FLAG]?: TrackingState;
}

function trackingWindow(): TrackingWindow | null {
  try {
    if (typeof window === 'undefined') return null;
    return window as TrackingWindow;
  } catch {
    return null;
  }
}

function ensureDataLayer(win: TrackingWindow): DataLayerEntry[] {
  if (!Array.isArray(win.dataLayer)) win.dataLayer = [];
  return win.dataLayer;
}

function pushDataLayer(payload: Record<string, unknown>): void {
  const win = trackingWindow();
  if (!win) return;
  try {
    ensureDataLayer(win).push(payload);
  } catch {
    // ignore
  }
}

function sendGtag(eventName: string, params: Record<string, unknown>): void {
  const win = trackingWindow();
  if (!win) return;
  try {
    if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, params);
      return;
    }
    ensureDataLayer(win).push({ event: eventName, ...params });
  } catch {
    // ignore
  }
}

function sendFbq(
  method: 'track' | 'trackCustom',
  eventName: string,
  params?: Record<string, unknown>
): void {
  const win = trackingWindow();
  if (!win || typeof win.fbq !== 'function') return;
  try {
    if (params) win.fbq(method, eventName, params);
    else win.fbq(method, eventName);
  } catch {
    // ignore
  }
}

export function isWhatsappHref(href: string | null | undefined): boolean {
  if (!href) return false;
  const value = href.toLowerCase();
  return (
    value.includes('wa.me') ||
    value.includes('api.whatsapp.com') ||
    value.includes('whatsapp.com/send') ||
    value.includes('992248383') ||
    value.includes('99224-8383')
  );
}

function commandParts(entry: DataLayerEntry): {
  cmd?: unknown;
  target?: unknown;
  params: Record<string, unknown>;
} | null {
  if (Array.isArray(entry)) {
    const params =
      entry[2] && typeof entry[2] === 'object' ? (entry[2] as Record<string, unknown>) : {};
    return { cmd: entry[0], target: entry[1], params };
  }
  if (!entry || typeof entry !== 'object') return null;
  const record = entry as Record<string, unknown>;
  if (!('0' in record) && !(0 in record)) return null;
  const rawParams = record[2];
  const params =
    rawParams && typeof rawParams === 'object' ? (rawParams as Record<string, unknown>) : {};
  return { cmd: record[0], target: record[1], params };
}

function sendToIncludesAds(sendTo: unknown): boolean {
  if (typeof sendTo === 'string') return sendTo === GOOGLE_ADS_ID;
  if (Array.isArray(sendTo)) return sendTo.some((item) => item === GOOGLE_ADS_ID);
  return false;
}

/**
 * Verdadeiro quando a entrada do dataLayer já representa um page_view
 * (ou um config que envia page_view por padrão) para AW-17096558483.
 * O config desta página usa send_page_view:false e NÃO conta.
 */
export function entrySendsAdsPageView(entry: DataLayerEntry): boolean {
  try {
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      const record = entry as Record<string, unknown>;
      if (record.event === 'page_view' && sendToIncludesAds(record.send_to)) return true;
    }
    const command = commandParts(entry);
    if (!command) return false;
    if (command.cmd === 'config' && command.target === GOOGLE_ADS_ID) {
      return command.params.send_page_view !== false;
    }
    if (command.cmd === 'event' && command.target === 'page_view') {
      return sendToIncludesAds(command.params.send_to);
    }
    return false;
  } catch {
    return false;
  }
}

export function dataLayerHasAdsPageView(dataLayer: DataLayerEntry[] | undefined): boolean {
  if (!Array.isArray(dataLayer)) return false;
  return dataLayer.some((entry) => entrySendsAdsPageView(entry));
}

/** Não dispara o page_view inicial do Ads se o GTM já disparou ou se a SPA já navegou. */
export function shouldSendInitialAdsPageView(
  dataLayer: DataLayerEntry[] | undefined,
  spaAlreadySent: boolean
): boolean {
  if (spaAlreadySent) return false;
  return !dataLayerHasAdsPageView(dataLayer);
}

function locationKey(): string {
  const win = trackingWindow();
  if (!win) return '';
  try {
    const { pathname, search, hash } = win.location;
    return `${pathname}${search}${hash}`;
  } catch {
    return '';
  }
}

function pagePath(): string {
  const win = trackingWindow();
  if (!win) return '/';
  try {
    return `${win.location.pathname}${win.location.search}`;
  } catch {
    return '/';
  }
}

function sendAdsPageView(): void {
  const win = trackingWindow();
  sendGtag('page_view', {
    send_to: GOOGLE_ADS_ID,
    page_location: win?.location?.href ?? '',
    page_path: pagePath(),
    page_title: win?.document?.title ?? '',
  });
}

export function trackWhatsappClick(buttonLocation: string, serviceName = ''): void {
  try {
    const location = buttonLocation.trim() || 'desconhecido';
    const service = serviceName.trim();
    pushDataLayer({
      event: 'whatsapp_click',
      button_location: location,
      service_name: service,
    });
    sendGtag('whatsapp_click', {
      button_location: location,
      service_name: service,
      send_to: GOOGLE_ADS_ID,
    });
    const metaParams: Record<string, string> = {
      content_category: location,
      content_name: service || 'WhatsApp',
    };
    // Contact = clique de contato; Lead = conversão desta LP (não há thank-you page).
    sendFbq('track', 'Contact', metaParams);
    sendFbq('track', 'Lead', metaParams);
  } catch {
    // ignore
  }
}

export function trackServiceClick(buttonLocation: string, serviceName: string): void {
  try {
    const location = buttonLocation.trim() || 'desconhecido';
    const service = serviceName.trim();
    if (!service) return;
    pushDataLayer({
      event: 'service_click',
      service_name: service,
      button_location: location,
    });
    sendGtag('service_click', {
      service_name: service,
      button_location: location,
      send_to: GOOGLE_ADS_ID,
    });
    sendFbq('trackCustom', 'ServiceClick', {
      service_name: service,
      button_location: location,
    });
    sendFbq('track', 'ViewContent', {
      content_name: service,
    });
  } catch {
    // ignore
  }
}

/** Usado pelo listener de clique e pelos testes. Não lança erro. */
export function trackFromAttributes(
  kind: string | null,
  location: string | null,
  service: string | null,
  href?: string | null
): void {
  try {
    if (kind === 'whatsapp') {
      trackWhatsappClick(location || 'desconhecido', service || '');
      return;
    }
    if (kind === 'service') {
      trackServiceClick(location || 'desconhecido', service || '');
      return;
    }
    if (isWhatsappHref(href)) trackWhatsappClick('whatsapp_nao_mapeado', '');
  } catch {
    // ignore
  }
}

export function whatsappTrack(location: string, serviceName?: string) {
  return {
    'data-track': 'whatsapp',
    'data-track-location': location,
    'data-track-service': serviceName?.trim() ?? '',
  };
}

export function serviceTrack(location: string, serviceName: string) {
  return {
    'data-track': 'service',
    'data-track-location': location,
    'data-track-service': serviceName,
  };
}

function onDocumentClick(event: Event): void {
  try {
    const target = event.target;
    if (!target || typeof (target as Element).closest !== 'function') return;
    const element = target as Element;
    const tracked = element.closest('[data-track]');
    if (tracked) {
      trackFromAttributes(
        tracked.getAttribute('data-track'),
        tracked.getAttribute('data-track-location'),
        tracked.getAttribute('data-track-service'),
        tracked.getAttribute('href')
      );
      return;
    }
    const anchor = element.closest('a');
    if (anchor) trackFromAttributes(null, null, null, anchor.getAttribute('href'));
  } catch {
    // ignore
  }
}

function onSpaNavigation(state: TrackingState): void {
  try {
    const key = locationKey();
    if (!key || key === state.lastKey) return;
    state.lastKey = key;
    state.spaAdsPageViewSent = true;
    sendFbq('track', 'PageView');
    sendAdsPageView();
  } catch {
    // ignore
  }
}

function patchHistory(state: TrackingState): void {
  try {
    const originalPush = history.pushState.bind(history);
    history.pushState = function (data: unknown, unused: string, url?: string | URL | null) {
      originalPush(data, unused, url);
      onSpaNavigation(state);
    };
    const originalReplace = history.replaceState.bind(history);
    history.replaceState = function (data: unknown, unused: string, url?: string | URL | null) {
      originalReplace(data, unused, url);
      onSpaNavigation(state);
    };
  } catch {
    // ignore
  }
}

function gtmWaitMs(win: TrackingWindow): number {
  return typeof win.__AV_GTM_WAIT_MS === 'number' ? win.__AV_GTM_WAIT_MS : DEFAULT_GTM_WAIT_MS;
}

function waitForGtmLoad(win: TrackingWindow): Promise<void> {
  const timeoutMs = gtmWaitMs(win);
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      try {
        const loaded = (win.dataLayer || []).some((entry) => {
          return (
            !!entry &&
            typeof entry === 'object' &&
            (entry as { event?: string }).event === 'gtm.load'
          );
        });
        if (loaded || Date.now() - start >= timeoutMs) {
          resolve();
          return;
        }
      } catch {
        resolve();
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

async function scheduleInitialAdsPageView(state: TrackingState): Promise<void> {
  const win = trackingWindow();
  if (!win) return;
  try {
    await waitForGtmLoad(win);
    if (!shouldSendInitialAdsPageView(win.dataLayer, state.spaAdsPageViewSent)) return;
    sendAdsPageView();
  } catch {
    // ignore
  }
}

/** Instala o listener de cliques e o page view das rotas. Idempotente. */
export function initTracking(): void {
  const win = trackingWindow();
  if (!win || typeof document === 'undefined') return;
  try {
    if (win[INSTALL_FLAG]?.installed) return;
    const state: TrackingState = {
      installed: true,
      lastKey: locationKey(),
      spaAdsPageViewSent: false,
    };
    win[INSTALL_FLAG] = state;
    document.addEventListener('click', onDocumentClick, true);
    patchHistory(state);
    window.addEventListener('popstate', () => onSpaNavigation(state));
    window.addEventListener('hashchange', () => onSpaNavigation(state));
    void scheduleInitialAdsPageView(state);
  } catch {
    // ignore
  }
}

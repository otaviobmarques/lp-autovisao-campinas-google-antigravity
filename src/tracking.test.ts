import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  GOOGLE_ADS_ID,
  dataLayerHasAdsPageView,
  entrySendsAdsPageView,
  initTracking,
  isWhatsappHref,
  shouldSendInitialAdsPageView,
  trackFromAttributes,
  trackServiceClick,
  trackWhatsappClick,
} from './tracking.ts';

type Call = unknown[];

interface Harness {
  dataLayer: unknown[];
  gtagCalls: Call[];
  fbqCalls: Call[];
  location: { pathname: string; search: string; hash: string; href: string };
}

function installHarness(pathname = '/'): Harness {
  const harness: Harness = {
    dataLayer: [],
    gtagCalls: [],
    fbqCalls: [],
    location: {
      pathname,
      search: '',
      hash: '',
      href: `https://campinas.autovisao.com${pathname}`,
    },
  };

  const gtag = (...args: unknown[]) => {
    harness.gtagCalls.push(args);
    harness.dataLayer.push(args);
  };
  const fbq = (...args: unknown[]) => {
    harness.fbqCalls.push(args);
  };

  const win = {
    dataLayer: harness.dataLayer,
    gtag,
    fbq,
    location: harness.location,
    document: {
      title: 'Auto Visão Campinas',
      addEventListener() {},
    },
    addEventListener() {},
    __AV_GTM_WAIT_MS: 0,
  };

  Object.assign(globalThis, {
    window: win,
    document: win.document,
    history: {
      pushState(_data: unknown, _unused: string, url?: string) {
        const next = new URL(String(url), 'https://campinas.autovisao.com');
        harness.location.pathname = next.pathname;
        harness.location.search = next.search;
        harness.location.hash = next.hash;
        harness.location.href = next.href;
      },
      replaceState() {},
    },
  });

  return harness;
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
  delete (globalThis as { document?: unknown }).document;
  delete (globalThis as { history?: unknown }).history;
});

test('reconhece links de WhatsApp, inclusive o número da unidade', () => {
  assert.equal(isWhatsappHref('https://wa.me/5519992248383?text=ola'), true);
  assert.equal(isWhatsappHref('https://api.whatsapp.com/send?phone=5519992248383'), true);
  assert.equal(isWhatsappHref('https://web.whatsapp.com/send?phone=5519992248383'), true);
  assert.equal(isWhatsappHref('tel:+5519992248383'), true);
  assert.equal(isWhatsappHref('tel:+551932711700'), false);
  assert.equal(isWhatsappHref('https://www.google.com/maps'), false);
  assert.equal(isWhatsappHref(null), false);
});

test('config com send_page_view:false não conta como page view do Ads', () => {
  const ours = ['config', GOOGLE_ADS_ID, { send_page_view: false }];
  const gtmConfig = ['config', GOOGLE_ADS_ID];
  const gtmEvent = ['event', 'page_view', { send_to: GOOGLE_ADS_ID }];
  const ga4 = ['config', 'G-ABCDEF', {}];
  const objectEvent = { event: 'page_view', send_to: GOOGLE_ADS_ID };
  const click = { event: 'whatsapp_click', button_location: 'header', service_name: '' };

  assert.equal(entrySendsAdsPageView(ours), false);
  assert.equal(entrySendsAdsPageView(gtmConfig), true);
  assert.equal(entrySendsAdsPageView(gtmEvent), true);
  assert.equal(entrySendsAdsPageView(ga4), false);
  assert.equal(entrySendsAdsPageView(objectEvent), true);
  assert.equal(entrySendsAdsPageView(click), false);
  assert.equal(dataLayerHasAdsPageView([ours, click]), false);
  assert.equal(shouldSendInitialAdsPageView([ours], false), true);
  assert.equal(shouldSendInitialAdsPageView([ours, gtmConfig], false), false);
  assert.equal(shouldSendInitialAdsPageView([ours], true), false);
});

test('clique de WhatsApp empurra dataLayer, gtag, Contact e Lead', () => {
  const harness = installHarness();
  trackWhatsappClick('home_destaque', 'Vistoria Cautelar');

  assert.deepEqual(harness.dataLayer[0], {
    event: 'whatsapp_click',
    button_location: 'home_destaque',
    service_name: 'Vistoria Cautelar',
  });
  assert.deepEqual(harness.gtagCalls[0], [
    'event',
    'whatsapp_click',
    {
      button_location: 'home_destaque',
      service_name: 'Vistoria Cautelar',
      send_to: GOOGLE_ADS_ID,
    },
  ]);
  assert.deepEqual(harness.fbqCalls, [
    [
      'track',
      'Contact',
      { content_category: 'home_destaque', content_name: 'Vistoria Cautelar' },
    ],
    [
      'track',
      'Lead',
      { content_category: 'home_destaque', content_name: 'Vistoria Cautelar' },
    ],
  ]);
});

test('clique de serviço empurra service_click, ServiceClick e ViewContent', () => {
  const harness = installHarness();
  trackServiceClick('lp_upsell', 'KM com Scanner de Módulo');

  assert.deepEqual(harness.dataLayer[0], {
    event: 'service_click',
    service_name: 'KM com Scanner de Módulo',
    button_location: 'lp_upsell',
  });
  assert.deepEqual(harness.gtagCalls[0], [
    'event',
    'service_click',
    {
      service_name: 'KM com Scanner de Módulo',
      button_location: 'lp_upsell',
      send_to: GOOGLE_ADS_ID,
    },
  ]);
  assert.deepEqual(harness.fbqCalls, [
    [
      'trackCustom',
      'ServiceClick',
      {
        service_name: 'KM com Scanner de Módulo',
        button_location: 'lp_upsell',
      },
    ],
    ['track', 'ViewContent', { content_name: 'KM com Scanner de Módulo' }],
  ]);
});

test('serviço sem nome e gtag/fbq ausentes não quebram', () => {
  installHarness();
  const win = (globalThis as { window: { gtag?: unknown; fbq?: unknown } }).window;
  delete win.gtag;
  delete win.fbq;
  assert.doesNotThrow(() => trackServiceClick('rodape', '   '));
  assert.doesNotThrow(() => trackWhatsappClick('rodape', ''));
  assert.doesNotThrow(() =>
    trackFromAttributes('service', 'rodape', 'Vistoria de Pintura', null)
  );
});

test('link de WhatsApp sem data-track ainda dispara o evento', () => {
  const harness = installHarness();
  trackFromAttributes(null, null, null, 'https://wa.me/5519992248383');
  assert.equal((harness.dataLayer[0] as { event: string }).event, 'whatsapp_click');
  assert.equal(
    (harness.dataLayer[0] as { button_location: string }).button_location,
    'whatsapp_nao_mapeado'
  );
});

test('SPA: PageView inicial do pixel não repete; rota nova dispara PageView e Ads', async () => {
  const harness = installHarness('/');
  harness.dataLayer.push(['config', GOOGLE_ADS_ID, { send_page_view: false }]);
  initTracking();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const metaPageViews = () => harness.fbqCalls.filter((call) => call[1] === 'PageView');
  const adsPageViews = () =>
    harness.gtagCalls.filter((call) => call[0] === 'event' && call[1] === 'page_view');

  assert.equal(metaPageViews().length, 0, 'não repete o PageView do snippet');
  assert.equal(adsPageViews().length, 1, 'envia o page_view do Ads quando o GTM não enviou');

  history.pushState({}, '', '/vistoria-cautelar');
  assert.equal(metaPageViews().length, 1);
  assert.equal(adsPageViews().length, 2);
  assert.equal(
    (adsPageViews()[1][2] as { page_path: string }).page_path,
    '/vistoria-cautelar'
  );

  history.pushState({}, '', '/vistoria-cautelar');
  assert.equal(metaPageViews().length, 1, 'mesma rota não duplica');
  assert.equal(adsPageViews().length, 2);
});

test('se o GTM já enviou o page_view do Ads, o módulo não envia outro na carga', async () => {
  const harness = installHarness('/');
  harness.dataLayer.push(['config', GOOGLE_ADS_ID]);
  initTracking();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const adsPageViews = harness.gtagCalls.filter(
    (call) => call[0] === 'event' && call[1] === 'page_view'
  );
  assert.equal(adsPageViews.length, 0);

  history.pushState({}, '', '/vistoria-km-scanner');
  const afterNav = harness.gtagCalls.filter(
    (call) => call[0] === 'event' && call[1] === 'page_view'
  );
  assert.equal(afterNav.length, 1);
  assert.equal(harness.fbqCalls.filter((call) => call[1] === 'PageView').length, 1);
});

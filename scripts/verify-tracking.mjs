import { spawn } from 'node:child_process';

const PREVIEW_PORT = 4173;
const CDP_PORT = 9333;
const PAGE = `http://127.0.0.1:${PREVIEW_PORT}/?utm_source=google&utm_medium=cpc&utm_campaign=campinas&gclid=TeSt-click_123`;

const preview = spawn(
  'npx',
  ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort'],
  { stdio: 'ignore' }
);
const chrome = spawn(
  'google-chrome',
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--no-first-run',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=/tmp/chrome-av-tracking',
    '--window-size=1280,900',
  ],
  { stdio: 'ignore' }
);

const shutdown = () => {
  preview.kill('SIGTERM');
  chrome.kill('SIGTERM');
};
process.on('exit', shutdown);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 400) return;
    } catch {
      // ainda subindo
    }
    await sleep(200);
  }
  throw new Error(`Sem resposta de ${url}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  await waitForHttp(`http://127.0.0.1:${PREVIEW_PORT}/`);
  await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/version`);
  const created = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(PAGE)}`, {
    method: 'PUT',
  });
  if (!created.ok) throw new Error(`Chrome não abriu a página (${created.status})`);
  const target = await created.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  let nextId = 0;
  const pending = new Map();
  const exceptions = [];
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }
    if (message.method === 'Runtime.exceptionThrown') {
      exceptions.push(message.params.exceptionDetails?.text || 'exception');
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Runtime.enable');
  await send('Page.enable');
  await sleep(600);

  const evalJson = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || 'Falha ao avaliar a página');
    }
    return result.result.value;
  };

  await evalJson(`(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.__fbqCalls = [];
    window.__gtagCalls = [];
    const origFbq = window.fbq;
    window.fbq = function () {
      window.__fbqCalls.push(Array.from(arguments).map((item) =>
        typeof item === 'object' && item ? JSON.parse(JSON.stringify(item)) : item
      ));
      return origFbq && origFbq.apply(this, arguments);
    };
    const origGtag = window.gtag;
    window.gtag = function () {
      window.__gtagCalls.push(Array.from(arguments).map((item) =>
        typeof item === 'object' && item ? JSON.parse(JSON.stringify(item)) : item
      ));
      return origGtag && origGtag.apply(this, arguments);
    };
    window.open = () => null;
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest?.('a');
      if (!anchor) return;
      const raw = anchor.getAttribute('href') || '';
      if (anchor.target === '_blank' || raw.startsWith('tel:') || raw.startsWith('mailto:')) {
        event.preventDefault();
      }
    }, true);
    return true;
  })()`);

  const boot = await evalJson(`(() => ({
    tracking: window.AV_TRACKING,
    hasGa4Config: /gtag\\('config',\\s*"G-/.test(document.documentElement.outerHTML),
    hasOldIds: /GTM-5L9MXBST|AW-17096558483|AW-16735543241/.test(
      [...document.querySelectorAll('[data-av-tracking]')].map((node) => node.outerHTML).join('\\n')
    ),
    hasConversion: /gtag\\('event',\\s*'conversion'/.test(document.documentElement.outerHTML),
    sendPageViewFalse: document.documentElement.outerHTML.includes('send_page_view: false'),
    initialPageViews: (document.documentElement.outerHTML.match(/fbq\\('track', 'PageView'\\)/g) || []).length,
  }))()`);
  assert(boot.tracking.gtmId === 'GTM-KSQPSJ6', 'GTM na página');
  assert(boot.tracking.gadsId === 'AW-18272410217', 'Google Ads na página');
  assert(boot.tracking.gadsWhatsappLabel === 'zlu4CNuHttQcEOm0-4hE', 'label do WhatsApp exposto');
  assert(boot.hasConversion === false, 'sem gtag conversion no HTML');
  assert(boot.tracking.metaPixelId === '885945550716019', 'Pixel na página');
  assert(boot.tracking.ga4Id === 'G-SK9H5S6H1K', 'GA4 exposto');
  assert(boot.sendPageViewFalse === true, 'Ads sem page_view automático');
  assert(boot.hasGa4Config === false, 'sem gtag de GA4');
  assert(boot.hasOldIds === false, 'sem IDs de outra unidade');
  assert(boot.initialPageViews === 1, 'PageView inicial único no HTML');

  const whatsappLinks = await evalJson(`(() => {
    const eventName = (item) => {
      if (!item || typeof item !== 'object') return '';
      if (typeof item.event === 'string') return item.event;
      if (item[0] === 'event' && typeof item[1] === 'string') return item[1];
      return '';
    };
    const links = [...document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com"]')];
    return links.map((link, index) => {
      const before = window.dataLayer.length;
      link.click();
      const added = window.dataLayer.slice(before);
      const named = added.map(eventName).filter((name) => name === 'whatsapp_click');
      const hit = added.find((item) => item && item.event === 'whatsapp_click' && item.av_source === 'app');
      return {
        index,
        text: (link.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 70),
        location: hit && hit.button_location,
        service: hit && hit.service_name,
        count: named.length,
        ok: named.length === 1 && Boolean(hit),
      };
    });
  })()`);
  const failedLinks = whatsappLinks.filter((item) => !item.ok);
  for (const item of whatsappLinks) {
    console.log(`${item.ok ? 'PASS' : 'FAIL'} whatsapp x${item.count} [${item.location || '-'}] ${item.text}`);
  }
  assert(whatsappLinks.length > 0, 'nenhum link de WhatsApp na página');
  assert(failedLinks.length === 0, `whatsapp_click faltou em ${failedLinks.length} link(s)`);

  await evalJson(`document.querySelector('[data-service-view="vistoria-premium"]').scrollIntoView({ block: 'center' })`);
  await sleep(400);

  const serviceClick = await evalJson(`(() => {
    const eventName = (item) => {
      if (!item || typeof item !== 'object') return '';
      if (typeof item.event === 'string') return item.event;
      if (item[0] === 'event' && typeof item[1] === 'string') return item[1];
      return '';
    };
    const link = document.querySelector('#vistoria-cautelar a[href="/vistoria-cautelar"]');
    const before = window.dataLayer.length;
    link.click();
    const added = window.dataLayer.slice(before);
    const named = added.map(eventName).filter((name) => name === 'service_click');
    const hit = added.find((item) => item && item.event === 'service_click' && item.av_source === 'app');
    return { count: named.length, location: hit && hit.button_location, ok: named.length === 1 && Boolean(hit) };
  })()`);
  console.log(`${serviceClick.ok ? 'PASS' : 'FAIL'} service_click x${serviceClick.count} [${serviceClick.location || '-'}] Vistoria Cautelar`);
  assert(serviceClick.ok, 'service_click deve aparecer exatamente uma vez');
  await sleep(500);

  await evalJson(`document.querySelector('.svc-hero .btn-wa').click()`);
  await sleep(200);

  const openService = async (path) => {
    await evalJson(`(() => {
      const link = document.querySelector('a[href="${path}"]');
      if (!link) throw new Error('sem link para ${path}');
      link.click();
      return true;
    })()`);
    await sleep(400);
    const current = await evalJson('location.pathname');
    assert(current === path, `navegação para ${path}, ficou em ${current}`);
  };
  const clickMobile = async (path) => {
    const hit = await evalJson(`(() => {
      const link = document.querySelector('#no-seu-endereco .btn-wa');
      if (!link) return null;
      const before = window.dataLayer.length;
      link.click();
      const added = window.dataLayer.slice(before);
      const named = added.filter((item) => item && item.event === 'whatsapp_click');
      const app = named.find((item) => item.av_source === 'app');
      return {
        path: location.pathname,
        text: (link.textContent || '').replace(/\\s+/g, ' ').trim(),
        count: named.length,
        location: app && app.button_location,
        service: app && app.service_name,
      };
    })()`);
    console.log(
      `${hit && hit.count === 1 && hit.location === 'atendimento_movel' ? 'PASS' : 'FAIL'} whatsapp x${hit ? hit.count : 0} [${hit && hit.location}] ${path} ${hit && hit.service} ${hit && hit.text}`
    );
    assert(hit && hit.path === path && hit.count === 1 && hit.location === 'atendimento_movel', `atendimento móvel em ${path}`);
  };
  await clickMobile('/vistoria-cautelar');
  await openService('/vistoria-km-scanner');
  await clickMobile('/vistoria-km-scanner');
  await openService('/vistoria-bateria-eletricos');
  await clickMobile('/vistoria-bateria-eletricos');
  await openService('/vistoria-cautelar');

  await evalJson(`(() => {
    const setValue = (el, value) => {
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
      Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setValue(document.querySelector('#sch-name'), 'ZezinhoRastreio');
    setValue(document.querySelector('#sch-phone'), '11988887777');
    setValue(document.querySelector('#sch-plate'), 'ABC1D23');
    document.querySelector('.schedule-form button[type="submit"]').click();
    return true;
  })()`);
  await sleep(200);

  await evalJson(`document.querySelector('a[href^="tel:"]').click()`);
  await evalJson(`document.querySelector('#nossas-lojas a[href*="waze.com"]').click()`);
  await evalJson(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await sleep(800);
  await evalJson(`window.dataLayer.push({ event: 'test_marker', av_source: 'test' }); window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`);
  await sleep(400);

  const report = await evalJson(`(() => {
    const appEvents = (window.dataLayer || []).filter((item) => item && item.av_source === 'app');
    const marker = (window.dataLayer || []).findIndex((item) => item && item.event === 'test_marker');
    const afterMarker = (window.dataLayer || []).slice(marker + 1).filter((item) => item && item.av_source === 'app');
    return {
      path: location.pathname,
      events: appEvents,
      afterMarker,
      fbq: window.__fbqCalls,
      gtag: window.__gtagCalls,
      interest: JSON.parse(localStorage.getItem('av_campinas_interest') || '[]'),
      dumped: JSON.stringify(appEvents),
    };
  })()`);

  const names = report.events.map((item) => item.event);
  const find = (event, pred = () => true) => report.events.find((item) => item.event === event && pred(item));
  assert(report.path === '/vistoria-cautelar', `rota do serviço, veio ${report.path}`);
  assert(find('service_view', (item) => item.service_id === 'vistoria-premium'), 'service_view do Premium');
  assert(
    find('service_click', (item) => item.service_id === 'vistoria-cautelar' && item.button_location === 'card_destaque'),
    'service_click da Cautelar'
  );
  assert(find('spa_navigation', (item) => item.page_path === '/vistoria-cautelar'), 'spa_navigation');
  assert(
    find('whatsapp_click', (item) => item.button_location === 'lp_hero' && item.service_name === 'Cautelar'),
    'whatsapp do hero do serviço'
  );
  for (const [serviceName, location] of [
    ['Cautelar', 'atendimento_movel'],
    ['Scanner de KM', 'atendimento_movel'],
    ['Certificado Bateria', 'atendimento_movel'],
  ]) {
    const hits = report.events.filter(
      (item) => item.event === 'whatsapp_click' && item.button_location === location && item.service_name === serviceName
    );
    assert(hits.length === 1, `whatsapp_click ${serviceName} em ${location} veio ${hits.length} vez(es)`);
  }
  assert(
    find('whatsapp_click', (item) => item.button_location === 'formulario' && item.service_name === 'Cautelar'),
    'whatsapp do formulário'
  );
  assert(find('phone_click', (item) => item.button_location === 'topbar'), 'phone_click');
  assert(
    find('map_click', (item) => item.map_provider === 'waze' && item.unit_id),
    'map_click do Waze'
  );
  for (const percent of [25, 50, 75, 90]) {
    assert(
      report.afterMarker.some((item) => item.event === 'scroll_depth' && item.percent === percent),
      `scroll_depth ${percent}`
    );
  }
  assert(report.events.every((item) => item.traffic_source === 'google_ads'), 'origem do clique');
  assert(report.events.every((item) => item.gclid === 'TeSt-click_123'), 'gclid nos eventos');
  assert(report.events.every((item) => item.utm_campaign === 'campinas'), 'utm_campaign nos eventos');
  assert(!names.includes('page_view') && !names.includes('scroll') && !names.includes('click'), 'sem evento automático');
  assert(!report.dumped.includes('ZezinhoRastreio'), 'nome fora dos eventos');
  assert(!report.dumped.includes('11988887777'), 'telefone fora dos eventos');
  assert(!report.dumped.includes('ABC1D23'), 'placa fora dos eventos');
  assert(report.interest.includes('vistoria-premium'), 'interesse guardado');
  assert(
    report.fbq.some((call) => call[0] === 'track' && call[1] === 'ViewContent' && call[2]?.content_category === 'servico'),
    'Meta ViewContent'
  );
  assert(
    report.fbq.filter((call) => call[0] === 'track' && call[1] === 'PageView').length === 4,
    'um PageView por troca de rota'
  );
  assert(report.fbq.some((call) => call[0] === 'track' && call[1] === 'Contact'), 'Meta Contact');
  assert(report.fbq.some((call) => call[0] === 'track' && call[1] === 'Lead'), 'Meta Lead');
  assert(report.fbq.some((call) => call[0] === 'trackCustom' && call[1] === 'ServiceClick'), 'Meta ServiceClick');
  assert(report.fbq.some((call) => call[0] === 'trackCustom' && call[1] === 'FindLocation'), 'Meta FindLocation');
  assert(report.fbq.some((call) => call[0] === 'trackCustom' && call[1] === 'ScrollDepth'), 'Meta ScrollDepth');
  assert(
    !report.gtag.some((call) => call[0] === 'event' && ['whatsapp_click', 'service_click', 'service_view', 'phone_click', 'map_click', 'address_click', 'scroll_depth', 'time_on_page', 'spa_navigation'].includes(call[1])),
    'código não repete o evento no gtag'
  );
  assert(!report.gtag.some((call) => call[1] === 'G-SK9H5S6H1K' || call[2]?.send_to === 'G-SK9H5S6H1K'), 'gtag não envia ao GA4');
  assert(exceptions.length === 0, `exceção na página: ${exceptions.join(' | ')}`);

  console.log(`eventos ok: ${[...new Set(names)].join(', ')}`);
  ws.close();
}

main()
  .then(() => {
    shutdown();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    shutdown();
    process.exit(1);
  });

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export { listSeoPages, canonicalUrl, breadcrumbJsonLd, faqJsonLd, sitemapXml, listRedirects } from './seo/pages';

/**
 * Renderiza o primeiro paint da rota, sem useEffect e sem o módulo de tracking.
 * O HTML resultante é o que o cliente hidrata.
 */
export function render(pathname: string): string {
  installDom(pathname);
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function installDom(pathname: string) {
  const path = pathname === '' || pathname === '/' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`;
  const origin = 'https://campinas.autovisao.com';
  const href = origin + (path === '/' ? '/' : path);
  const windowStub = {
    location: {
      href,
      pathname: path,
      search: '',
      hash: '',
      origin,
      assign() {},
    },
    history: { pushState() {}, replaceState() {}, state: null },
    scrollTo() {},
    scrollY: 0,
    innerHeight: 900,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    setInterval: globalThis.setInterval.bind(globalThis),
    clearInterval: globalThis.clearInterval.bind(globalThis),
  };
  const storage = () => {
    const data = new Map<string, string>();
    return {
      getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
      setItem: (key: string, value: string) => {
        data.set(key, String(value));
      },
      removeItem: (key: string) => {
        data.delete(key);
      },
    };
  };
  const g = globalThis as typeof globalThis & {
    window: typeof windowStub;
    document: unknown;
    localStorage: ReturnType<typeof storage>;
    sessionStorage: ReturnType<typeof storage>;
    navigator: { userAgent: string };
  };
  g.window = windowStub;
  g.document = {
    title: '',
    referrer: '',
    visibilityState: 'hidden',
    documentElement: { scrollHeight: 4000, style: {} },
    body: null,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }),
  };
  g.localStorage = storage();
  g.sessionStorage = storage();
}

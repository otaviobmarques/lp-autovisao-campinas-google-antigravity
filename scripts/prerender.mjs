import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const server = await loadServer();
const { render, listSeoPages, canonicalUrl, breadcrumbJsonLd, faqJsonLd, sitemapXml } = server;

if (!template.includes("fbq('track', 'PageView')")) {
  throw new Error('O template de build não tem o PageView do Pixel.');
}
if ((template.match(/fbq\('track', 'PageView'\)/g) || []).length !== 1) {
  throw new Error('O template não pode ter mais de um PageView.');
}

const pages = listSeoPages();
const titles = new Set();
const rows = [];

for (const page of pages) {
  installWindow(page.path);
  const body = render(page.path);
  const html = applyHead(template, page).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const targets = page.path
    ? [join(dist, page.path, 'index.html'), join(dist, `${page.path}.html`)]
    : [join(dist, 'index.html')];
  for (const file of targets) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }
  const row = inspect(html, page);
  if (!row.titleOk || !row.canonicalOk || !row.h1Ok || row.textChars < 2500) {
    const { text, ...summary } = row;
    throw new Error(`Pré-render fraco em /${page.path || ''}: ${JSON.stringify(summary)}`);
  }
  if (row.h1Count !== 1) {
    throw new Error(`A rota /${page.path || ''} tem ${row.h1Count} H1`);
  }
  assertPageCopy(page.path, html);
  if ((html.match(/fbq\('track', 'PageView'\)/g) || []).length !== 1) {
    throw new Error(`PageView duplicado em /${page.path || ''}`);
  }
  if (titles.has(page.title)) throw new Error(`Title repetido: ${page.title}`);
  titles.add(page.title);
  rows.push(row);
}

const homeText = rows.find((row) => row.path === '')?.text;
for (const path of ['sobre-nos', 'nossos-servicos', 'nossas-lojas', 'nosso-contato']) {
  const row = rows.find((item) => item.path === path);
  if (!row || row.text === homeText) {
    throw new Error(`O texto visível de /${path} continua igual ao da home`);
  }
}

writeFileSync(join(dist, 'sitemap.xml'), sitemapXml(pages));
writeFileSync(join(dist, '404.html'), notFoundPage(template));

console.log('\nSSG');
console.log('path | title | canonical | h1 | chars');
for (const row of rows) {
  console.log(`${row.path || '/'} | ${row.titleOk ? 'ok' : 'FALHOU'} | ${row.canonical} | ${row.h1.slice(0, 48)} | ${row.textChars}`);
}
console.log(`rotas: ${rows.length}`);

function inspect(html, page) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '';
  const h1Raw = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
  const h1 = h1Raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const body = (html.match(/<body[\s\S]*<\/body>/) || [''])[0];
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    path: page.path,
    titleOk: title === page.title,
    canonical,
    canonicalOk: canonical === canonicalUrl(page.path),
    h1,
    h1Ok: h1.includes(page.h1),
    h1Count: (html.match(/<h1\b/g) || []).length,
    text,
    textChars: text.length,
  };
}

function assertPageCopy(path, html) {
  const mobile = {
    'vistoria-cautelar': [
      'id="no-seu-endereco"',
      'Atendimento no seu endereço em Campinas',
      'Não dá para levar o carro até a loja?',
      'Agendar no meu endereço',
      'Olá! Quero agendar a Vistoria Cautelar no meu endereço em Campinas.',
    ],
    'vistoria-km-scanner': [
      'id="no-seu-endereco"',
      'Scanner de KM no seu endereço',
      'Vai olhar o carro na casa do vendedor?',
      'Agendar no meu endereço',
      'Olá! Quero agendar o Scanner de KM no meu endereço em Campinas.',
    ],
    'vistoria-bateria-eletricos': [
      'id="no-seu-endereco"',
      'Laudo de bateria no seu endereço',
      'Para elétricos e híbridos plug-in compatíveis',
      'Confirmar meu modelo',
      'Olá! Quero o laudo de bateria no meu endereço. Meu carro é: ',
      'O laudo de bateria é feito em qualquer uma das 5 lojas ou no seu endereço.',
    ],
  };
  const note = 'Atendimento com agendamento. Confirme no WhatsApp a disponibilidade de horário e as condições do atendimento móvel.';
  if (mobile[path]) {
    for (const snippet of [...mobile[path], note]) {
      if (!html.includes(snippet) && !html.includes(encodeURIComponent(snippet))) {
        throw new Error(`Texto ausente em /${path}: ${snippet}`);
      }
    }
  }
}

function applyHead(source, page) {
  const url = canonicalUrl(page.path);
  let html = source.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.ogDescription);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.ogDescription);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  const extra = [breadcrumbJsonLd(page), faqJsonLd(page)]
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
  return html.replace('</head>', `${extra}\n</head>`);
}

function replaceMeta(html, attr, key, value) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*\\/?>`);
  if (!pattern.test(html)) throw new Error(`Meta ausente: ${key}`);
  return html.replace(pattern, `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function notFoundPage(source) {
  const head = (source.match(/<head>[\s\S]*<\/head>/) || [''])[0].replace(
    /<title>[^<]*<\/title>/,
    '<title>Página não encontrada | Auto Visão Campinas</title>'
  ).replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex" />');
  return `<!doctype html>
<html lang="pt-BR">
${head}
<body>
  <main>
    <h1>Página não encontrada</h1>
    <p>Esse endereço não existe na Auto Visão Campinas. Volte para a página inicial e escolha a vistoria ou a loja.</p>
    <p><a href="/">Ir para campinas.autovisao.com</a></p>
  </main>
</body>
</html>
`;
}

async function loadServer() {
  const esmUrl = new URL('../dist-ssr/entry-server.js', import.meta.url);
  try {
    return await import(esmUrl.href);
  } catch (error) {
    if (error && error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
    return require(join(root, 'dist-ssr/entry-server.js'));
  }
}

function installWindow(pathname) {
  const path = pathname ? `/${pathname}` : '/';
  globalThis.window = {
    location: {
      href: `https://campinas.autovisao.com${path === '/' ? '/' : path}`,
      pathname: path,
      search: '',
      hash: '',
      origin: 'https://campinas.autovisao.com',
      assign() {},
    },
    history: { pushState() {}, replaceState() {} },
    scrollTo() {},
    scrollY: 0,
    innerHeight: 900,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
  };
}

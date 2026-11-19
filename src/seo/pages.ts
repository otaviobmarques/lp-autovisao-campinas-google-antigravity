import { FAQ_ITEMS, VISTORIA_SERVICES, type VistoriaService } from '../data/campinasData';

export const SITE_ORIGIN = 'https://campinas.autovisao.com';

export const SITELINK_SECTIONS: Record<string, string> = {
  'sobre-nos': 'sobre-nos',
  sobre: 'sobre-nos',
  'nossos-servicos': 'nossos-servicos',
  servicos: 'nossos-servicos',
  'nossas-lojas': 'nossas-lojas',
  lojas: 'nossas-lojas',
  unidades: 'nossas-lojas',
  'nosso-contato': 'nosso-contato',
  contato: 'nosso-contato',
  agendamento: 'nosso-contato',
};

const HOME_TITLE = 'Vistoria Veicular em Campinas | 5 Lojas Credenciadas DETRAN-SP | Auto Visão®';
const HOME_DESCRIPTION =
  'Auto Visão Campinas: 5 lojas credenciadas pelo DETRAN-SP (Taquaral, Centro, Ponte Preta/Abolição, Campos Elíseos e Parque Industrial). Vistoria do DETRAN (Transferência), Vistoria Cautelar, Vistoria 360º®, Pintura, Scanner de KM, Bateria Elétricos/Híbridos, Pesados, Financeira, Seguradora, Proteção Automotiva, Pátio Público, Infração e Premium. Plantão aos sábados até 16h!';
const HOME_OG =
  'Vistoria do DETRAN, Cautelar, Vistoria 360º® (+180 itens), Pintura, Scanner de KM, Bateria Elétricos, Pesados, Seguradora e Premium. 5 unidades em Campinas e plantão aos sábados até 16h. Agende no WhatsApp (19) 99224-8383!';

const SITELINK_COPY: Record<string, { title: string; description: string; h1: string }> = {
  'sobre-nos': {
    title: 'Sobre Nós | Auto Visão Campinas | Desde 2006',
    description:
      'A Auto Visão nasceu em Campinas em 2006. 5 lojas credenciadas pelo DETRAN-SP, certificação ISO 9001 e laudo na hora. WhatsApp (19) 99224-8383.',
    h1: 'Auto Visão em Campinas desde 2006',
  },
  'nossos-servicos': {
    title: 'Serviços de Vistoria Veicular em Campinas | Auto Visão®',
    description:
      'Vistoria do DETRAN, Cautelar, 360º®, Pintura, Scanner de KM, Bateria EV, Pesados, Seguradora, Financeira e Premium. Escolha o laudo e agende nas 5 lojas de Campinas.',
    h1: 'Serviços de vistoria em Campinas',
  },
  'nossas-lojas': {
    title: '5 Lojas da Auto Visão em Campinas | DETRAN-SP',
    description:
      'Taquaral, Centro, Ponte Preta/Abolição (plantão sábado até 16h), Campos Elíseos e Parque Industrial. Endereço, mapa e WhatsApp (19) 99224-8383.',
    h1: '5 lojas da Auto Visão em Campinas',
  },
  'nosso-contato': {
    title: 'Contato e Agendamento | Auto Visão Campinas',
    description:
      'Agende sua vistoria em Campinas pelo WhatsApp (19) 99224-8383 ou pelo telefone (19) 3271-1700. Atendimento nas 5 lojas credenciadas pelo DETRAN-SP.',
    h1: 'Fale com a Auto Visão Campinas',
  },
};

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  ogDescription: string;
  h1: string;
  faqs: { q: string; a: string }[];
};

export function canonicalUrl(path: string): string {
  return path ? `${SITE_ORIGIN}/${path}` : `${SITE_ORIGIN}/`;
}

export function listSeoPages(): SeoPage[] {
  const home: SeoPage = {
    path: '',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    ogDescription: HOME_OG,
    h1: 'com zero surpresas',
    faqs: FAQ_ITEMS,
  };

  const services = VISTORIA_SERVICES.map((service) => pageForService(service));

  const sitelinks = Object.entries(SITELINK_COPY).map(([path, copy]) => ({
    path,
    title: copy.title,
    description: copy.description,
    ogDescription: copy.description,
    h1: copy.h1,
    faqs: FAQ_ITEMS,
  }));

  return [home, ...services, ...sitelinks];
}

export function seoForPath(pathname: string): SeoPage | null {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const direct = listSeoPages().find((page) => page.path === clean);
  if (direct) return direct;
  const sitelink = SITELINK_SECTIONS[clean];
  if (sitelink) return listSeoPages().find((page) => page.path === sitelink) ?? null;
  const service = VISTORIA_SERVICES.find(
    (item) => item.slug === clean || item.id === clean || item.aliases.includes(clean)
  );
  return service ? pageForService(service) : null;
}

export function listRedirects(): { source: string; destination: string; permanent: true }[] {
  const redirects: { source: string; destination: string; permanent: true }[] = [];
  for (const [alias, target] of Object.entries(SITELINK_SECTIONS)) {
    if (alias !== target) {
      redirects.push({ source: `/${alias}`, destination: `/${target}`, permanent: true });
    }
  }
  for (const service of VISTORIA_SERVICES) {
    for (const alias of service.aliases) {
      if (alias !== service.slug) {
        redirects.push({ source: `/${alias}`, destination: `/${service.slug}`, permanent: true });
      }
    }
  }
  return redirects;
}

export function breadcrumbJsonLd(page: SeoPage) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Auto Visão Campinas',
      item: canonicalUrl(''),
    },
  ];
  if (page.path) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: page.title.split('|')[0].trim(),
      item: canonicalUrl(page.path),
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function faqJsonLd(page: SeoPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function sitemapXml(pages: SeoPage[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((page) => {
      const priority = page.path === '' ? '1.0' : page.path.startsWith('vistoria-') ? '0.9' : '0.8';
      return `  <url>
    <loc>${canonicalUrl(page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function pageForService(service: VistoriaService): SeoPage {
  const description = `${service.title} em Campinas/SP: ${service.summary} 5 lojas credenciadas pelo DETRAN-SP. Agende no WhatsApp (19) 99224-8383!`;
  return {
    path: service.slug,
    title: `${service.title} em Campinas | 5 Lojas DETRAN-SP | Auto Visão®`,
    description,
    ogDescription: description,
    h1: service.headlineBold,
    faqs: service.faqs.length ? service.faqs : FAQ_ITEMS,
  };
}

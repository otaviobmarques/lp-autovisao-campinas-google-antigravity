import React, { useState, useEffect, useMemo } from 'react';
import { SvgSprites, Icon } from './components/SvgSprites';
import { ServiceHeroIllustration } from './components/ServiceHeroIllustration';
import {
  CAMPINAS_UNITS,
  VISTORIA_SERVICES,
  PUBLIC_MAIN_SERVICES,
  FAQ_ITEMS,
  WA_DISPLAY,
  CENTRAL_DISPLAY,
  CENTRAL_TEL,
  buildWhatsAppUrl,
  findServiceBySlug,
  VistoriaService,
} from './data/campinasData';

const SITELINK_SECTIONS: Record<string, string> = {
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

const TOP_4_IDS = [
  'vistoria-detran',
  'vistoria-cautelar',
  'vistoria-km-scanner',
  'vistoria-bateria-eletricos',
];

function resolveInitialRoute(): { service: VistoriaService | null; sectionToScroll: string | null } {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('servico') || params.get('lp') || params.get('service');
    if (fromQuery) {
      const hit = findServiceBySlug(fromQuery);
      if (hit) return { service: hit, sectionToScroll: null };
    }
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (path) {
      const segments = path.split('/');
      const last = segments[segments.length - 1];
      if (SITELINK_SECTIONS[last]) {
        return { service: null, sectionToScroll: SITELINK_SECTIONS[last] };
      }
      const hit = findServiceBySlug(last) || findServiceBySlug(path);
      if (hit) return { service: hit, sectionToScroll: null };
    }
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash) {
      if (SITELINK_SECTIONS[hash]) {
        return { service: null, sectionToScroll: SITELINK_SECTIONS[hash] };
      }
      const hit = findServiceBySlug(hash);
      if (hit) return { service: hit, sectionToScroll: null };
    }
  } catch {
    // ignore
  }
  return { service: null, sectionToScroll: null };
}

export function App() {
  const [activeLpService, setActiveLpService] = useState<VistoriaService | null>(
    () => resolveInitialRoute().service
  );

  // Hero Carousel State (3 crisp slides)
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // Services Category Filter State (for secondary services)
  const [serviceTab, setServiceTab] = useState<string>('all');

  // Wizard ("Qual vistoria eu preciso?" — Exclusivo Pessoa Física)
  const [wzGoal, setWzGoal] = useState<string>('comprar');
  const [wzVeh, setWzVeh] = useState<string>('carro');

  // Mobile Bottom Sheet State ('enderecos' | 'servicos' | null)
  const [mobileSheet, setMobileSheet] = useState<'enderecos' | 'servicos' | null>(null);

  // Copy feedback for Google Ads LP URLs
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Unit Locator Filter State
  const [unitSearch, setUnitSearch] = useState('');
  const [onlySatDuty, setOnlySatDuty] = useState(false);

  // Header & Scroll State
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Quick Pre-Schedule Form State (PF services)
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formService, setFormService] = useState(
    () => resolveInitialRoute().service?.title || 'Vistoria Cautelar Completa'
  );
  const [formUnit, setFormUnit] = useState('Campinas · Ponte Preta (Abolição)');
  const [formDate, setFormDate] = useState('');

  // Cookie & Privacy Modal State
  const [cookieBanner, setCookieBanner] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Real-time Brasília Time for Open/Closed Status on 5 Units
  const [spTime, setSpTime] = useState<{ d: number; h: number }>({ d: 2, h: 10 });

  useEffect(() => {
    const updateTime = () => {
      try {
        const parts = Object.fromEntries(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Sao_Paulo',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23',
          })
            .formatToParts(new Date())
            .map((x) => [x.type, x.value])
        );
        const days: Record<string, number> = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };
        setSpTime({ d: days[parts.weekday] ?? 1, h: +parts.hour + +parts.minute / 60 });
      } catch {
        // Fallback
      }
    };
    updateTime();
    const t = setInterval(updateTime, 60000);
    return () => clearInterval(t);
  }, []);

  // Scroll to Sitelink section if initial URL was /sobre-nos, /nossos-servicos, /nossas-lojas or /nosso-contato
  useEffect(() => {
    const init = resolveInitialRoute();
    if (init.sectionToScroll) {
      setTimeout(() => {
        document.getElementById(init.sectionToScroll!)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  // Listen to browser navigation (popstate / hashchange)
  useEffect(() => {
    const onRouteChange = () => {
      const { service, sectionToScroll } = resolveInitialRoute();
      setActiveLpService(service);
      if (service) {
        setFormService(service.title);
      } else if (sectionToScroll) {
        setTimeout(() => {
          document.getElementById(sectionToScroll)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    };
    window.addEventListener('popstate', onRouteChange);
    window.addEventListener('hashchange', onRouteChange);
    return () => {
      window.removeEventListener('popstate', onRouteChange);
      window.removeEventListener('hashchange', onRouteChange);
    };
  }, []);

  // Dynamic SEO Title & Meta Description for Google Ads Quality Score
  useEffect(() => {
    const descMeta = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (activeLpService) {
      const title = `${activeLpService.title} em Campinas | 5 Lojas DETRAN-SP | Auto Visão®`;
      document.title = title;
      if (descMeta) {
        descMeta.setAttribute(
          'content',
          `${activeLpService.title} em Campinas/SP: ${activeLpService.summary} 5 lojas credenciadas pelo DETRAN-SP. Agende no WhatsApp (19) 99224-8383!`
        );
      }
      if (ogTitle) ogTitle.setAttribute('content', title);
    } else {
      const defaultTitle =
        'Vistoria Veicular em Campinas | 5 Lojas Credenciadas DETRAN-SP | Auto Visão®';
      document.title = defaultTitle;
      if (ogTitle) ogTitle.setAttribute('content', defaultTitle);
    }
  }, [activeLpService]);

  const navigateToLp = (svc: VistoriaService | null, targetSectionId?: string) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileSheet(null);
    setActiveLpService(svc);
    if (svc) {
      setFormService(svc.title);
      window.history.pushState({}, '', `/${svc.slug}${window.location.search}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetSectionId) {
      window.history.pushState({}, '', `/${targetSectionId}${window.location.search}`);
      setTimeout(() => {
        document.getElementById(targetSectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.history.pushState({}, '', `/${window.location.search}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isUnitOpen = (satCloseHour: number) => {
    const { d, h } = spTime;
    if (d >= 1 && d <= 5) return h >= 8 && h < 18;
    if (d === 6) return h >= 8 && h < satCloseHour;
    return false;
  };

  // Hero Auto-Play (3 slides)
  useEffect(() => {
    if (heroPaused || activeLpService) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroPaused, activeLpService]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 10);
      setScrollProgress(max > 0 ? y / max : 0);
      setShowToTop(y > 650);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cookie Consent check
  useEffect(() => {
    try {
      const saved = localStorage.getItem('av_campinas_consent');
      if (!saved) {
        const timer = setTimeout(() => setCookieBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCookieConsent = (choice: string) => {
    try {
      localStorage.setItem('av_campinas_consent', choice);
    } catch {
      // ignore
    }
    setCookieBanner(false);
  };

  // Top 4 Spotlight Services
  const top4Services = useMemo(
    () => TOP_4_IDS.map((id) => VISTORIA_SERVICES.find((s) => s.id === id)!).filter(Boolean),
    []
  );

  // Secondary PF Services (avoiding repetition with Top 4 unless filtered)
  const secondaryServices = useMemo(() => {
    const base = PUBLIC_MAIN_SERVICES.filter(
      (s) => s.id !== 'para-empresas' && !TOP_4_IDS.includes(s.id)
    );
    if (serviceTab === 'all') return base;
    return PUBLIC_MAIN_SERVICES.filter(
      (s) => s.id !== 'para-empresas' && s.category.includes(serviceTab as any)
    );
  }, [serviceTab]);

  // Wizard Recommendation Logic — EXCLUSIVO PESSOA FÍSICA
  const wizardRecommendation = useMemo(() => {
    if (wzGoal === 'transferir') {
      if (wzVeh === 'pesado') return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-pesados')!;
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-detran')!;
    }
    if (wzGoal === 'regularizar') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-infracao-transito')!;
    }
    if (wzGoal === 'patio') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-patio-publico')!;
    }
    if (wzVeh === 'eletrico') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-bateria-eletricos')!;
    }
    if (wzVeh === 'pesado') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-pesados')!;
    }
    if (wzVeh === 'premium') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-premium')!;
    }
    if (wzVeh === 'km') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-km-scanner')!;
    }
    if (wzVeh === 'pintura') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-pintura')!;
    }
    if (wzGoal === 'vender') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-cautelar')!;
    }
    return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360')!;
  }, [wzGoal, wzVeh]);

  // Filtered Campinas Units
  const filteredUnits = useMemo(() => {
    const q = unitSearch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    return CAMPINAS_UNITS.filter((u) => {
      if (onlySatDuty && !u.isSaturdayDuty) return false;
      if (!q) return true;
      const haystack = `${u.name} ${u.neighborhood} ${u.address} ${u.reference} ${u.detran}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [unitSearch, onlySatDuty]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria:\n\n` +
      `• *Serviço:* ${formService}\n` +
      `• *Unidade Campinas:* ${formUnit}\n` +
      (formName ? `• *Nome:* ${formName}\n` : '') +
      (formPhone ? `• *Telefone:* ${formPhone}\n` : '') +
      (formPlate ? `• *Veículo / Placa:* ${formPlate}\n` : '') +
      (formDate ? `• *Data/Período preferido:* ${formDate}\n` : '');
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener');
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileSheet(null);
    if (activeLpService && id !== 'nossas-lojas' && id !== 'nosso-contato') {
      navigateToLp(null, id);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2200);
  };

  return (
    <>
      <SvgSprites />
      <a className="skip" href="#main">
        Pular para o conteúdo principal
      </a>

      {/* TOPBAR OFICIAL ESCURA #151415 */}
      <div className="topbar">
        <div className="wrap">
          <ul>
            <li>
              <Icon name="store" />5 lojas em Campinas/SP
            </li>
            <li>
              <Icon name="shield" />
              Credenciadas pelo DETRAN-SP
            </li>
            <li>
              <Icon name="clock" />
              Plantão Sábado até 16h (Abolição)
            </li>
          </ul>
          <span className="tb-r">
            <a href={`tel:${CENTRAL_TEL}`} className="tb-area">
              <Icon name="phone" />
              Fixo {CENTRAL_DISPLAY}
            </a>
            <a
              href={buildWhatsAppUrl(
                activeLpService
                  ? activeLpService.whatsappMsg
                  : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
              )}
              target="_blank"
              rel="noopener"
            >
              <Icon name="wa" />
              WhatsApp {WA_DISPLAY}
            </a>
          </span>
        </div>
      </div>

      {/* HEADER LIMPO E OBJETIVO (5 ITENS ESSENCIAIS + CTA) */}
      <header className={`hdr ${scrolled ? 'sc' : ''}`}>
        <div className="wrap">
          <a
            className="logo"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToLp(null);
            }}
            aria-label="Auto Visão Vistorias Automotivas Campinas – Início"
          >
            <img
              src="/assets/img/logo-autovisao.svg"
              alt="Auto Visão Vistorias Automotivas Campinas"
              width="176"
              height="42"
            />
          </a>

          <button
            className="menu-btn"
            aria-expanded={mobileMenuOpen}
            aria-controls="nav"
            aria-label="Abrir menu de navegação"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} />
          </button>

          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`} id="nav" aria-label="Principal">
            {/* Dropdown Nossos Serviços */}
            <div className={`dd ${openDropdown === 'servicos' ? 'open' : ''}`} data-dd>
              <button
                className="dd-btn"
                type="button"
                aria-expanded={openDropdown === 'servicos'}
                onClick={() => setOpenDropdown((d) => (d === 'servicos' ? null : 'servicos'))}
              >
                Nossos Serviços
                <Icon name="chev" className="i dd-chev" />
              </button>
              <div className="dd-menu">
                {PUBLIC_MAIN_SERVICES.map((svc) => (
                  <a
                    key={svc.id}
                    href={`/${svc.slug}`}
                    aria-current={activeLpService?.id === svc.id ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToLp(svc);
                    }}
                  >
                    <Icon name={svc.icon} />
                    <span>{svc.shortTitle}</span>
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/nossas-lojas"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('nossas-lojas');
              }}
            >
              Nossas Lojas (5)
            </a>

            <a
              href="/sobre-nos"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('sobre-nos');
              }}
            >
              Sobre Nós
            </a>

            <a
              href="/nosso-contato"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('nosso-contato');
              }}
            >
              Contato
            </a>

            <a
              className="btn btn-sm btn-wa"
              href={buildWhatsAppUrl(
                activeLpService
                  ? activeLpService.whatsappMsg
                  : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
              )}
              target="_blank"
              rel="noopener"
            >
              <Icon name="wa" />
              <span>Agendar no WhatsApp</span>
            </a>
          </nav>

          <span
            className="progress"
            style={{ transform: `scaleX(${scrollProgress})` }}
            aria-hidden="true"
          />
        </div>
      </header>

      <main id="main">
        {/* =====================================================================
            MODO LANDING PAGE DEDICADA POR SERVIÇO (COM BANNER VISUAL DS!)
           ===================================================================== */}
        {activeLpService ? (
          <>
            <div className="lp-banner-top">
              <div className="wrap">
                <button type="button" className="lp-back-btn" onClick={() => navigateToLp(null)}>
                  <Icon name="arrowl" />
                  <span>Voltar para todos os serviços</span>
                </button>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                  <strong>{activeLpService.shortTitle}</strong> · Campinas/SP
                </span>
              </div>
            </div>

            <section className="hero svc-hero" aria-label={activeLpService.title}>
              <div className="slides">
                <div className={`slide ${activeLpService.heroTheme} is-on`}>
                  <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                    <use href="#rings" />
                  </svg>
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">{activeLpService.kicker}</span>
                      <h1 className="h-display">
                        <span className="lt">{activeLpService.headlineLight}</span>
                        {activeLpService.headlineBold}
                      </h1>
                      <p className="lead">{activeLpService.salesCopy}</p>
                      <div className="chips">
                        <span className="chip">
                          <Icon name="clock" /> Média de {activeLpService.timeEstimate}
                        </span>
                        <span className="chip">
                          <Icon name="store" /> 5 Lojas em Campinas
                        </span>
                      </div>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(activeLpService.whatsappMsg)}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agendar no WhatsApp {WA_DISPLAY}</span>
                        </a>
                        <a
                          className={
                            activeLpService.heroTheme === 'red'
                              ? 'btn btn-dark'
                              : 'btn btn-ghost-w'
                          }
                          href="#nossas-lojas"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('nossas-lojas');
                          }}
                        >
                          <Icon name="pin" />
                          <span>Ver 5 Lojas</span>
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId={activeLpService.id} />
                  </div>
                </div>
              </div>
              <div className="strip" style={{ ['--h' as any]: '36px' }} aria-hidden="true" />
            </section>

            {/* RESUMO DIRETO DO SERVIÇO (2 COLUNAS QUE EMPILHAM NO MOBILE) */}
            <section className="sec">
              <div className="wrap">
                <div className="sec-head">
                  <span className="kicker">O que está incluso</span>
                  <h2 className="h2">
                    <span className="lt">Entenda em 30 segundos a</span> {activeLpService.shortTitle}
                  </h2>
                  <p className="lead">{activeLpService.idealFor}</p>
                </div>

                <div className="lp-two-cols">
                  <div className="box">
                    <h3>
                      <Icon name="check" /> O que é inspecionado
                    </h3>
                    <ul>
                      {activeLpService.checklist.map((c, idx) => (
                        <li key={idx}>
                          <Icon name="check" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="box dk">
                    <h3>
                      <Icon name="file" /> O que você recebe na hora
                    </h3>
                    <ul>
                      {activeLpService.deliverables.map((d, idx) => (
                        <li key={idx}>
                          <Icon name="check" />
                          <span>{d}</span>
                        </li>
                      ))}
                      <li>
                        <Icon name="clock" />
                        <span>Tempo estimado em loja: {activeLpService.timeEstimate}</span>
                      </li>
                    </ul>
                    <div className="ctas" style={{ marginTop: 20 }}>
                      <a
                        className="btn btn-wa"
                        style={{ width: '100%' }}
                        href={buildWhatsAppUrl(activeLpService.whatsappMsg)}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar pelo WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* UPSELL ENXUTO PARA SCANNER DE MÓDULO & BATERIA EV */}
                {activeLpService.id !== 'vistoria-km-scanner' &&
                  activeLpService.id !== 'vistoria-bateria-eletricos' && (
                    <div className="pj-strip" style={{ marginTop: 28, border: '2px solid var(--brand)' }}>
                      <div>
                        <span className="kicker" style={{ color: '#fff' }}>
                          Dica dos Peritos Auto Visão
                        </span>
                        <h3>
                          <span className="lt" style={{ fontWeight: 300 }}>
                            Quer proteção eletrônica total?
                          </span>{' '}
                          Inclua Scanner de KM Real ou Bateria EV
                        </h3>
                        <p>
                          Na mesma visita, conferimos a quilometragem real gravada nos módulos do
                          carro ou emitimos o Certificado AVILOO da bateria de elétricos e híbridos.
                        </p>
                        <div className="pj-pills">
                          <a
                            href="/vistoria-km-scanner"
                            className="pj-pill"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToLp(
                                VISTORIA_SERVICES.find((s) => s.id === 'vistoria-km-scanner') ||
                                  null
                              );
                            }}
                          >
                            <Icon name="gauge" /> Scanner de Módulo (KM Real)
                          </a>
                          <a
                            href="/vistoria-bateria-eletricos"
                            className="pj-pill"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToLp(
                                VISTORIA_SERVICES.find(
                                  (s) => s.id === 'vistoria-bateria-eletricos'
                                ) || null
                              );
                            }}
                          >
                            <Icon name="battery" /> Bateria EV / Híbridos (AVILOO)
                          </a>
                        </div>
                      </div>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            `Olá! Quero agendar a ${activeLpService.shortTitle} junto com o Scanner de Módulo / Bateria EV.`
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Incluir na Visita</span>
                        </a>
                      </div>
                    </div>
                  )}

                <div style={{ marginTop: 36 }}>
                  <p style={{ fontWeight: 800, marginBottom: 12, color: 'var(--impact)' }}>
                    Outras vistorias em Campinas:
                  </p>
                  <div className="pills">
                    {PUBLIC_MAIN_SERVICES.filter((s) => s.id !== activeLpService.id).map((s) => (
                      <a
                        key={s.id}
                        href={`/${s.slug}`}
                        className="pill"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(s);
                        }}
                      >
                        <Icon name={s.icon} />
                        <span>{s.shortTitle}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* =====================================================================
              HOME SIMPLES, LEVE E FÁCIL DE DECIDIR (UX EXPERIENCE)
             ===================================================================== */
          <>
            {/* 1. HERO ENXUTO (3 BANNERS CLAROS) */}
            <section
              className={`hero ${heroPaused ? 'paused' : ''}`}
              id="inicio"
              aria-roledescription="carrossel"
              aria-label="Destaques Auto Visão Campinas"
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
            >
              <div className="slides">
                {/* SLIDE 1: DETRAN + CAUTELAR */}
                <div
                  className={`slide red ${heroSlide === 0 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="1 de 3"
                  aria-hidden={heroSlide !== 0}
                >
                  <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                    <use href="#rings" />
                  </svg>
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">5 Lojas Credenciadas DETRAN-SP em Campinas</span>
                      <h1 className="h-display">
                        <span className="lt">Compre e transfira seu carro</span>com zero surpresas.
                      </h1>
                      <p className="lead">
                        Vistoria Cautelar contra leilão, sinistro e batida estrutural + Vistoria
                        Oficial do DETRAN na hora em 30 minutos.
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma vistoria.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agendar no WhatsApp {WA_DISPLAY}</span>
                        </a>
                        <a
                          className="btn btn-dark"
                          href="#nossas-lojas"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('nossas-lojas');
                          }}
                        >
                          <Icon name="pin" />
                          <span>Ver as 5 Lojas</span>
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-cautelar" />
                  </div>
                </div>

                {/* SLIDE 2: SCANNER DE MÓDULO (KM REAL) & BATERIA EV */}
                <div
                  className={`slide dark ${heroSlide === 1 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="2 de 3"
                  aria-hidden={heroSlide !== 1}
                >
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">Diagnóstico Eletrônico Exclusivo</span>
                      <h2 className="h-display">
                        <span className="lt">Scanner de KM Real</span>e Saúde da Bateria EV.
                      </h2>
                      <p className="lead">
                        Descubra se adulteraram a quilometragem nos módulos do carro ou certifique a
                        bateria do seu elétrico/híbrido com laudo AVILOO.
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Quero agendar Scanner de Módulo (KM Real) / Vistoria de Bateria EV em Campinas.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agendar Scanner / Bateria EV</span>
                        </a>
                        <a
                          className="btn btn-ghost-w"
                          href="/vistoria-km-scanner"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToLp(
                              VISTORIA_SERVICES.find((s) => s.id === 'vistoria-km-scanner') || null
                            );
                          }}
                        >
                          Como funciona
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-km-scanner" />
                  </div>
                </div>

                {/* SLIDE 3: VISTORIA 360º® */}
                <div
                  className={`slide red ${heroSlide === 2 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="3 de 3"
                  aria-hidden={heroSlide !== 2}
                >
                  <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                    <use href="#rings" />
                  </svg>
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">Exclusiva Auto Visão®</span>
                      <h2 className="h-display">
                        <span className="lt">Nossa Vistoria 360º®:</span>+180 itens passados a
                        limpo.
                      </h2>
                      <p className="lead">
                        Estrutura, pintura peça a peça, vídeo no WhatsApp e scanner de módulos em um
                        único laudo completo.
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Quero agendar a Nossa Vistoria 360º® em Campinas.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agendar Vistoria 360º®</span>
                        </a>
                        <a
                          className="btn btn-dark"
                          href="/vistoria-360"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToLp(
                              VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null
                            );
                          }}
                        >
                          Ver detalhes
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-360" />
                  </div>
                </div>
              </div>

              <div className="hero-ctrl">
                <div className="wrap">
                  <div className="dots" role="group" aria-label="Escolher banner">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        className="dot"
                        aria-label={`Banner ${idx + 1}`}
                        aria-current={heroSlide === idx}
                        onClick={() => setHeroSlide(idx)}
                      />
                    ))}
                  </div>
                  <div className="arrows">
                    <button
                      className="arw"
                      aria-label="Banner anterior"
                      onClick={() => setHeroSlide((s) => (s - 1 + 3) % 3)}
                    >
                      <Icon name="arrowl" />
                    </button>
                    <button
                      className="arw"
                      aria-label="Próximo banner"
                      onClick={() => setHeroSlide((s) => (s + 1) % 3)}
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="strip" style={{ ['--h' as any]: '36px' }} aria-hidden="true" />
            </section>

            {/* 2. FAIXA RÁPIDA DE CONFIANÇA */}
            <section className="trust" aria-label="Diferenciais em Campinas">
              <div className="wrap">
                <ul>
                  <li>
                    <span className="ico">
                      <Icon name="store" />
                    </span>
                    <div>
                      <strong>5 lojas em Campinas</strong>
                      <span>Taquaral · Centro · Abolição · C. Elíseos · Amoreiras</span>
                    </div>
                  </li>
                  <li>
                    <span className="ico">
                      <Icon name="shield" />
                    </span>
                    <div>
                      <strong>Credenciadas DETRAN-SP</strong>
                      <span>Laudo oficial emitido na hora</span>
                    </div>
                  </li>
                  <li>
                    <span className="ico">
                      <Icon name="gauge" />
                    </span>
                    <div>
                      <strong>Scanner KM & Bateria EV</strong>
                      <span>Diagnóstico de módulos e AVILOO</span>
                    </div>
                  </li>
                  <li>
                    <span className="ico">
                      <Icon name="clock" />
                    </span>
                    <div>
                      <strong>Plantão Sábado até 16h</strong>
                      <span>Na unidade Ponte Preta (Abolição)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. NOSSOS SERVIÇOS — TUDO EM UM SÓ LUGAR, FÁCIL E SEM REPETIÇÃO */}
            <section className="sec" id="nossos-servicos">
              <div className="wrap">
                <div className="sec-head center">
                  <span className="kicker">Nossos Serviços em Campinas</span>
                  <h2 className="h2">
                    <span className="lt">As 4 vistorias que</span> mais protegem o seu veículo
                  </h2>
                  <p className="lead">
                    Escolha abaixo para agendar direto no WhatsApp ou abrir a página com todos os
                    detalhes.
                  </p>
                </div>

                {/* GRID 2x2 LIMPO: DETRAN, CAUTELAR, SCANNER KM E BATERIA EV */}
                <div className="flagship-grid">
                  {top4Services.map((svc) => {
                    const isRed =
                      svc.id === 'vistoria-cautelar' || svc.id === 'vistoria-km-scanner';
                    const isEv = svc.id === 'vistoria-bateria-eletricos';
                    return (
                      <article
                        key={svc.id}
                        id={svc.id}
                        className={`flagship-card compact ${isRed ? 'cautelar' : 'detran'} ${
                          isEv ? 'highlight-ev' : ''
                        }`}
                      >
                        {isRed && (
                          <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                            <use href="#rings" />
                          </svg>
                        )}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <span className="kicker">{svc.badge}</span>
                          <h3 style={{ marginTop: 10 }}>{svc.shortTitle}</h3>
                          <p style={{ marginTop: 8 }}>{svc.summary}</p>
                        </div>
                        <div
                          className="ctas"
                          style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}
                        >
                          <a
                            className={isRed && svc.id === 'vistoria-cautelar' ? 'btn btn-dark' : 'btn btn-wa'}
                            href={buildWhatsAppUrl(svc.whatsappMsg)}
                            target="_blank"
                            rel="noopener"
                          >
                            <Icon name="wa" />
                            <span>Agendar</span>
                          </a>
                          <a
                            className="btn btn-ghost-w"
                            href={`/${svc.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToLp(svc);
                            }}
                          >
                            Ver detalhes
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* OUTRAS VISTORIAS (CARDS COMPACTOS E FÁCEIS DE LER) */}
                <div style={{ marginTop: 48 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      marginBottom: 20,
                    }}
                  >
                    <h3 className="h3">Outras vistorias disponíveis em Campinas</h3>
                    <div className="tabs" style={{ margin: 0 }} role="group" aria-label="Filtrar">
                      {[
                        { id: 'all', label: 'Mais Serviços' },
                        { id: 'avancada', label: '360º®, Pintura e Premium' },
                        { id: 'transferir', label: 'Infração e Pátio' },
                        { id: 'pesados', label: 'Caminhões e Pesados' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className="tab"
                          aria-pressed={serviceTab === t.id}
                          onClick={() => setServiceTab(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid-sv">
                    {secondaryServices.map((svc) => (
                      <article key={svc.id} id={`card-${svc.id}`} className="sv">
                        <div className="sv-top">
                          <span className="ico">
                            <Icon name={svc.icon} />
                          </span>
                          <span
                            className={`badge ${
                              svc.badgeVariant === 'dark'
                                ? 'dk'
                                : svc.badgeVariant === 'green'
                                ? 'gr'
                                : ''
                            }`}
                          >
                            {svc.timeEstimate}
                          </span>
                        </div>
                        <h3>{svc.shortTitle}</h3>
                        <p>{svc.summary}</p>
                        <div
                          style={{
                            marginTop: 'auto',
                            paddingTop: 12,
                            display: 'flex',
                            gap: 10,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <a
                            className="btn btn-sm btn-wa"
                            href={buildWhatsAppUrl(svc.whatsappMsg)}
                            target="_blank"
                            rel="noopener"
                          >
                            <Icon name="wa" />
                            <span>Agendar</span>
                          </a>
                          <a
                            href={`/${svc.slug}`}
                            className="link-arrow"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToLp(svc);
                            }}
                          >
                            <span>Detalhes</span>
                            <Icon name="arrow" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* FAIXA SIMPLIFICADA PARA EMPRESAS (PJ) */}
                <div className="pj-strip">
                  <div>
                    <span className="kicker">Para Empresas (PJ)</span>
                    <h3>
                      Seguradora, Financeira, Proteção Veicular e Frotas
                    </h3>
                    <div className="pj-pills">
                      <a
                        href="/vistoria-seguradora"
                        className="pj-pill"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'vistoria-seguradora') || null
                          );
                        }}
                      >
                        <Icon name="shield" /> Seguradora
                      </a>
                      <a
                        href="/vistoria-financeira"
                        className="pj-pill"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'vistoria-financeira') || null
                          );
                        }}
                      >
                        <Icon name="building" /> Financeira / Consórcio
                      </a>
                      <a
                        href="/vistoria-protecao-automotiva"
                        className="pj-pill"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find(
                              (s) => s.id === 'vistoria-protecao-automotiva'
                            ) || null
                          );
                        }}
                      >
                        <Icon name="shield" /> Proteção Automotiva
                      </a>
                      <a
                        href="/para-empresas"
                        className="pj-pill"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'para-empresas') || null
                          );
                        }}
                      >
                        <Icon name="truck" /> Frotas
                      </a>
                    </div>
                  </div>
                  <div className="ctas">
                    <a
                      className="btn btn-wa"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e preciso de atendimento para Empresa (PJ).'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Atendimento PJ</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. RECOMENDADOR EM 2 CLIQUES (EXCLUSIVO PESSOA FÍSICA) */}
            <section className="sec alt" id="qual-vistoria">
              <div className="wrap">
                <div className="sec-head center">
                  <span className="kicker">Em dúvida? Descubra em 2 cliques</span>
                  <h2 className="h2">
                    <span className="lt">Qual vistoria é ideal</span> para você hoje?
                  </h2>
                </div>

                <div className="wizard">
                  <div className="wz-q">
                    <div className="wz-step">
                      <p>
                        <b>1</b>O que você precisa fazer?
                      </p>
                      <div className="opts">
                        {[
                          { v: 'comprar', label: 'Comprar um veículo', icon: 'tag' },
                          { v: 'vender', label: 'Vender meu veículo', icon: 'users' },
                          { v: 'transferir', label: 'Transferir no DETRAN', icon: 'file' },
                          { v: 'regularizar', label: 'Infração / Regularizar', icon: 'shield' },
                          { v: 'patio', label: 'Liberar de Pátio Público', icon: 'pin' },
                        ].map((opt) => (
                          <button
                            key={opt.v}
                            type="button"
                            className="opt"
                            aria-pressed={wzGoal === opt.v}
                            onClick={() => setWzGoal(opt.v)}
                          >
                            <Icon name={opt.icon} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="wz-step">
                      <p>
                        <b>2</b>Qual é o veículo ou foco?
                      </p>
                      <div className="opts">
                        {[
                          { v: 'carro', label: 'Carro / Moto passeio', icon: 'car' },
                          { v: 'eletrico', label: 'Elétrico ou Híbrido', icon: 'battery' },
                          { v: 'km', label: 'Checar KM no Scanner', icon: 'gauge' },
                          { v: 'pintura', label: 'Avaliar só a Pintura', icon: 'paint' },
                          { v: 'premium', label: 'Acima de R$ 200 mil', icon: 'star' },
                          { v: 'pesado', label: 'Caminhão / Pesado / Van', icon: 'truck' },
                        ].map((opt) => (
                          <button
                            key={opt.v}
                            type="button"
                            className="opt"
                            aria-pressed={wzVeh === opt.v}
                            onClick={() => setWzVeh(opt.v)}
                          >
                            <Icon name={opt.icon} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="wz-out" aria-live="polite">
                    <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                      <use href="#rings" />
                    </svg>
                    <span className="kicker" style={{ color: '#fff' }}>
                      Indicação Ideal
                    </span>
                    <h3>{wizardRecommendation.shortTitle}</h3>
                    <p className="wz-why">{wizardRecommendation.summary}</p>
                    <p className="wz-inc">
                      <Icon name="clock" /> Tempo médio: {wizardRecommendation.timeEstimate}
                    </p>
                    <div className="ctas">
                      <a
                        className="btn btn-wa"
                        href={buildWhatsAppUrl(wizardRecommendation.whatsappMsg)}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar Agora</span>
                      </a>
                      <a
                        className="btn btn-ghost-w"
                        href={`/${wizardRecommendation.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(wizardRecommendation);
                        }}
                      >
                        Ver detalhes
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =====================================================================
            5. NOSSAS 5 LOJAS EM CAMPINAS (#nossas-lojas) — LIMPO E DIRETO
           ===================================================================== */}
        <section className="sec" id="nossas-lojas">
          <div className="wrap" id="unidades">
            <div className="sec-head">
              <span className="kicker">Nossas Lojas · 5 Unidades em Campinas</span>
              <h2 className="h2">
                <span className="lt">Escolha a loja</span> mais perto de você
              </h2>
            </div>

            {/* BARRA ENXUTA DE PLANTÃO SÁBADO ATÉ 16H */}
            <div className="duty-bar">
              <div className="duty-bar-copy">
                <strong>★ Plantão aos Sábados até as 16h — Ponte Preta (Rua da Abolição, 2036)</strong>
                <span>Em frente ao antigo Extra Abolição. As outras 4 lojas abrem sábado das 08h às 12h.</span>
              </div>
              <div className="ctas">
                <a
                  className="btn btn-sm btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Quero agendar na Unidade de Plantão Abolição (Sábado até 16h).'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>Agendar na Abolição</span>
                </a>
                <a
                  className="btn btn-sm btn-ghost-w"
                  href="https://www.google.com/maps/search/?api=1&query=Rua+da+Aboli%C3%A7%C3%A3o%2C+2036+%E2%80%93+Ponte+Preta%2C+Campinas%2FSP"
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="gmaps" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            {/* Busca simples por bairro */}
            <div className="stores-tools">
              <label className="search">
                <Icon name="search" />
                <span className="sr">Buscar unidade por bairro em Campinas</span>
                <input
                  type="search"
                  placeholder="Buscar bairro (Taquaral, Centro, Abolição, Campos Elíseos, Amoreiras...)"
                  value={unitSearch}
                  onChange={(e) => setUnitSearch(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="tab"
                aria-pressed={onlySatDuty}
                onClick={() => setOnlySatDuty((v) => !v)}
              >
                {onlySatDuty ? '✓ Só Plantão Sábado 16h' : 'Plantão Sábado 16h'}
              </button>
            </div>

            {/* Cards das 5 Unidades de Campinas (Apenas o essencial para decidir rápido!) */}
            <div className="units">
              {filteredUnits.map((u) => {
                const openNow = isUnitOpen(u.satCloseHour);
                return (
                  <article
                    key={u.id}
                    className={`unit ${u.isSaturdayDuty ? 'duty-highlight' : ''}`}
                    id={`loja-${u.id}`}
                  >
                    {u.isSaturdayDuty && (
                      <div className="unit-duty-ribbon">
                        ★ Plantão aos Sábados: 08h às 16h
                      </div>
                    )}
                    <div className="unit-img">
                      <img
                        src={u.photo}
                        alt={`Fachada da unidade Auto Visão ${u.name}`}
                        loading="lazy"
                        decoding="async"
                        width="960"
                        height="686"
                      />
                      <span className="uf">{u.detran}</span>
                      <span className={`status ${openNow ? 'open' : 'closed'}`}>
                        {openNow ? 'Aberta agora' : '08h–18h'}
                      </span>
                    </div>
                    <div className="unit-b">
                      <h3>{u.shortName}</h3>
                      <dl>
                        <div>
                          <dt>
                            <Icon name="pin" />
                            <span className="sr">Endereço</span>
                          </dt>
                          <dd>
                            {u.address}
                            <small>{u.reference}</small>
                          </dd>
                        </div>
                        <div>
                          <dt>
                            <Icon name="clock" />
                            <span className="sr">Horário</span>
                          </dt>
                          <dd>
                            {u.hoursWeek}
                            <small
                              style={
                                u.isSaturdayDuty
                                  ? { color: '#C9232C', fontWeight: 700 }
                                  : undefined
                              }
                            >
                              {u.hoursSat}
                            </small>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="unit-f">
                      <a
                        className="btn btn-sm btn-wa"
                        href={buildWhatsAppUrl(u.whatsappMsg)}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>WhatsApp {WA_DISPLAY}</span>
                      </a>
                      <div className="unit-nav" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <a className="ub" href={u.mapsUrl} target="_blank" rel="noopener">
                          <Icon name="gmaps" />
                          <span>Google Maps</span>
                        </a>
                        <a className="ub" href={u.wazeUrl} target="_blank" rel="noopener">
                          <Icon name="waze" />
                          <span>Waze</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="unit-help">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <span className="kicker">Ajuda Rápida</span>
                <h3>Qual loja fica mais perto de você?</h3>
                <p>Mande sua localização no WhatsApp e indicamos a unidade ideal na hora.</p>
                <a
                  className="btn btn-white"
                  href={buildWhatsAppUrl(
                    'Olá! Quero saber qual das 5 lojas de Campinas está mais perto de mim.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>WhatsApp {WA_DISPLAY}</span>
                </a>
              </div>
            </div>

            <p className="callout" style={{ marginTop: 24 }}>
              <Icon name="file" />
              <span>
                <strong>O que levar na vistoria:</strong> Documento do veículo (CRLV-e ou CRV) +
                CNH ou RG do condutor.
              </span>
            </p>
          </div>
        </section>

        {/* =====================================================================
            6. SOBRE NÓS (#sobre-nos) + NOSSO CONTATO (#nosso-contato)
           ===================================================================== */}
        <section className="sec alt" id="sobre-nos">
          <div className="wrap schedule-grid">
            <div className="net-copy">
              <span className="kicker">Sobre Nós · Desde 2006 em Campinas</span>
              <h2 className="h2">
                <span className="lt">Quase 20 anos de</span> credibilidade e laudos precisos.
              </h2>
              <p className="lead">
                Fundada em Campinas em 2006, a <strong>Auto Visão®</strong> soma mais de 240 lojas no
                Brasil e certificação <strong>DETRAN-SP</strong> e <strong>ISO 9001</strong>.
              </p>

              <figure className="net-photo" style={{ marginTop: 16 }}>
                <img
                  src="/assets/img/fachada-auto-visao.webp"
                  alt="Fachada Oficial Auto Visão Vistorias Automotivas em Campinas"
                  loading="lazy"
                  decoding="async"
                  width="1280"
                  height="937"
                />
                <figcaption>
                  <Icon name="store" /> WhatsApp {WA_DISPLAY} · Fixo {CENTRAL_DISPLAY}
                </figcaption>
              </figure>
            </div>

            <div className="schedule-card" id="nosso-contato">
              <span className="kicker">Agendamento Rápido</span>
              <h3 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>
                <span className="lt">Agende pelo</span> WhatsApp {WA_DISPLAY}
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: 18, fontSize: 15 }}>
                Preencha em 10 segundos ou ligue no fixo{' '}
                <a href={`tel:${CENTRAL_TEL}`} style={{ fontWeight: 700 }}>
                  {CENTRAL_DISPLAY}
                </a>
                .
              </p>

              <form className="schedule-form" onSubmit={handleScheduleSubmit}>
                <div className="field full">
                  <label htmlFor="sch-service">Qual vistoria?</label>
                  <select
                    id="sch-service"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                  >
                    {PUBLIC_MAIN_SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.shortTitle}
                      </option>
                    ))}
                    <option value="Combo Vistoria Cautelar + Transferência DETRAN">
                      Combo Vistoria Cautelar + Transferência DETRAN
                    </option>
                  </select>
                </div>

                <div className="field full">
                  <label htmlFor="sch-unit">Qual unidade em Campinas?</label>
                  <select
                    id="sch-unit"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                  >
                    {CAMPINAS_UNITS.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.shortName}
                      </option>
                    ))}
                    <option value="Indicar a mais próxima de mim">
                      Não sei — me indique a mais próxima
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="sch-name">Seu nome</label>
                  <input
                    id="sch-name"
                    type="text"
                    placeholder="Ex.: João Silva"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sch-phone">Seu WhatsApp</label>
                  <input
                    id="sch-phone"
                    type="tel"
                    placeholder="(19) 99999-9999"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sch-plate">Veículo / Placa (opcional)</label>
                  <input
                    id="sch-plate"
                    type="text"
                    placeholder="Ex.: Compass / ABC1D23"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sch-date">Quando prefere ir?</label>
                  <input
                    id="sch-date"
                    type="text"
                    placeholder="Ex.: Hoje à tarde / Sábado"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>

                <div className="full" style={{ marginTop: 6 }}>
                  <button type="submit" className="btn btn-wa" style={{ width: '100%' }}>
                    <Icon name="wa" />
                    <span>Enviar para o WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================================
            7. DÚVIDAS RÁPIDAS (TOP 5 PERGUNTAS)
           ===================================================================== */}
        <section className="sec" id="duvidas">
          <div className="wrap faq-cols">
            <div className="faq-side">
              <span className="kicker">Dúvidas Rápidas</span>
              <h2 className="h2">
                <span className="lt">Respostas diretas</span> antes da sua vistoria
              </h2>
              <p className="lead">
                Ainda tem dúvida? Fale direto no WhatsApp <strong>{WA_DISPLAY}</strong>.
              </p>
              <div className="ctas">
                <a
                  className="btn btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e tenho uma dúvida.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>Tirar Dúvida no WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="faq">
              {FAQ_ITEMS.slice(0, 5).map((item, idx) => (
                <details key={idx}>
                  <summary>
                    {item.q}
                    <span className="pm">
                      <Icon name="plus" />
                    </span>
                  </summary>
                  <p className="ans">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            8. CTA FINAL
           ===================================================================== */}
        <section className="final" aria-label="Agende sua vistoria em Campinas">
          <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
            <use href="#rings" />
          </svg>
          <div className="wrap">
            <div>
              <span className="kicker">Atendimento Imediato</span>
              <h2 className="h2" style={{ marginTop: 14 }}>
                <span className="lt">Seu carro em boas mãos</span> nas 5 lojas de Campinas.
              </h2>
            </div>
            <div className="final-card">
              <a
                className="btn btn-wa"
                href={buildWhatsAppUrl(
                  activeLpService
                    ? activeLpService.whatsappMsg
                    : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
                )}
                target="_blank"
                rel="noopener"
              >
                <Icon name="wa" />
                <span>Agendar no WhatsApp {WA_DISPLAY}</span>
              </a>
              <small>
                <Icon name="phone" /> Fixo Central:{' '}
                <a href={`tel:${CENTRAL_TEL}`} style={{ color: '#fff', fontWeight: 700 }}>
                  {CENTRAL_DISPLAY}
                </a>
              </small>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          RODAPÉ INSTITUCIONAL + LINKS GOOGLE ADS
         ===================================================================== */}
      <footer className="ft">
        <div className="strip" style={{ ['--h' as any]: '36px' }} aria-hidden="true" />
        <div className="wrap">
          <div className="ft-top">
            <div className="ft-brand">
              <img
                src="/assets/img/logo-autovisao-branco.svg"
                alt="Auto Visão Vistorias Automotivas"
                width="200"
                height="48"
              />
              <p>
                Nascida em Campinas/SP em 2006. 5 unidades credenciadas pelo DETRAN-SP (ECV) em
                Campinas e mais de 240 lojas no Brasil.
              </p>
              <a
                className="ft-wa"
                href={buildWhatsAppUrl(
                  'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
                )}
                target="_blank"
                rel="noopener"
              >
                <Icon name="wa" />
                {WA_DISPLAY}
              </a>
            </div>

            <div>
              <h4>Nossos Serviços</h4>
              <ul>
                {PUBLIC_MAIN_SERVICES.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/${s.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToLp(s);
                      }}
                    >
                      {s.shortTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>5 Lojas em Campinas</h4>
              <ul>
                {CAMPINAS_UNITS.map((u) => (
                  <li key={u.id}>
                    <a
                      href={`#loja-${u.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(`loja-${u.id}`);
                      }}
                    >
                      {u.shortName} ({u.detran})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Atendimento</h4>
              <ul>
                <li>
                  <a
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    WhatsApp {WA_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`tel:${CENTRAL_TEL}`}>Fixo {CENTRAL_DISPLAY}</a>
                </li>
                <li>
                  <a href="mailto:contato@autovisao.com">contato@autovisao.com</a>
                </li>
                <li>
                  <a
                    href="/sobre-nos"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('sobre-nos');
                    }}
                  >
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a
                    href="/nosso-contato"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('nosso-contato');
                    }}
                  >
                    Nosso Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Painel Rápido de Sitelinks e LPs para Google Ads */}
          <details
            style={{
              marginTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.12)',
              paddingTop: 20,
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontFamily: 'var(--f-head)',
                fontWeight: 800,
                color: '#fff',
                fontSize: 14,
              }}
            >
              🔗 Sitelinks e Landing Pages para Google Ads (Clique para copiar)
            </summary>

            <div style={{ marginTop: 14 }}>
              <div className="ads-links-grid" style={{ marginBottom: 18 }}>
                {[
                  { title: 'Sobre Nós', slug: 'sobre-nos' },
                  { title: 'Nossos Serviços', slug: 'nossos-servicos' },
                  { title: 'Nossas Lojas (5)', slug: 'nossas-lojas' },
                  { title: 'Nosso Contato', slug: 'nosso-contato' },
                ].map((sl) => (
                  <div key={sl.slug} className="ads-link-card">
                    <b>
                      <span>{sl.title}</span>
                      <button
                        type="button"
                        onClick={() => copyUrl(sl.slug)}
                        style={{
                          background: copiedSlug === sl.slug ? '#18743B' : 'var(--brand)',
                          color: '#fff',
                          border: 0,
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {copiedSlug === sl.slug ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </b>
                    <code>/{sl.slug}</code>
                  </div>
                ))}
              </div>

              <div className="ads-links-grid">
                {VISTORIA_SERVICES.map((s) => (
                  <div key={s.id} className="ads-link-card">
                    <b>
                      <span>{s.shortTitle}</span>
                      <button
                        type="button"
                        onClick={() => copyUrl(s.slug)}
                        style={{
                          background: copiedSlug === s.slug ? '#18743B' : 'var(--brand)',
                          color: '#fff',
                          border: 0,
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {copiedSlug === s.slug ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </b>
                    <code>/{s.slug}</code>
                  </div>
                ))}
              </div>
            </div>
          </details>

          <div className="ft-legal">
            <ul>
              <li>
                ECV — Empresas Credenciadas pelo DETRAN-SP em Campinas: Taquaral (CNPJ
                58.556.175/0001-60 · ECV nº 9422) · Centro (CNPJ 58.544.979/0001-49 · ECV nº 9078) ·
                Ponte Preta / Abolição (CNPJ 58.555.299/0001-20 · ECV nº 9072) · Campos Elíseos
                (CNPJ 58.546.595/0001-65 · ECV nº 9417) · Parque Industrial (CNPJ
                58.545.529/0001-70 · ECV nº 9420).
              </li>
              <li>
                Auto Visão Franchising LTDA · CNPJ 25.241.005/0001-37 / 08.322.855/0001-40 · Marca
                Auto Visão® e Vistoria 360º® registradas no INPI (nº 930578732).
              </li>
            </ul>
          </div>

          <div className="ft-bottom">
            <span>
              © {new Date().getFullYear()} Auto Visão Vistorias Automotivas — Unidades Campinas.
            </span>
            <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setPrivacyOpen(true)}>
                Política de Privacidade (LGPD)
              </button>
              <button type="button" onClick={() => setCookieBanner(true)}>
                Cookies
              </button>
            </span>
          </div>
        </div>
      </footer>

      {/* GAVETAS MOBILE: 1) ENDEREÇOS -> GOOGLE MAPS / WHATSAPP  2) SERVIÇOS (RESUMO) */}
      {mobileSheet === 'enderecos' && (
        <div
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Escolher unidade em Campinas"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSheet(null);
          }}
        >
          <div className="sheet-panel">
            <div className="sheet-head">
              <div>
                <h3>5 Unidades em Campinas</h3>
                <small>Toque em Google Maps para ir direto ou chame no WhatsApp</small>
              </div>
              <button
                type="button"
                className="sheet-close"
                aria-label="Fechar endereços"
                onClick={() => setMobileSheet(null)}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="sheet-body">
              {CAMPINAS_UNITS.map((u) => (
                <div
                  key={u.id}
                  className={`sheet-unit-item ${u.isSaturdayDuty ? 'duty' : ''}`}
                >
                  <div className="sheet-unit-top">
                    <b>{u.shortName}</b>
                    <span>{u.isSaturdayDuty ? '★ Sábado até 16h' : 'Sábado até 12h'}</span>
                  </div>
                  <div className="sheet-unit-addr">
                    {u.address}
                    <small>{u.reference}</small>
                  </div>
                  <div className="sheet-unit-actions">
                    <a
                      href={u.mapsUrl}
                      target="_blank"
                      rel="noopener"
                      className="sheet-btn maps"
                    >
                      <Icon name="gmaps" />
                      <span>Google Maps</span>
                    </a>
                    <a
                      href={buildWhatsAppUrl(u.whatsappMsg)}
                      target="_blank"
                      rel="noopener"
                      className="sheet-btn wa"
                    >
                      <Icon name="wa" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileSheet === 'servicos' && (
        <div
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Resumo dos serviços"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSheet(null);
          }}
        >
          <div className="sheet-panel">
            <div className="sheet-head">
              <div>
                <h3>Nossas Vistorias</h3>
                <small>Toque no serviço para ver os detalhes</small>
              </div>
              <button
                type="button"
                className="sheet-close"
                aria-label="Fechar serviços"
                onClick={() => setMobileSheet(null)}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="sheet-body">
              {PUBLIC_MAIN_SERVICES.map((svc) => (
                <a
                  key={svc.id}
                  href={`/${svc.slug}`}
                  className="sheet-svc-item"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToLp(svc);
                  }}
                >
                  <div className="sheet-svc-left">
                    <span className="sheet-svc-ico">
                      <Icon name={svc.icon} />
                    </span>
                    <div>
                      <b>{svc.shortTitle}</b>
                      <small>{svc.summary}</small>
                    </div>
                  </div>
                  <Icon name="arrow" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE POLÍTICA DE PRIVACIDADE (LGPD) */}
      {privacyOpen && (
        <div
          className="svc-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lgpd-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrivacyOpen(false);
          }}
        >
          <div className="svc-modal">
            <div className="dlg-h">
              <div>
                <span className="kicker">LGPD · Lei nº 13.709/2018</span>
                <h2 className="h3" id="lgpd-title" style={{ marginTop: 6 }}>
                  Política de Privacidade e Cookies — Auto Visão Campinas
                </h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                aria-label="Fechar Política de Privacidade"
                onClick={() => setPrivacyOpen(false)}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="dlg-b">
              <p>
                Esta política explica como as unidades da rede <strong>Auto Visão</strong> em
                Campinas/SP tratam seus dados pessoais em conformidade com a LGPD.
              </p>
              <h3>Dados coletados e finalidade</h3>
              <p>
                Nome, telefone/WhatsApp e placa/modelo do veículo informados no agendamento são
                usados exclusivamente para atendimento nas 5 unidades de Campinas e emissão de
                laudos oficiais. Contato DPO: <a href="mailto:lgpd@autovisao.com">lgpd@autovisao.com</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BANNER DE COOKIES LGPD */}
      {cookieBanner && (
        <div className="ck" role="dialog" aria-label="Preferências de cookies">
          <b>Sua privacidade importa</b>
          <p>
            Utilizamos cookies essenciais para oferecer a melhor experiência de agendamento.
          </p>
          <div className="row">
            <button type="button" className="btn" onClick={() => saveCookieConsent('all')}>
              Aceitar
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => saveCookieConsent('essential')}
            >
              Apenas essenciais
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE WHATSAPP DESKTOP + VOLTAR AO TOPO */}
      <a
        className="fab"
        href={buildWhatsAppUrl(
          activeLpService
            ? activeLpService.whatsappMsg
            : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
        )}
        target="_blank"
        rel="noopener"
        aria-label="Agendar pelo WhatsApp"
      >
        <Icon name="wa" />
        <span>Agendar</span>
      </a>

      <button
        type="button"
        className={`totop ${showToTop ? 'on' : ''}`}
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon name="up" />
      </button>

      {/* BARRA FIXA DE CELULAR COM OS 3 BOTÕES: WHATSAPP, ENDEREÇOS (5), SERVIÇOS */}
      <nav className="mbar" aria-label="Atalhos rápidos no celular">
        <a
          className="wa"
          href={buildWhatsAppUrl(
            activeLpService
              ? activeLpService.whatsappMsg
              : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
          )}
          target="_blank"
          rel="noopener"
        >
          <Icon name="wa" />
          WhatsApp
        </a>

        <button
          type="button"
          className={mobileSheet === 'enderecos' ? 'active' : ''}
          onClick={() =>
            setMobileSheet((cur) => (cur === 'enderecos' ? null : 'enderecos'))
          }
        >
          <Icon name="pin" />
          Endereços (5)
        </button>

        <button
          type="button"
          className={mobileSheet === 'servicos' ? 'active' : ''}
          onClick={() =>
            setMobileSheet((cur) => (cur === 'servicos' ? null : 'servicos'))
          }
        >
          <Icon name="list" />
          Serviços
        </button>
      </nav>
    </>
  );
}
export default App;

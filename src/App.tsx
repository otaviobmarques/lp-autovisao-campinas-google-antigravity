import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
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

const LazyRemotionPlayerEmbed = lazy(() => import('./components/RemotionPlayerEmbed'));

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

  // Hero Carousel State
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // Remotion Showreel Scene Filter + Lazy Mount when near viewport
  const [remotionScene, setRemotionScene] = useState<number | null>(null);
  const [loadRemotion, setLoadRemotion] = useState(false);
  const remotionRef = useRef<HTMLElement | null>(null);

  // Services Category Filter State
  const [serviceTab, setServiceTab] = useState<string>('all');

  // Wizard ("Qual vistoria eu preciso?" — Exclusivo Pessoa Física)
  const [wzGoal, setWzGoal] = useState<string>('comprar');
  const [wzVeh, setWzVeh] = useState<string>('carro');

  // Selected Service for Detail Modal
  const [selectedService, setSelectedService] = useState<VistoriaService | null>(null);

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

  // IntersectionObserver for Lazy Loading Remotion Player (100% PageSpeed score!)
  useEffect(() => {
    const el = remotionRef.current;
    if (!el || loadRemotion) return;
    if (!('IntersectionObserver' in window)) {
      setLoadRemotion(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadRemotion(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadRemotion, activeLpService]);

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
    setSelectedService(null);
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

  // Hero Auto-Play
  useEffect(() => {
    if (heroPaused || activeLpService) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 4);
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

  // Filtered Services on Main Public Catalog (Simplified & Clean — PJ services are grouped)
  const filteredServices = useMemo(() => {
    if (serviceTab === 'all') return PUBLIC_MAIN_SERVICES.filter((s) => s.id !== 'para-empresas');
    return PUBLIC_MAIN_SERVICES.filter(
      (s) => s.id !== 'para-empresas' && s.category.includes(serviceTab as any)
    );
  }, [serviceTab]);

  // Wizard Recommendation Logic — EXCLUSIVO PESSOA FÍSICA (Sem opções de PJ)
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
    // Comprar ou Vender (Pessoa Física)
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

      {/* TOPBAR OFICIAL ESCURA #151415 — TELEFONE FIXO ÚNICO (19) 3271-1700 E WHATSAPP (19) 99224-8383 */}
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

      {/* HEADER STICKY COM OS 4 SITELINKS PRINCIPAIS (SOBRE NÓS, NOSSOS SERVIÇOS, NOSSAS LOJAS, NOSSO CONTATO) */}
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
            <a
              href="/"
              aria-current={!activeLpService ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateToLp(null);
              }}
            >
              Início
            </a>

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
              href="/vistoria-km-scanner"
              aria-current={activeLpService?.id === 'vistoria-km-scanner' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateToLp(VISTORIA_SERVICES.find((s) => s.id === 'vistoria-km-scanner') || null);
              }}
            >
              Scanner KM & Bateria EV
            </a>

            <a
              href="/vistoria-360"
              aria-current={activeLpService?.id === 'vistoria-360' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateToLp(VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null);
              }}
            >
              Vistoria 360º®
            </a>

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
              <span>Agendar</span>
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
                  <span>Voltar para a página principal</span>
                </button>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                  Serviço selecionado: <strong>{activeLpService.shortTitle} — Campinas/SP</strong>
                </span>
              </div>
            </div>

            {/* BANNER HERO APRESENTÁVEL COM ILUSTRAÇÃO OFICIAL DO DESIGN SYSTEM */}
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
                          <Icon name="clock" /> Tempo médio: {activeLpService.timeEstimate}
                        </span>
                        <span className="chip">
                          <Icon name="store" /> 5 Lojas Credenciadas em Campinas
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
                          <span>Agendar pelo WhatsApp {WA_DISPLAY}</span>
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
                          <span>Ver as 5 Lojas em Campinas</span>
                        </a>
                      </div>
                    </div>

                    {/* Ilustração Oficial do Banner de cada Serviço */}
                    <ServiceHeroIllustration serviceId={activeLpService.id} />
                  </div>
                </div>
              </div>
              <div className="strip" style={{ ['--h' as any]: '36px' }} aria-hidden="true" />
            </section>

            {/* RESUMO DIRETO DO SERVIÇO (2 COLUNAS RESPONSIVAS QUE EMPILHAM NO MOBILE) */}
            <section className="sec">
              <div className="wrap">
                <div className="sec-head">
                  <span className="kicker">Segurança Total na Decisão</span>
                  <h2 className="h2">
                    <span className="lt">Tudo o que auditamos na</span> {activeLpService.shortTitle}
                  </h2>
                  <p className="lead">
                    <strong>Para quem é indispensável:</strong> {activeLpService.idealFor}
                  </p>
                </div>

                <div className="lp-two-cols">
                  <div className="box">
                    <h3>
                      <Icon name="check" /> O que é inspecionado passo a passo
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
                      <Icon name="file" /> O que entregamos para você
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
                      <li>
                        <Icon name="store" />
                        <span>
                          Disponível nas 5 lojas de Campinas (Taquaral, Centro, Ponte
                          Preta/Abolição, Campos Elíseos e Amoreiras)
                        </span>
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
                        <span>Agendar {activeLpService.shortTitle} no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* UPSELL DE ALTO VALOR NAS PÁGINAS DE SERVIÇO: SCANNER DE MÓDULO (KM REAL) & BATERIA EV */}
                {activeLpService.id !== 'vistoria-km-scanner' &&
                  activeLpService.id !== 'vistoria-bateria-eletricos' && (
                    <div className="pj-strip" style={{ marginTop: 28, border: '2px solid var(--brand)' }}>
                      <div>
                        <span className="kicker" style={{ color: '#fff' }}>
                          Recomendação dos Peritos Auto Visão
                        </span>
                        <h3>
                          <span className="lt" style={{ fontWeight: 300 }}>
                            Blindagem Eletrônica Completa:
                          </span>{' '}
                          Adicione o Scanner de Módulo (KM Real) ou Vistoria de Bateria EV
                        </h3>
                        <p>
                          Aproveite a mesma visita para ler a quilometragem real gravada nos módulos
                          eletrônicos (Motor, Câmbio, ABS e Airbag) ou certificar a saúde (SoH
                          AVILOO) da bateria se o veículo for elétrico ou híbrido!
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
                            <Icon name="gauge" /> Conhecer Scanner de Módulo (KM Real)
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
                            <Icon name="battery" /> Conhecer Vistoria de Bateria (Elétricos/Híbridos)
                          </a>
                        </div>
                      </div>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            `Olá! Quero agendar a ${activeLpService.shortTitle} e também incluir o Scanner de Módulo (KM Real) / Bateria EV.`
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Incluir Scanner / Bateria EV</span>
                        </a>
                      </div>
                    </div>
                  )}

                <div style={{ marginTop: 44 }}>
                  <div className="sec-head" style={{ marginBottom: 18 }}>
                    <span className="kicker">Navegar entre Serviços</span>
                    <h3 className="h3">Veja outras vistorias realizadas em Campinas:</h3>
                  </div>
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
              HOME DE ALTA CONVERSÃO, COPY FORTE E LEITURA FÁCIL
             ===================================================================== */
          <>
            {/* 1. HERO CAROUSEL (4 BANNERS DE ALTA PERSUASÃO) */}
            <section
              className={`hero ${heroPaused ? 'paused' : ''}`}
              id="inicio"
              aria-roledescription="carrossel"
              aria-label="Destaques Auto Visão Campinas"
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
            >
              <div className="slides">
                {/* BANNER 1: DETRAN + CAUTELAR */}
                <div
                  className={`slide red ${heroSlide === 0 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="1 de 4"
                  aria-hidden={heroSlide !== 0}
                >
                  <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                    <use href="#rings" />
                  </svg>
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">5 Lojas Credenciadas DETRAN-SP em Campinas</span>
                      <h1 className="h-display">
                        <span className="lt">Não arrisque seu dinheiro</span>em um carro sem
                        histórico.
                      </h1>
                      <p className="lead">
                        Descubra se o veículo tem leilão, sinistro, batida estrutural ou chassi
                        adulterado antes de comprar — e já faça a Vistoria Oficial do DETRAN-SP na
                        mesma visita!
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agende pelo WhatsApp {WA_DISPLAY}</span>
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
                          <span>Ver as 5 Lojas em Campinas</span>
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-cautelar" />
                  </div>
                </div>

                {/* BANNER 2: SCANNER DE MÓDULO (KM REAL) + BATERIA ELÉTRICOS & HÍBRIDOS (ALTO TICKET) */}
                <div
                  className={`slide dark ${heroSlide === 1 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="2 de 4"
                  aria-hidden={heroSlide !== 1}
                >
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">Diagnóstico Eletrônico Exclusivo em Campinas</span>
                      <h2 className="h-display">
                        <span className="lt">Scanner de Módulo (KM Real)</span>e Saúde da Bateria
                        EV.
                      </h2>
                      <p className="lead">
                        Mais de 30% dos seminovos têm KM adulterado ou falhas apagadas no painel.
                        Nosso scanner lê a memória oculta dos módulos (OBD-II) e o sistema AVILOO
                        certifica a saúde real da bateria de elétricos e híbridos.
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Vim pelo site da Auto Visão Campinas e quero agendar a Vistoria de Scanner de Módulo (KM Real) / Bateria de Elétricos e Híbridos.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Agendar Scanner / Bateria EV</span>
                        </a>
                        <a
                          className="btn btn-ghost-w"
                          href="#destaque-scanner-bateria"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('destaque-scanner-bateria');
                          }}
                        >
                          Ver como funciona
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-km-scanner" />
                  </div>
                </div>

                {/* BANNER 3: NOSSA VISTORIA 360º® (+180 ITENS + PINTURA PEÇA A PEÇA) */}
                <div
                  className={`slide red ${heroSlide === 2 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="3 de 4"
                  aria-hidden={heroSlide !== 2}
                >
                  <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                    <use href="#rings" />
                  </svg>
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">Exclusiva Auto Visão®</span>
                      <h2 className="h-display">
                        <span className="lt">Nossa Vistoria 360º®:</span>mais de 180 itens passados
                        a limpo.
                      </h2>
                      <p className="lead">
                        A blindagem definitiva para quem compra ou vende: estrutura, pintura peça a
                        peça em µm, vídeo no WhatsApp (Plus) e scanner de módulos com Certificado
                        do Carro (Max).
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Vim pelo site da Auto Visão Campinas e quero agendar a Nossa Vistoria 360º®.'
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
                          Conhecer a 360º®
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-360" />
                  </div>
                </div>

                {/* BANNER 4: PESADOS + EMPRESAS + PÁTIO */}
                <div
                  className={`slide dark ${heroSlide === 3 ? 'is-on' : ''}`}
                  role="group"
                  aria-roledescription="banner"
                  aria-label="4 de 4"
                  aria-hidden={heroSlide !== 3}
                >
                  <div className="wrap">
                    <div className="slide-copy">
                      <span className="kicker">Caminhões, Regularização e Soluções PJ</span>
                      <h2 className="h-display">
                        <span className="lt">Veículos Pesados, Pátio,</span>Infração e Atendimento
                        Empresas.
                      </h2>
                      <p className="lead">
                        Laudo oficial na hora para caminhões, baixa de bloqueio por infração,
                        liberação de pátio público e convênios corporativos (Seguradora, Financeira
                        e Proteção Veicular).
                      </p>
                      <div className="ctas">
                        <a
                          className="btn btn-wa"
                          href={buildWhatsAppUrl(
                            'Olá! Vim pelo site da Auto Visão Campinas e quero informações sobre vistoria.'
                          )}
                          target="_blank"
                          rel="noopener"
                        >
                          <Icon name="wa" />
                          <span>Falar no WhatsApp {WA_DISPLAY}</span>
                        </a>
                      </div>
                    </div>
                    <ServiceHeroIllustration serviceId="vistoria-pesados" />
                  </div>
                </div>
              </div>

              <div className="hero-ctrl">
                <div className="wrap">
                  <div className="dots" role="group" aria-label="Escolher banner">
                    {[0, 1, 2, 3].map((idx) => (
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
                      onClick={() => setHeroSlide((s) => (s - 1 + 4) % 4)}
                    >
                      <Icon name="arrowl" />
                    </button>
                    <button
                      className="arw"
                      aria-label="Próximo banner"
                      onClick={() => setHeroSlide((s) => (s + 1) % 4)}
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="strip" style={{ ['--h' as any]: '40px' }} aria-hidden="true" />
            </section>

            {/* 2. FAIXA DE CONFIANÇA */}
            <section className="trust" aria-label="Por que escolher a Auto Visão em Campinas">
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
                      <span>ECVs oficiais · Laudo na hora</span>
                    </div>
                  </li>
                  <li>
                    <span className="ico">
                      <Icon name="orbit" />
                    </span>
                    <div>
                      <strong>Vistoria 360º® Exclusiva</strong>
                      <span>+180 itens · Pintura · Scanner · Vídeo</span>
                    </div>
                  </li>
                  <li>
                    <span className="ico">
                      <Icon name="clock" />
                    </span>
                    <div>
                      <strong>Plantão aos Sábados</strong>
                      <span>Até as 16h na unidade Ponte Preta (Abolição)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. DESTAQUE DUPLO: VISTORIA DO DETRAN & VISTORIA CAUTELAR (COPY DE ALTA CONVERSÃO) */}
            <section className="sec" id="destaques">
              <div className="wrap">
                <div className="sec-head center">
                  <span className="kicker">Proteja Seu Bolso e Sua Família</span>
                  <h2 className="h2">
                    <span className="lt">Destaque para a</span> Vistoria do DETRAN e Vistoria
                    Cautelar
                  </h2>
                  <p className="lead">
                    Um carro bonito por fora pode esconder um prejuízo de R$ 30 mil por baixo da
                    lataria. Resolva sua transferência oficial ou blinde sua compra em 30 minutos.
                  </p>
                </div>

                <div className="flagship-grid">
                  {/* CARD 1: VISTORIA DO DETRAN */}
                  <article className="flagship-card detran">
                    <div>
                      <span className="kicker">OBRIGATÓRIA NA TRANSFERÊNCIA · ECV OFICIAL</span>
                      <h3 style={{ marginTop: 12 }}>
                        <span className="lt">Vistoria do DETRAN</span>
                        Transferência sem fila e na hora
                      </h3>
                      <p style={{ marginTop: 12 }}>
                        Precisa passar o veículo para o seu nome, mudar de município ou tirar
                        segunda via? Emitimos o laudo oficial ECV homologado direto no sistema
                        e-CRVsp do DETRAN-SP em qualquer uma das nossas 5 lojas de Campinas.
                      </p>
                      <ul className="flagship-list" style={{ marginTop: 16 }}>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Coleta óptica oficial de chassi, motor e placa Mercosul</span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Checagem completa dos itens exigidos pelo CONTRAN</span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Laudo pronto na hora (20 a 30 minutos)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="ctas" style={{ marginTop: 8 }}>
                      <a
                        className="btn btn-wa"
                        href={buildWhatsAppUrl(
                          'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria do DETRAN (Transferência).'
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar Vistoria DETRAN</span>
                      </a>
                      <a
                        className="btn btn-ghost-w"
                        href="/vistoria-detran"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'vistoria-detran') || null
                          );
                        }}
                      >
                        Ver página exclusiva
                      </a>
                    </div>
                  </article>

                  {/* CARD 2: VISTORIA CAUTELAR */}
                  <article className="flagship-card cautelar">
                    <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                      <use href="#rings" />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <span className="kicker">PROTEÇÃO TOTAL ANTES DE COMPRAR OU VENDER</span>
                      <h3 style={{ marginTop: 12 }}>
                        <span className="lt">Vistoria Cautelar</span>
                        Não compre um problema escondido
                      </h3>
                      <p style={{ marginTop: 12 }}>
                        Antes de assinar o contrato ou fazer o PIX, saiba a verdade: verificamos se
                        a estrutura já sofreu batida grave, se o chassi ou motor foram adulterados e
                        se consta leilão, sinistro, roubo ou bloqueio judicial.
                      </p>
                      <ul className="flagship-list" style={{ marginTop: 16 }}>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Estrutura: longarinas, colunas, teto, caixas de ar e soldas</span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Passado completo: leilão, sinistro, roubo/furto e débitos</span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>Autenticidade de chassi, motor, câmbio, vidros e etiquetas</span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="ctas"
                      style={{ position: 'relative', zIndex: 1, marginTop: 8 }}
                    >
                      <a
                        className="btn btn-dark"
                        href={buildWhatsAppUrl(
                          'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Cautelar.'
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar Vistoria Cautelar</span>
                      </a>
                      <a
                        className="btn btn-ghost-w"
                        href="/vistoria-cautelar"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'vistoria-cautelar') || null
                          );
                        }}
                      >
                        Ver página exclusiva
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* 3B. SUPER DESTAQUE DE ALTO VALOR: SCANNER DE MÓDULO (KM REAL) & VISTORIA DE BATERIA (ELÉTRICOS E HÍBRIDOS) */}
            <section className="sec dark" id="destaque-scanner-bateria">
              <div className="wrap">
                <div className="sec-head center">
                  <span className="kicker" style={{ color: '#fff' }}>
                    Tecnologia Exclusiva de Diagnóstico Profundo
                  </span>
                  <h2 className="h2">
                    <span className="lt">O que ninguém vê no olho:</span> Scanner de Módulo (KM
                    Real) e Saúde da Bateria EV
                  </h2>
                  <p className="lead">
                    Mais de 30% dos veículos seminovos têm quilometragem adulterada no painel ou
                    falhas eletrônicas apagadas antes da venda — e em elétricos/híbridos, uma
                    bateria degradada pode custar mais de R$ 80 mil. Proteja seu investimento antes
                    de fechar negócio!
                  </p>
                </div>

                <div className="flagship-grid">
                  {/* DESTAQUE 1: VISTORIA DE KM COM SCANNER DE MÓDULO */}
                  <article className="flagship-card cautelar">
                    <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                      <use href="#rings" />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <span className="kicker">ANTI-FRAUDE DE HODÔMETRO · LEITURA OBD-II</span>
                      <h3 style={{ marginTop: 12 }}>
                        <span className="lt">Vistoria de KM com</span>
                        Scanner de Módulo Eletrônico
                      </h3>
                      <p style={{ marginTop: 12 }}>
                        Adulterar o número que aparece no painel é fácil para golpistas — mas a
                        quilometragem verdadeira continua gravada nos módulos internos do carro.
                        Nosso scanner profissional lê todas as centrais e entrega a prova técnica!
                      </p>
                      <ul className="flagship-list" style={{ marginTop: 16 }}>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Compara o KM do painel com a memória dos módulos de Motor (ECU), Câmbio
                            (TCU), ABS e Airbag
                          </span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Descobre códigos de falha (DTC) graves que foram apagados para esconder
                            defeitos no test-drive
                          </span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Pode ser contratada avulsa ou somada à sua Vistoria Cautelar / 360º®
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="ctas"
                      style={{ position: 'relative', zIndex: 1, marginTop: 8 }}
                    >
                      <a
                        className="btn btn-wa"
                        href={buildWhatsAppUrl(
                          'Olá! Vim pelo site da Auto Visão Campinas e quero agendar a Vistoria de KM com Scanner de Módulo.'
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar Scanner de Módulo</span>
                      </a>
                      <a
                        className="btn btn-dark"
                        href="/vistoria-km-scanner"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find((s) => s.id === 'vistoria-km-scanner') || null
                          );
                        }}
                      >
                        Ver detalhes do Scanner
                      </a>
                    </div>
                  </article>

                  {/* DESTAQUE 2: VISTORIA DE BATERIA PARA ELÉTRICOS E HÍBRIDOS */}
                  <article
                    className="flagship-card detran"
                    style={{ border: '2px solid #25D366' }}
                  >
                    <div>
                      <span className="kicker">
                        CERTIFICAÇÃO INTERNACIONAL INDEPENDENTE AVILOO
                      </span>
                      <h3 style={{ marginTop: 12 }}>
                        <span className="lt">Vistoria de Bateria para</span>
                        Veículos Elétricos e Híbridos
                      </h3>
                      <p style={{ marginTop: 12 }}>
                        A bateria de alta tensão vale até 50% do preço de um carro elétrico ou
                        híbrido (BYD, GWM, Volvo, Toyota, BMW, Porsche). Emitimos o Certificado
                        Independente AVILOO que comprova a saúde real (SoH) da bateria!
                      </p>
                      <ul className="flagship-list" style={{ marginTop: 16 }}>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Medição oficial do Estado de Saúde (SoH) real das células e autonomia
                            da bateria de tração
                          </span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Inspeção física inferior do cofre da bateria contra pancadas de solo,
                            amassados e infiltrações
                          </span>
                        </li>
                        <li>
                          <span className="ok-dot">
                            <Icon name="check" />
                          </span>
                          <span>
                            Valoriza o elétrico na hora da venda e protege quem está comprando
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="ctas" style={{ marginTop: 8 }}>
                      <a
                        className="btn btn-wa"
                        href={buildWhatsAppUrl(
                          'Olá! Vim pelo site da Auto Visão Campinas e quero agendar a Vistoria de Bateria para Veículo Elétrico / Híbrido (Certificado AVILOO).'
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar Vistoria de Bateria EV</span>
                      </a>
                      <a
                        className="btn btn-ghost-w"
                        href="/vistoria-bateria-eletricos"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(
                            VISTORIA_SERVICES.find(
                              (s) => s.id === 'vistoria-bateria-eletricos'
                            ) || null
                          );
                        }}
                      >
                        Ver detalhes Bateria EV
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* 4. NOSSOS SERVIÇOS (SITELINK #nossos-servicos — DIRETO, SIMPLES E PERSUASIVO) */}
            <section className="sec alt" id="nossos-servicos">
              <div className="wrap">
                <div className="sec-head">
                  <span className="kicker">Nossos Serviços em Campinas</span>
                  <h2 className="h2">
                    <span className="lt">A vistoria certa para</span> cada momento do seu veículo
                  </h2>
                  <p className="lead">
                    Clique em qualquer serviço abaixo para abrir a página com banner ilustrativo ou
                    agendar direto pelo WhatsApp <strong>{WA_DISPLAY}</strong>.
                  </p>
                </div>

                {/* Filtros simples para o cliente */}
                <div className="tabs" role="group" aria-label="Filtrar serviços de vistoria">
                  {[
                    { id: 'all', label: 'Todas as Vistorias' },
                    { id: 'comprar', label: 'Comprar ou Vender com Segurança' },
                    { id: 'transferir', label: 'DETRAN, Infração e Pátio Público' },
                    { id: 'avancada', label: '360º®, Pintura, Scanner KM, Elétricos e Premium' },
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

                <div className="grid-sv">
                  {filteredServices.map((svc) => (
                    <article
                      key={svc.id}
                      id={svc.id}
                      className={`sv ${svc.featured && serviceTab === 'all' ? 'feat' : ''}`}
                    >
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
                          {svc.badge}
                        </span>
                      </div>
                      <h3>{svc.shortTitle}</h3>
                      <p>{svc.summary}</p>
                      <ul>
                        {svc.checklist.slice(0, 2).map((item, idx) => (
                          <li key={idx}>
                            <Icon name="check" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: 12,
                          display: 'flex',
                          flexWrap: 'wrap',
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
                          style={{
                            color: svc.featured && serviceTab === 'all' ? '#fff' : undefined,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToLp(svc);
                          }}
                        >
                          <span>Ver detalhes</span>
                          <Icon name="arrow" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Bloco Simplificado para Empresas (PJs): Seguradora, Financeira e Proteção Veicular */}
                <div className="pj-strip">
                  <div>
                    <span className="kicker">Soluções Corporativas (Exclusivo PJ)</span>
                    <h3>
                      <span className="lt" style={{ fontWeight: 300 }}>
                        Atendimento para Empresas:
                      </span>{' '}
                      Seguradora, Financeira, Proteção Veicular e Frotas
                    </h3>
                    <p>
                      Representa uma seguradora, corretora, financeira, administradora de consórcio
                      ou associação de proteção automotiva? Temos fluxo corporativo rápido nas 5
                      unidades de Campinas.
                    </p>
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
                        <Icon name="shield" /> Vistoria para Seguradora
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
                        <Icon name="building" /> Vistoria para Financeira / Consórcio
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
                        <Icon name="truck" /> Frotas Corporativas
                      </a>
                    </div>
                  </div>
                  <div className="ctas">
                    <a
                      className="btn btn-wa"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e quero atendimento corporativo (PJ) para Seguradora / Financeira / Proteção Veicular / Frota.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Falar com Atendimento PJ</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. RECOMENDADOR EM 2 CLIQUES — EXCLUSIVO PARA PESSOA FÍSICA (SIMPLES E FÁCIL) */}
            <section className="sec" id="qual-vistoria">
              <div className="wrap">
                <div className="sec-head center">
                  <span className="kicker">Descubra em 2 Cliques</span>
                  <h2 className="h2">
                    <span className="lt">Qual vistoria é ideal</span> para o seu caso hoje?
                  </h2>
                  <p className="lead">
                    Selecione o seu objetivo e o tipo de veículo para ver a indicação exata dos
                    nossos especialistas em Campinas.
                  </p>
                </div>

                <div className="wizard">
                  <div className="wz-q">
                    <div className="wz-step">
                      <p>
                        <b>1</b>Qual é o seu objetivo hoje?
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
                        <b>2</b>Qual é o perfil do veículo ou foco?
                      </p>
                      <div className="opts">
                        {[
                          { v: 'carro', label: 'Carro / Moto passeio', icon: 'car' },
                          { v: 'eletrico', label: 'Elétrico ou Híbrido', icon: 'battery' },
                          { v: 'pesado', label: 'Caminhão / Pesado / Van', icon: 'truck' },
                          { v: 'premium', label: 'Acima de R$ 200 mil', icon: 'star' },
                          { v: 'km', label: 'Suspeita de KM adulterado', icon: 'gauge' },
                          { v: 'pintura', label: 'Avaliar só a Pintura', icon: 'paint' },
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
                      Indicação Ideal para Você
                    </span>
                    <h3>{wizardRecommendation.shortTitle}</h3>
                    <p className="wz-why">{wizardRecommendation.salesCopy}</p>
                    <ul>
                      {wizardRecommendation.checklist.slice(0, 4).map((item, i) => (
                        <li key={i}>
                          <Icon name="check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="wz-inc">
                      <Icon name="clock" /> Tempo médio em loja: {wizardRecommendation.timeEstimate}
                    </p>
                    <div className="ctas">
                      <a
                        className="btn btn-wa"
                        href={buildWhatsAppUrl(wizardRecommendation.whatsappMsg)}
                        target="_blank"
                        rel="noopener"
                      >
                        <Icon name="wa" />
                        <span>Agendar {wizardRecommendation.shortTitle}</span>
                      </a>
                      <a
                        className="btn btn-ghost-w"
                        href={`/${wizardRecommendation.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToLp(wizardRecommendation);
                        }}
                      >
                        Ver página do serviço
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. VÍDEO INTERATIVO REMOTION (CARREGADO SOB DEMANDA PARA 100% PAGESPEED!) */}
            <section className="sec dark" id="remotion-tour" ref={remotionRef}>
              <div className="wrap remotion-wrap">
                <div className="sec-head" style={{ marginBottom: 4 }}>
                  <span className="kicker" style={{ color: '#fff' }}>
                    Apresentação em Movimento · Remotion
                  </span>
                  <h2 className="h2">
                    <span className="lt">Entenda em 15 segundos por que</span> a Auto Visão é líder
                    em Campinas
                  </h2>
                </div>

                <div className="remotion-nav" role="group" aria-label="Escolher cena da animação">
                  {[
                    { idx: null, label: '▶ Reproduzir Tudo' },
                    { idx: 0, label: '1. DETRAN & Cautelar' },
                    { idx: 1, label: '2. Vistoria 360º®' },
                    { idx: 2, label: '3. Scanner KM & Bateria EV' },
                    { idx: 3, label: '4. Pesados & Empresas' },
                    { idx: 4, label: '5. Mapa 5 Lojas Campinas' },
                  ].map((btn) => (
                    <button
                      key={String(btn.idx)}
                      type="button"
                      className={`remotion-pill ${remotionScene === btn.idx ? 'active' : ''}`}
                      onClick={() => {
                        setLoadRemotion(true);
                        setRemotionScene(btn.idx);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="remotion-stage">
                  {loadRemotion ? (
                    <Suspense
                      fallback={
                        <div
                          style={{
                            aspectRatio: '1120 / 540',
                            display: 'grid',
                            placeItems: 'center',
                            background: '#ED3237',
                            color: '#fff',
                            fontFamily: 'var(--f-head)',
                            fontWeight: 900,
                            fontSize: 22,
                          }}
                        >
                          Carregando apresentação interativa Auto Visão...
                        </div>
                      }
                    >
                      <LazyRemotionPlayerEmbed activeSceneOverride={remotionScene} />
                    </Suspense>
                  ) : (
                    <div
                      style={{
                        aspectRatio: '1120 / 540',
                        display: 'grid',
                        placeItems: 'center',
                        background: '#ED3237',
                        color: '#fff',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => setLoadRemotion(true)}
                      >
                        ▶ Iniciar Apresentação Animada
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* =====================================================================
            7. NOSSAS LOJAS EM CAMPINAS (SITELINK #nossas-lojas)
           ===================================================================== */}
        <section className="sec alt" id="nossas-lojas">
          <div className="wrap" id="unidades">
            <div className="sec-head">
              <span className="kicker">Nossas Lojas · 5 Unidades em Campinas</span>
              <h2 className="h2">
                <span className="lt">Sempre tem uma Auto Visão</span> perto de você em Campinas
              </h2>
              <p className="lead">
                Todas as 5 unidades atendem pelo WhatsApp <strong>{WA_DISPLAY}</strong> e pela
                Central Fixa <strong>{CENTRAL_DISPLAY}</strong>.
              </p>
            </div>

            {/* BANNER DESTAQUE UNIDADE DE PLANTÃO SÁBADO ATÉ 16H */}
            <div className="duty-banner">
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <span className="duty-badge">
                    <Icon name="clock" />
                    Unidade de Plantão aos Sábados até as 16h
                  </span>
                </div>
                <h3 className="h2" style={{ color: '#fff' }}>
                  <span className="lt">Fechou negócio no fim de semana?</span> Sábado até as 16h na
                  Abolição!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
                  A nossa{' '}
                  <strong>Unidade 3 — Rua da Abolição, 2036 (em frente ao Extra Abolição)</strong>{' '}
                  atende em plantão especial aos sábados das <strong>08h às 16h</strong>. As demais
                  4 unidades abrem aos sábados das 08h às 12h.
                </p>
                <div className="ctas" style={{ marginTop: 4 }}>
                  <a
                    className="btn btn-wa"
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar na Unidade de Plantão Abolição (Ponte Preta).'
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="wa" />
                    <span>Agendar no WhatsApp {WA_DISPLAY}</span>
                  </a>
                  <a
                    className="btn btn-ghost-w"
                    href="https://www.google.com/maps/search/?api=1&query=Rua+da+Aboli%C3%A7%C3%A3o%2C+2036+%E2%80%93+Ponte+Preta%2C+Campinas%2FSP"
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="gmaps" />
                    <span>Abrir no Google Maps</span>
                  </a>
                </div>
              </div>
              <div className="duty-card-photo">
                <img
                  src="/assets/img/loja-campinas-ponte-preta.webp"
                  alt="Fachada da Unidade de Plantão Auto Visão Ponte Preta - Rua da Abolição, 2036, Campinas"
                  loading="lazy"
                  decoding="async"
                />
                <span>Aberta Sábado das 08h às 16h · DETRAN-SP nº 9072</span>
              </div>
            </div>

            {/* Busca por bairro */}
            <div className="stores-tools">
              <label className="search">
                <Icon name="search" />
                <span className="sr">Buscar unidade por bairro em Campinas</span>
                <input
                  type="search"
                  placeholder="Filtrar por bairro (Taquaral, Centro, Abolição, Campos Elíseos, Amoreiras...)"
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
                {onlySatDuty ? '✓ Mostrando Plantão Sábado 16h' : 'Filtrar Plantão Sábado até 16h'}
              </button>
              <span className="count">{filteredUnits.length} unidades em Campinas/SP</span>
            </div>

            {/* Cards das 5 Unidades de Campinas */}
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
                        ★ Unidade de Plantão aos Sábados: 08h às 16h
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
                        {openNow ? 'Aberta agora' : 'Horário: 08h–18h'}
                      </span>
                    </div>
                    <div className="unit-b">
                      <h3>{u.name}</h3>
                      <dl>
                        <div>
                          <dt>
                            <Icon name="pin" />
                            <span className="sr">Endereço</span>
                          </dt>
                          <dd>
                            {u.address}
                            <small>Ref.: {u.reference}</small>
                          </dd>
                        </div>
                        <div>
                          <dt>
                            <Icon name="clock" />
                            <span className="sr">Horário de Funcionamento</span>
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
                        <div>
                          <dt>
                            <Icon name="wa" />
                            <span className="sr">WhatsApp da Unidade</span>
                          </dt>
                          <dd>
                            <a
                              href={buildWhatsAppUrl(u.whatsappMsg)}
                              target="_blank"
                              rel="noopener"
                            >
                              WhatsApp {WA_DISPLAY}
                            </a>
                            <small>Central Fixa: {CENTRAL_DISPLAY}</small>
                          </dd>
                        </div>
                        <div>
                          <dt>
                            <Icon name="shield" />
                            <span className="sr">Credenciamento e CNPJ</span>
                          </dt>
                          <dd>
                            Credenciada {u.detran}
                            <small>CNPJ: {u.cnpj}</small>
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
                        <span>Chamar no WhatsApp {WA_DISPLAY}</span>
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
                <span className="kicker">Atendimento Rápido</span>
                <h3>Não sabe qual das 5 lojas está mais perto?</h3>
                <p>
                  Chame no WhatsApp e indicamos na hora a unidade mais próxima de você em Campinas.
                </p>
                <a
                  className="btn btn-white"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e quero saber qual das 5 lojas está mais próxima de mim agora.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>WhatsApp {WA_DISPLAY}</span>
                </a>
              </div>
            </div>

            <p className="callout" style={{ marginTop: 28 }}>
              <Icon name="file" />
              <span>
                <strong>Documentos necessários para a vistoria:</strong> Documento do veículo
                (CRLV-e digital ou impresso / CRV) e documento oficial com foto do condutor (CNH ou
                RG).
              </span>
            </p>
          </div>
        </section>

        {/* =====================================================================
            8. SOBRE NÓS (#sobre-nos) + NOSSO CONTATO (#nosso-contato)
           ===================================================================== */}
        <section className="sec" id="sobre-nos">
          <div className="wrap schedule-grid">
            <div className="net-copy">
              <span className="kicker">Sobre Nós · Nascida em Campinas em 2006</span>
              <h2 className="h2">
                <span className="lt">Quase 20 anos protegendo</span> quem compra, vende e transfere
                em Campinas.
              </h2>
              <p className="lead">
                Fundada em Campinas/SP em 2006, a <strong>Auto Visão®</strong> nasceu para acabar
                com a insegurança no mercado de veículos usados e se tornou uma das maiores redes do
                Brasil (+240 unidades e +80 mil laudos/mês). Em nossas 5 lojas de Campinas, seu
                carro é avaliado com tecnologia de ponta e imparcialidade total.
              </p>

              <ul className="why">
                <li>
                  <span className="ico">
                    <Icon name="shield" />
                  </span>
                  <div>
                    <h3>Credenciamento DETRAN-SP e ISO 9001</h3>
                    <p>
                      Processos padronizados, peritos certificados e seguro de responsabilidade
                      civil profissional.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="ico">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <h3>Canais Oficiais de Atendimento em Campinas</h3>
                    <p>
                      WhatsApp de Agendamento: <strong>{WA_DISPLAY}</strong> · Telefone Fixo
                      Central: <strong>{CENTRAL_DISPLAY}</strong>.
                    </p>
                  </div>
                </li>
              </ul>

              <figure className="net-photo" style={{ marginTop: 12 }}>
                <img
                  src="/assets/img/fachada-auto-visao.webp"
                  alt="Fachada Oficial Auto Visão Vistorias Automotivas em Campinas"
                  loading="lazy"
                  decoding="async"
                  width="1280"
                  height="937"
                />
                <figcaption>
                  <Icon name="store" /> Seu carro em boas mãos em Campinas
                </figcaption>
              </figure>
            </div>

            {/* Sitelink #nosso-contato: Formulário de Contato e Pré-Agendamento Direto para o WhatsApp */}
            <div className="schedule-card" id="nosso-contato">
              <span className="kicker">Nosso Contato & Pré-Agendamento</span>
              <h3 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>
                <span className="lt">Garanta prioridade pelo</span> WhatsApp {WA_DISPLAY}
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 15 }}>
                Escolha a vistoria e a unidade abaixo para enviar sua solicitação pronta no
                WhatsApp, ou ligue no fixo{' '}
                <a href={`tel:${CENTRAL_TEL}`} style={{ fontWeight: 700 }}>
                  {CENTRAL_DISPLAY}
                </a>
                .
              </p>

              <form className="schedule-form" onSubmit={handleScheduleSubmit}>
                <div className="field full">
                  <label htmlFor="sch-service">Qual vistoria você precisa?</label>
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
                  <label htmlFor="sch-unit">Qual unidade de Campinas prefere?</label>
                  <select
                    id="sch-unit"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                  >
                    {CAMPINAS_UNITS.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} — {u.address.split('–')[0]}
                      </option>
                    ))}
                    <option value="Indicar a mais próxima de mim">
                      Não sei — me indique a unidade mais próxima
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
                  <label htmlFor="sch-plate">Veículo ou Placa (opcional)</label>
                  <input
                    id="sch-plate"
                    type="text"
                    placeholder="Ex.: Compass / ABC1D23"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sch-date">Dia / Período preferido</label>
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
                    <span>Agendar Agora no WhatsApp {WA_DISPLAY}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================================
            9. PERGUNTAS FREQUENTES (FAQ ENXUTO)
           ===================================================================== */}
        <section className="sec alt" id="duvidas">
          <div className="wrap faq-cols">
            <div className="faq-side">
              <span className="kicker">Dúvidas Frequentes</span>
              <h2 className="h2">
                <span className="lt">Perguntas rápidas sobre</span> vistoria em Campinas
              </h2>
              <p className="lead">
                Prefere falar direto com a nossa equipe? Chame no WhatsApp{' '}
                <strong>{WA_DISPLAY}</strong> ou ligue no fixo <strong>{CENTRAL_DISPLAY}</strong>.
              </p>
              <div className="ctas">
                <a
                  className="btn btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e tenho uma dúvida sobre vistoria.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>WhatsApp {WA_DISPLAY}</span>
                </a>
                <a className="btn btn-ghost" href={`tel:${CENTRAL_TEL}`}>
                  <Icon name="phone" />
                  <span>Fixo {CENTRAL_DISPLAY}</span>
                </a>
              </div>
            </div>

            <div className="faq">
              {FAQ_ITEMS.map((item, idx) => (
                <details key={idx} open={idx === 0}>
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
            10. CTA FINAL DE CONVERSÃO
           ===================================================================== */}
        <section className="final" aria-label="Agende sua vistoria em Campinas">
          <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
            <use href="#rings" />
          </svg>
          <div className="wrap">
            <div>
              <span className="kicker">Agende sua vistoria agora</span>
              <h2 className="h2" style={{ marginTop: 14 }}>
                <span className="lt">Seu carro em boas mãos</span> nas 5 unidades de Campinas.
              </h2>
              <p>
                Atendimento imediato pelo WhatsApp no Taquaral, Centro, Ponte Preta (Abolição —
                Plantão Sábado até 16h), Campos Elíseos e Parque Industrial.
              </p>
            </div>
            <div className="final-card">
              <a
                className="btn btn-wa"
                href={buildWhatsAppUrl(
                  activeLpService
                    ? activeLpService.whatsappMsg
                    : 'Olá! Vim pelo site da Auto Visão Campinas e gostaria de saber o valor e agendar uma vistoria.'
                )}
                target="_blank"
                rel="noopener"
              >
                <Icon name="wa" />
                <span>Agende pelo WhatsApp {WA_DISPLAY}</span>
              </a>
              <a
                className="btn btn-ghost-w"
                href="#nossas-lojas"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('nossas-lojas');
                }}
              >
                <Icon name="pin" />
                <span>Ver Endereços das 5 Lojas</span>
              </a>
              <small>
                <Icon name="phone" /> Telefone Fixo Central:{' '}
                <a href={`tel:${CENTRAL_TEL}`} style={{ color: '#fff', fontWeight: 700 }}>
                  {CENTRAL_DISPLAY}
                </a>
              </small>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          RODAPÉ INSTITUCIONAL + LINKS GOOGLE ADS (SITELINKS E LPs)
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
                Campinas e mais de 240 lojas em todo o Brasil. Seu carro em boas mãos.
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
              <ul className="ft-social">
                <li>
                  <a
                    href="https://www.instagram.com/autovisaooficial/"
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram da Auto Visão"
                  >
                    <Icon name="insta" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/autovisaovistorias/"
                    target="_blank"
                    rel="noopener"
                    aria-label="Facebook da Auto Visão"
                  >
                    <Icon name="face" />
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@autovisao.com" aria-label="E-mail da Auto Visão">
                    <Icon name="mail" />
                  </a>
                </li>
              </ul>
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
              <h4>Atendimento Campinas</h4>
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
                  <a href={`tel:${CENTRAL_TEL}`}>Telefone Fixo {CENTRAL_DISPLAY}</a>
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
              🔗 Sitelinks e Landing Pages para Google Ads (Clique para copiar as URLs)
            </summary>

            <div style={{ marginTop: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 10 }}>
                <strong>Sitelinks Institucionais (Google Ads):</strong>
              </p>
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
                        {copiedSlug === sl.slug ? '✓ Copiado' : 'Copiar URL'}
                      </button>
                    </b>
                    <code>/{sl.slug}</code>
                  </div>
                ))}
              </div>

              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 10 }}>
                <strong>Landing Pages por Serviço (Grupos de Anúncios):</strong>
              </p>
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
                        {copiedSlug === s.slug ? '✓ Copiado' : 'Copiar URL'}
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
                Auto Visão® e Vistoria 360º® devidamente registradas no INPI (nº 930578732).
              </li>
            </ul>
          </div>

          <div className="ft-bottom">
            <span>
              © {new Date().getFullYear()} Auto Visão Vistorias Automotivas — Unidades Campinas.
              Todos os direitos reservados.
            </span>
            <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setPrivacyOpen(true)}>
                Política de Privacidade (LGPD)
              </button>
              <button type="button" onClick={() => setCookieBanner(true)}>
                Preferências de Cookies
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
          aria-label="Escolher unidade em Campinas para abrir no Google Maps"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSheet(null);
          }}
        >
          <div className="sheet-panel">
            <div className="sheet-head">
              <div>
                <h3>Escolha a Unidade em Campinas</h3>
                <small>Toque em Google Maps para abrir a rota ou chame no WhatsApp</small>
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
                    <small>
                      {u.reference} · {u.detran}
                    </small>
                  </div>
                  <div className="sheet-unit-actions">
                    <a
                      href={u.mapsUrl}
                      target="_blank"
                      rel="noopener"
                      className="sheet-btn maps"
                    >
                      <Icon name="gmaps" />
                      <span>Abrir no Google Maps</span>
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
          aria-label="Resumo dos serviços de vistoria"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSheet(null);
          }}
        >
          <div className="sheet-panel">
            <div className="sheet-head">
              <div>
                <h3>Nossas Vistorias (Resumo)</h3>
                <small>Toque no serviço para ver o banner e todos os detalhes</small>
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

      {/* MODAL DETALHADO DE CADA SERVIÇO */}
      {selectedService && (
        <div
          className="svc-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="svc-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedService(null);
          }}
        >
          <div className="svc-modal">
            <div className={`svc-modal-hero ${selectedService.featured ? 'red' : ''}`}>
              <button
                type="button"
                className="svc-modal-close"
                aria-label="Fechar detalhes do serviço"
                onClick={() => setSelectedService(null)}
              >
                <Icon name="x" />
              </button>
              <span className="kicker" style={{ color: '#fff' }}>
                {selectedService.kicker}
              </span>
              <h2 className="h1" id="svc-modal-title" style={{ color: '#fff', marginTop: 10 }}>
                <span className="lt" style={{ display: 'block' }}>
                  {selectedService.headlineLight}
                </span>
                {selectedService.headlineBold}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 12, fontSize: 17 }}>
                {selectedService.salesCopy}
              </p>
            </div>

            <div className="svc-modal-body">
              <div className="svc-modal-cols">
                <div className="box">
                  <h3>
                    <Icon name="check" /> O que é avaliado
                  </h3>
                  <ul>
                    {selectedService.checklist.map((c, idx) => (
                      <li key={idx}>
                        <Icon name="check" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
                  <div className="box dk">
                    <h3>
                      <Icon name="file" /> O que você recebe
                    </h3>
                    <ul>
                      {selectedService.deliverables.map((d, idx) => (
                        <li key={idx}>
                          <Icon name="check" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTop: '1px solid var(--line)',
                }}
              >
                <div className="ctas">
                  <a
                    className="btn btn-wa"
                    href={buildWhatsAppUrl(selectedService.whatsappMsg)}
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="wa" />
                    <span>Agendar no WhatsApp {WA_DISPLAY}</span>
                  </a>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedService(null)}
                >
                  Fechar
                </button>
              </div>
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
                Campinas/SP e a franqueadora <strong>Auto Visão Franchising LTDA</strong> tratam os
                dados pessoais de clientes e visitantes, em conformidade com a Lei Geral de Proteção
                de Dados (LGPD).
              </p>
              <h3>1. Dados coletados</h3>
              <ul>
                <li>
                  <strong>Agendamento e Contato:</strong> Nome, telefone/WhatsApp, placa/modelo do
                  veículo e unidade escolhida quando você entra em contato voluntariamente.
                </li>
                <li>
                  <strong>Execução de Vistoria:</strong> Dados do veículo (placa, chassi, motor,
                  CRLV) e do condutor/proprietário exigidos pelo DETRAN-SP e normas técnicas.
                </li>
              </ul>
              <h3>2. Finalidade do tratamento</h3>
              <ul>
                <li>Realizar o agendamento na unidade escolhida em Campinas;</li>
                <li>Emitir laudos oficiais ECV junto ao DETRAN-SP e laudos cautelares/técnicos;</li>
                <li>Melhorar a experiência de navegação e atendimento.</li>
              </ul>
              <h3>3. Direitos do titular e Encarregado (DPO)</h3>
              <p>
                Você pode solicitar confirmação, acesso, correção ou exclusão de dados a qualquer
                momento pelo e-mail <a href="mailto:lgpd@autovisao.com">lgpd@autovisao.com</a> ou{' '}
                <a href="mailto:contato@autovisao.com">contato@autovisao.com</a>.
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
            Utilizamos cookies essenciais e de medição para oferecer a melhor experiência de
            agendamento nas 5 lojas de Campinas. Saiba mais na{' '}
            <a
              href="#privacidade"
              onClick={(e) => {
                e.preventDefault();
                setPrivacyOpen(true);
              }}
            >
              Política de Privacidade
            </a>
            .
          </p>
          <div className="row">
            <button type="button" className="btn" onClick={() => saveCookieConsent('all')}>
              Aceitar todos
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => saveCookieConsent('essential')}
            >
              Apenas necessários
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

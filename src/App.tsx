import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '@remotion/player';
import { AutoVisaoShowreel } from './remotion/AutoVisaoShowreel';
import { SvgSprites, Icon } from './components/SvgSprites';
import {
  CAMPINAS_UNITS,
  VISTORIA_SERVICES,
  FAQ_ITEMS,
  WA_DISPLAY,
  CENTRAL_DISPLAY,
  CENTRAL_TEL,
  buildWhatsAppUrl,
  VistoriaService,
} from './data/campinasData';

export function App() {
  // Hero Carousel State
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // Remotion Showreel Scene Filter
  const [remotionScene, setRemotionScene] = useState<number | null>(null);

  // Interactive X-Ray Hotspot State
  const [xraySpot, setXraySpot] = useState(0);

  // Services Category Filter State
  const [serviceTab, setServiceTab] = useState<string>('all');

  // Selected Service for Detail Modal
  const [selectedService, setSelectedService] = useState<VistoriaService | null>(null);

  // Wizard ("Qual vistoria eu preciso?") State
  const [wzGoal, setWzGoal] = useState<string>('comprar');
  const [wzVeh, setWzVeh] = useState<string>('carro');

  // Unit Locator Filter State
  const [unitSearch, setUnitSearch] = useState('');
  const [onlySatDuty, setOnlySatDuty] = useState(false);

  // Header & Scroll State
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Quick Pre-Schedule Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formService, setFormService] = useState('Vistoria Cautelar Completa');
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
        const days: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        setSpTime({ d: days[parts.weekday] ?? 1, h: +parts.hour + +parts.minute / 60 });
      } catch {
        // Fallback
      }
    };
    updateTime();
    const t = setInterval(updateTime, 60000);
    return () => clearInterval(t);
  }, []);

  const isUnitOpen = (satCloseHour: number) => {
    const { d, h } = spTime;
    if (d >= 1 && d <= 5) return h >= 8 && h < 18;
    if (d === 6) return h >= 8 && h < satCloseHour;
    return false;
  };

  // Hero Auto-Play
  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 5);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroPaused]);

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

  // X-Ray 6 Points Data
  const xrayPoints = [
    {
      title: '1. Chassi, Motor e Câmbio',
      desc: 'Conferência óptica e pericial da gravação de chassi e motor: detectamos adulterações, remarcações ou divergências com a base oficial do DETRAN-SP.',
      services: 'Vistoria do DETRAN · Vistoria Cautelar · Vistoria 360º®',
      left: '31%',
      top: '72%',
    },
    {
      title: '2. Gravação dos Vidros e Etiquetas ETA',
      desc: 'Verificamos a originalidade dos vidros e das etiquetas autodestrutivas de fábrica (ETA) nas colunas e compartimento do motor.',
      services: 'Vistoria Cautelar · Vistoria 360º® · Vistoria Premium',
      left: '47%',
      top: '37%',
    },
    {
      title: '3. Estrutura (Longarinas, Colunas e Assoalho)',
      desc: 'Inspecionamos longarinas dianteiras/traseiras, colunas A/B/C, caixas de roda e painel corta-fogo contra colisões estruturais, cortes ou emendas.',
      services: 'Vistoria Cautelar · Vistoria 360º® · Vistoria Premium',
      left: '63%',
      top: '58%',
    },
    {
      title: '4. Medição Micrométrica de Pintura (µm)',
      desc: 'Medimos a espessura da tinta peça a peça com medidor digital para identificar repinturas estéticas, retoques e uso de massa plástica.',
      services: 'Vistoria de Pintura · Vistoria 360º® · Vistoria Premium',
      left: '86%',
      top: '64%',
    },
    {
      title: '5. Scanner de Módulos (KM Real) e Bateria EV',
      desc: 'Lemos via porta OBD-II a quilometragem real gravada nos módulos eletrônicos (Motor, Câmbio, ABS, Airbag) e a saúde da bateria (AVILOO) em elétricos/híbridos.',
      services: 'Scanner de KM · Bateria Elétricos/Híbridos · 360º® Max · Premium',
      left: '12%',
      top: '66%',
    },
    {
      title: '6. Histórico Completo (Leilão, Sinistro, Roubo e Débitos)',
      desc: 'Cruzamos bancos de dados nacionais para apontar passagem por leilão, indício de sinistro, histórico de roubo/furto, bloqueios judiciais e multas.',
      services: 'Vistoria Cautelar · Vistoria 360º® · Financeira · Seguradora',
      left: '75%',
      top: '30%',
    },
  ];

  // Filtered Services
  const filteredServices = useMemo(() => {
    if (serviceTab === 'all') return VISTORIA_SERVICES;
    return VISTORIA_SERVICES.filter((s) => s.category.includes(serviceTab as any));
  }, [serviceTab]);

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

  // Wizard Recommendation Logic covering all 13 services
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
    if (wzGoal === 'seguro') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-seguradora')!;
    }
    if (wzGoal === 'financeira') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-financeira')!;
    }
    if (wzGoal === 'protecao') {
      return VISTORIA_SERVICES.find((s) => s.id === 'vistoria-protecao-automotiva')!;
    }
    // Comprar ou Vender
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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
              Central {CENTRAL_DISPLAY}
            </a>
            <a
              href={buildWhatsAppUrl(
                'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
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

      {/* HEADER STICKY */}
      <header className={`hdr ${scrolled ? 'sc' : ''}`}>
        <div className="wrap">
          <a
            className="logo"
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
              href="#destaques"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('destaques');
              }}
            >
              DETRAN & Cautelar
            </a>

            {/* Dropdown Todos os 12+ Serviços */}
            <div className={`dd ${openDropdown === 'servicos' ? 'open' : ''}`} data-dd>
              <button
                className="dd-btn"
                type="button"
                aria-expanded={openDropdown === 'servicos'}
                onClick={() => setOpenDropdown((d) => (d === 'servicos' ? null : 'servicos'))}
              >
                Vistorias
                <Icon name="chev" className="i dd-chev" />
              </button>
              <div className="dd-menu">
                {VISTORIA_SERVICES.map((svc) => (
                  <a
                    key={svc.id}
                    href={`#${svc.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedService(svc);
                      setMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    <Icon name={svc.icon} />
                    <span>{svc.shortTitle}</span>
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#vistoria-360-destaque"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('vistoria-360-destaque');
              }}
            >
              Vistoria 360º®
            </a>

            <a
              href="#unidades"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('unidades');
              }}
            >
              5 Lojas
            </a>

            <a
              href="#comparar"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('comparar');
              }}
            >
              Comparar
            </a>

            <a
              href="#duvidas"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('duvidas');
              }}
            >
              Dúvidas
            </a>

            <a
              className="btn btn-sm btn-wa"
              href={buildWhatsAppUrl(
                'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
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
            HERO CAROUSEL (5 BANNERS NO PADRÃO ESTRITO DO DESIGN SYSTEM)
           ===================================================================== */}
        <section
          className={`hero ${heroPaused ? 'paused' : ''}`}
          id="inicio"
          aria-roledescription="carrossel"
          aria-label="Destaques Auto Visão Campinas"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <div className="slides">
            {/* SLIDE 1: COMBO CAUTELAR + VISTORIA DO DETRAN EM CAMPINAS */}
            <div
              className={`slide red ${heroSlide === 0 ? 'is-on' : ''}`}
              role="group"
              aria-roledescription="banner"
              aria-label="1 de 5"
              aria-hidden={heroSlide !== 0}
            >
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <div className="wrap">
                <div className="slide-copy">
                  <span className="kicker">5 Lojas Credenciadas DETRAN-SP em Campinas</span>
                  <h1 className="h-display">
                    <span className="lt">Vistoria do DETRAN e Cautelar</span>em um só atendimento.
                  </h1>
                  <p className="lead">
                    Vai comprar, vender ou transferir em Campinas? Descubra todo o histórico e a
                    estrutura do veículo e já saia com o laudo oficial de Transferência do DETRAN-SP
                    na mesma visita.
                  </p>
                  <div className="chips">
                    <span className="chip">
                      <Icon name="store" /> Taquaral · Centro · Abolição · Campos Elíseos · Amoreiras
                    </span>
                    <span className="chip">
                      <Icon name="clock" /> Plantão Sábados até 16h
                    </span>
                  </div>
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
                      href="#unidades"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('unidades');
                      }}
                    >
                      <Icon name="pin" />
                      <span>Ver as 5 Lojas em Campinas</span>
                    </a>
                  </div>
                </div>

                {/* Arte Vetorial DS: Carro de Família + Lupa + 3 Etiquetas */}
                <div className="art">
                  <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
                    <use href="#car-sym" />
                  </svg>
                  <svg className="lens" viewBox="0 0 200 200" aria-hidden="true">
                    <circle
                      cx="86"
                      cy="86"
                      r="62"
                      fill="rgba(255,255,255,.10)"
                      stroke="#fff"
                      strokeWidth="22"
                    />
                    <path d="M134 134l42 42" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
                    <circle cx="86" cy="86" r="16" fill="#151415" />
                  </svg>
                  <span className="tagc t1">
                    <b>
                      <Icon name="shield" />
                    </b>
                    <span>
                      Vistoria DETRAN-SP<small>transferência na hora</small>
                    </span>
                  </span>
                  <span className="tagc t2">
                    <b>
                      <Icon name="search" />
                    </b>
                    <span>
                      Vistoria Cautelar<small>estrutura e leilão</small>
                    </span>
                  </span>
                  <span className="tagc t3">
                    <b>
                      <Icon name="orbit" />
                    </b>
                    <span>
                      Vistoria 360º®<small>+180 itens avaliados</small>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* SLIDE 2: VISTORIA CAUTELAR COM CARTÃO DE LAUDO ILUSTRATIVO */}
            <div
              className={`slide dark ${heroSlide === 1 ? 'is-on' : ''}`}
              role="group"
              aria-roledescription="banner"
              aria-label="2 de 5"
              aria-hidden={heroSlide !== 1}
            >
              <div className="wrap">
                <div className="slide-copy">
                  <span className="kicker">Vistoria Cautelar em Campinas</span>
                  <h2 className="h-display">
                    <span className="lt">Quem você ama</span>merece um carro vistoriado.
                  </h2>
                  <p className="lead">
                    Preço bom demais pode esconder leilão, sinistro grave, chassi adulterado,
                    massa plástica ou bloqueios judiciais. Faça a Vistoria Cautelar antes de
                    assinar ou pagar!
                  </p>
                  <div className="ctas">
                    <a
                      className="btn btn-wa"
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
                      href="#servicos"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('servicos');
                      }}
                    >
                      Conhecer todas as vistorias
                    </a>
                  </div>
                </div>

                {/* Cartão de Laudo Oficial DS (Seção 6 do PDF) */}
                <div className="report" aria-hidden="true">
                  <div className="report-h">
                    <img src="/assets/img/logo-autovisao.svg" alt="" width="120" height="28" />
                    <span>
                      LAUDO DE VISTORIA
                      <br />
                      CAUTELAR · CAMPINAS
                    </span>
                  </div>
                  <div className="report-car">
                    <span>SUV Compacto · Ilustrativo</span>
                    <em>ABC1D23</em>
                  </div>
                  <ul>
                    <li>
                      <span>
                        <Icon name="list" />
                        Histórico de Leilão e Sinistro
                      </span>
                      <span className="ok">
                        <Icon name="check" />
                        Conferido
                      </span>
                    </li>
                    <li>
                      <span>
                        <Icon name="search" />
                        Roubo, Furto e Gravame
                      </span>
                      <span className="ok">
                        <Icon name="check" />
                        Conferido
                      </span>
                    </li>
                    <li>
                      <span>
                        <Icon name="scan" />
                        Chassi, Motor, Câmbio e Vidros
                      </span>
                      <span className="ok">
                        <Icon name="check" />
                        Conferido
                      </span>
                    </li>
                    <li>
                      <span>
                        <Icon name="car" />
                        Longarinas, Colunas e Estrutura
                      </span>
                      <span className="ok">
                        <Icon name="check" />
                        Conferido
                      </span>
                    </li>
                    <li>
                      <span>
                        <Icon name="paint" />
                        Pintura e Massa Plástica
                      </span>
                      <span className="ok">
                        <Icon name="check" />
                        Conferido
                      </span>
                    </li>
                  </ul>
                  <div className="report-f">
                    <Icon name="file" /> Laudo na hora com fotos e checklist · Placa ilustrativa
                  </div>
                  <span className="stamp">
                    Seu carro
                    <br />
                    em boas mãos
                  </span>
                </div>
              </div>
            </div>

            {/* SLIDE 3: NOSSA VISTORIA 360º® (360º, PLUS COM VÍDEO E MAX COM SCANNER) */}
            <div
              className={`slide red ${heroSlide === 2 ? 'is-on' : ''}`}
              role="group"
              aria-roledescription="banner"
              aria-label="3 de 5"
              aria-hidden={heroSlide !== 2}
            >
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <div className="wrap">
                <div className="slide-copy">
                  <span className="kicker">Exclusiva Auto Visão®</span>
                  <h2 className="h-display">
                    <span className="lt">Nossa Vistoria 360º®:</span>mais de 180 itens no mesmo laudo.
                  </h2>
                  <p className="lead">
                    Estrutura, pintura medida peça a peça, chassi e histórico completo. Conheça
                    também a 360º® Plus (com vídeo no WhatsApp) e a 360º® Max (com scanner de
                    módulos e Certificado do Carro).
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
                      href="#vistoria-360-destaque"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('vistoria-360-destaque');
                      }}
                    >
                      <span>Ver 360º® · Plus · Max</span>
                    </a>
                  </div>
                </div>

                {/* Celular do Vídeo Plus + Carro DS */}
                <div className="art vid-art" aria-hidden="true">
                  <div className="phone">
                    <div className="phone-scr">
                      <div className="phone-top">
                        <span className="rec" />
                        REC · 02:14 · VISTORIA 360º® PLUS
                      </div>
                      <div className="phone-car">
                        <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
                          <use href="#car-sym" />
                        </svg>
                        <span className="play">
                          <Icon name="chev" />
                        </span>
                      </div>
                      <div className="phone-bar">
                        <span />
                      </div>
                      <div className="phone-chips">
                        <span>
                          <Icon name="check" />
                          +180 itens
                        </span>
                        <span>
                          <Icon name="check" />
                          Pintura µm
                        </span>
                        <span>
                          <Icon name="check" />
                          Scanner KM
                        </span>
                      </div>
                      <div className="phone-msg">
                        <Icon name="wa" />
                        Enviado pelo WhatsApp
                      </div>
                    </div>
                  </div>
                  <span className="tagc t1">
                    <b>
                      <Icon name="paint" />
                    </b>
                    <span>
                      Pintura Peça a Peça<small>mapa em micrômetros</small>
                    </span>
                  </span>
                  <span className="tagc t3">
                    <b>
                      <Icon name="scan" />
                    </b>
                    <span>
                      Certificado do Carro<small>exclusivo na 360º® Max</small>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* SLIDE 4: NOVAS TECNOLOGIAS: SCANNER KM + BATERIA ELÉTRICOS/HÍBRIDOS + PREMIUM */}
            <div
              className={`slide dark ${heroSlide === 3 ? 'is-on' : ''}`}
              role="group"
              aria-roledescription="banner"
              aria-label="4 de 5"
              aria-hidden={heroSlide !== 3}
            >
              <div className="wrap">
                <div className="slide-copy">
                  <span className="kicker">Diagnóstico de Nova Geração</span>
                  <h2 className="h-display">
                    <span className="lt">Scanner de KM, Bateria EV</span>e Vistoria Premium.
                  </h2>
                  <p className="lead">
                    Auditamos a quilometragem real gravada nos módulos eletrônicos via OBD-II,
                    emitimos Certificado Independente AVILOO para baterias de carros elétricos e
                    híbridos e fazemos análise mecânica completa para veículos acima de R$ 200 mil.
                  </p>
                  <div className="ctas">
                    <a
                      className="btn btn-wa"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e quero agendar diagnóstico de Scanner de KM / Bateria Elétricos / Vistoria Premium.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Falar com Especialista</span>
                    </a>
                    <a
                      className="btn btn-ghost-w"
                      href="#servicos"
                      onClick={(e) => {
                        e.preventDefault();
                        setServiceTab('avancada');
                        scrollToSection('servicos');
                      }}
                    >
                      Ver análises avançadas
                    </a>
                  </div>
                </div>

                {/* Card Quilometragem Módulo x Painel (DS) */}
                <div className="kmc" aria-hidden="true">
                  <div className="kmc-h">
                    <Icon name="gauge" />
                    <span>AUDITORIA ELETRÔNICA OBD-II + BATERIA EV</span>
                  </div>
                  <div className="kmc-row">
                    <span>KM lido no módulo de Motor (ECU)</span>
                    <b>48.213 km</b>
                  </div>
                  <div className="kmc-row">
                    <span>KM lido no módulo de Câmbio / ABS</span>
                    <b>48.213 km</b>
                  </div>
                  <div className="kmc-row">
                    <span>Saúde da Bateria Elétrica (AVILOO)</span>
                    <b style={{ color: '#18743B' }}>Certificada</b>
                  </div>
                  <div className="kmc-ok">
                    <Icon name="check" />
                    <span>Quilometragem e Módulos Conferidos · Sem Fraude</span>
                  </div>
                  <span className="illus-note">Ilustração de exemplo</span>
                </div>
              </div>
            </div>

            {/* SLIDE 5: MAPA DAS 5 UNIDADES EM CAMPINAS + PLANTÃO SÁBADO ATÉ 16H */}
            <div
              className={`slide red ${heroSlide === 4 ? 'is-on' : ''}`}
              role="group"
              aria-roledescription="banner"
              aria-label="5 de 5"
              aria-hidden={heroSlide !== 4}
            >
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <div className="wrap">
                <div className="slide-copy">
                  <span className="kicker">5 Unidades em Campinas/SP</span>
                  <h2 className="h-display">
                    <span className="lt">Nascida em Campinas.</span>Sempre perto de você.
                  </h2>
                  <p className="lead">
                    Atendimento rápido no Taquaral, Centro (Castelo), Ponte Preta (Abolição —
                    Plantão aos sábados até 16h), Campos Elíseos e Parque Industrial (Amoreiras).
                  </p>
                  <div className="ctas">
                    <a
                      className="btn btn-dark"
                      href="#unidades"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('unidades');
                      }}
                    >
                      <Icon name="pin" />
                      <span>Escolher Unidade em Campinas</span>
                    </a>
                    <a
                      className="btn btn-wa"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e gostaria de saber qual unidade fica mais perto de mim.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Chamar no WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Mapa Ilustrado de Campinas (DS Seção 6) */}
                <div className="art map-art">
                  <svg className="cmap" viewBox="0 0 600 480" aria-hidden="true">
                    <defs>
                      <clipPath id="mclip-camp">
                        <rect width="600" height="480" rx="28" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#mclip-camp)">
                      <rect width="600" height="480" fill="#fff" />
                      <g stroke="#F1EEF0" strokeWidth="6" fill="none">
                        <path d="M-10 60 610 20M-10 130 610 100M-10 200 610 180M-10 280 610 250M-10 350 610 330M-10 430 610 410" />
                        <path d="M60-10 30 490M140-10 120 490M220-10 210 490M320-10 330 490M410-10 430 490M500-10 520 490" />
                      </g>
                      <ellipse cx="490" cy="80" rx="62" ry="36" fill="#EAF2F7" />
                      <path
                        d="M70 330c30-20 70-14 84 8s-6 50-40 52-70-36-44-60z"
                        fill="#EEF5EE"
                      />
                      <g stroke="#E4DFE2" strokeWidth="16" fill="none" strokeLinecap="round">
                        <path d="M-20 240C120 220 220 230 300 214S470 150 620 120" />
                        <path d="M300 214C320 270 360 300 386 318S460 400 480 500" />
                        <path d="M300 214C260 280 250 340 236 388S220 470 200 500" />
                      </g>
                      <path
                        d="M-20 420C80 360 110 300 142 262S190 120 240-20"
                        stroke="#151415"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M-20 420C80 360 110 300 142 262S190 120 240-20"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeDasharray="12 12"
                        fill="none"
                      />
                      <path
                        className="mroute"
                        d="M222 132C250 150 280 170 296 196"
                        stroke="#ED3237"
                        strokeWidth="4"
                        strokeDasharray="2 9"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </g>
                    <g transform="translate(210 122)">
                      <circle className="mpulse" r="22" fill="#151415" opacity=".25" />
                      <circle r="22" fill="#151415" />
                      <path
                        d="M-10 1 0-8 10 1M-7-1v10h14V-1"
                        stroke="#fff"
                        strokeWidth="2.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g transform="translate(-44 28)">
                        <rect
                          width="88"
                          height="22"
                          rx="11"
                          fill="#fff"
                          stroke="#151415"
                          strokeWidth="2"
                        />
                        <text
                          x="44"
                          y="15.5"
                          textAnchor="middle"
                          fontFamily="Nunito,sans-serif"
                          fontWeight="900"
                          fontSize="12"
                          fill="#151415"
                        >
                          Sua casa
                        </text>
                      </g>
                    </g>
                    {[
                      { label: 'Taquaral', x: 448, y: 112 },
                      { label: 'Centro', x: 300, y: 214 },
                      { label: 'Ponte Preta', x: 416, y: 288 },
                      { label: 'Campos Elíseos', x: 142, y: 262 },
                      { label: 'Pq. Industrial', x: 256, y: 396 },
                    ].map((p) => (
                      <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
                        <ellipse cx="0" cy="2" rx="10" ry="4" fill="#000" opacity=".18" />
                        <path
                          d="M0 0C-4-8-18-19-18-32a18 18 0 0 1 36 0C18-19 4-8 0 0z"
                          fill="#ED3237"
                        />
                        <circle cy="-32" r="9" fill="none" stroke="#fff" strokeWidth="4" />
                        <circle cy="-32" r="3.2" fill="#151415" />
                        <g transform="translate(-54 8)">
                          <rect width="108" height="24" rx="12" fill="#151415" />
                          <text
                            x="54"
                            y="16.5"
                            textAnchor="middle"
                            fill="#fff"
                            fontFamily="Nunito,sans-serif"
                            fontWeight="800"
                            fontSize="12"
                          >
                            {p.label}
                          </text>
                        </g>
                      </g>
                    ))}
                  </svg>
                  <span className="tagc t1">
                    <b>
                      <Icon name="shield" />
                    </b>
                    <span>
                      Credenciadas<small>DETRAN-SP</small>
                    </span>
                  </span>
                  <span className="tagc t3">
                    <b>
                      <Icon name="store" />
                    </b>
                    <span>
                      5 Unidades<small>em Campinas</small>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controles do Carrossel */}
          <div className="hero-ctrl">
            <div className="wrap">
              <div className="dots" role="group" aria-label="Escolher banner">
                {[0, 1, 2, 3, 4].map((idx) => (
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
                  onClick={() => setHeroSlide((s) => (s - 1 + 5) % 5)}
                >
                  <Icon name="arrowl" />
                </button>
                <button
                  className="arw"
                  aria-label="Próximo banner"
                  onClick={() => setHeroSlide((s) => (s + 1) % 5)}
                >
                  <Icon name="arrow" />
                </button>
              </div>
            </div>
          </div>

          {/* Faixa Quadriculada Oficial na Base do Hero */}
          <div className="strip" style={{ ['--h' as any]: '40px' }} aria-hidden="true" />
        </section>

        {/* =====================================================================
            FAIXA DE CONFIANÇA (TRUST BAR)
           ===================================================================== */}
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
                  <strong>12+ tipos de vistoria</strong>
                  <span>Do DETRAN e Cautelar à 360º®, EV e Pesados</span>
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

        {/* =====================================================================
            DESTAQUE PRINCIPAL: VISTORIA DO DETRAN & VISTORIA CAUTELAR
           ===================================================================== */}
        <section className="sec" id="destaques">
          <div className="wrap">
            <div className="sec-head center">
              <span className="kicker">Os Carros-Chefes em Campinas</span>
              <h2 className="h2">
                <span className="lt">Destaque para a</span> Vistoria do DETRAN e Vistoria Cautelar
              </h2>
              <p className="lead">
                Seja para transferir o documento com rapidez junto ao DETRAN-SP ou para blindar o
                seu bolso antes de fechar negócio em um usado, você conta com a rede que nasceu em
                Campinas e é referência nacional.
              </p>
            </div>

            <div className="flagship-grid">
              {/* CARD 1: VISTORIA DO DETRAN (TRANSFERÊNCIA) */}
              <article className="flagship-card detran">
                <div>
                  <span className="kicker" style={{ color: '#ED3237' }}>
                    OBRIGATÓRIA NA TRANSFERÊNCIA · ECV CREDENCIADA
                  </span>
                  <h3 style={{ marginTop: 12 }}>
                    <span className="lt">Vistoria do DETRAN</span>
                    Transferência e Regularização
                  </h3>
                  <p style={{ marginTop: 12 }}>
                    Comprou um veículo, vai mudar de município ou precisa de segunda via do CRV?
                    Nossas 5 unidades em Campinas são credenciadas oficialmente pelo DETRAN-SP para
                    emitir seu laudo de transferência na hora.
                  </p>
                  <ul className="flagship-list" style={{ marginTop: 18 }}>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Coleta óptica homologada de chassi, motor e placa Mercosul (QR Code)
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Conferência de todos os equipamentos obrigatórios exigidos pelo CONTRAN
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Transmissão imediata para o sistema e-CRVsp do DETRAN-SP (20 a 30 min)
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Atende carros, motos, utilitários, caminhões e veículos pesados
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="ctas" style={{ marginTop: 10 }}>
                  <a
                    className="btn btn-wa"
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria do DETRAN (Transferência).'
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="wa" />
                    <span>Agendar Vistoria do DETRAN</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost-w"
                    onClick={() =>
                      setSelectedService(
                        VISTORIA_SERVICES.find((s) => s.id === 'vistoria-detran') || null
                      )
                    }
                  >
                    Ver checklist completo
                  </button>
                </div>
              </article>

              {/* CARD 2: VISTORIA CAUTELAR COMPLETA */}
              <article className="flagship-card cautelar">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span className="kicker">PROTEÇÃO TOTAL ANTES DE COMPRAR OU VENDER</span>
                  <h3 style={{ marginTop: 12 }}>
                    <span className="lt">Vistoria Cautelar</span>
                    Estrutura, Identificação e Histórico
                  </h3>
                  <p style={{ marginTop: 12 }}>
                    Não compre no escuro! Avaliamos toda a estrutura do veículo para garantir que
                    ele nunca sofreu colisão grave ou adulteração, além de levantar todo o
                    passado em bases oficiais e privadas.
                  </p>
                  <ul className="flagship-list" style={{ marginTop: 18 }}>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Estrutura: longarinas, colunas, painel frontal/traseiro, teto e assoalho
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Histórico completo: passagem por leilão, indício de sinistro, roubo e furto
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Originalidade de chassi, motor, câmbio, vidros e etiquetas de fábrica (ETA)
                      </span>
                    </li>
                    <li>
                      <span className="ok-dot">
                        <Icon name="check" />
                      </span>
                      <span>
                        Pesquisa de restrições judiciais, gravame financeiro, multas e débitos
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="ctas" style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
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
                  <button
                    type="button"
                    className="btn btn-ghost-w"
                    onClick={() =>
                      setSelectedService(
                        VISTORIA_SERVICES.find((s) => s.id === 'vistoria-cautelar') || null
                      )
                    }
                  >
                    O que é avaliado
                  </button>
                </div>
              </article>
            </div>

            {/* Banner Combo Cautelar + Transferência */}
            <div className="promo" style={{ marginTop: 28 }}>
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <div>
                <span className="kicker">Combo Inteligente Campinas</span>
                <h3 className="h2" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
                  <span className="lt">Vai comprar e já transferir?</span> Faça Cautelar +
                  Transferência DETRAN no mesmo atendimento!
                </h3>
                <p>
                  Economize tempo e dinheiro: valide a estrutura e a procedência do carro antes de
                  pagar e já saia com o laudo oficial do DETRAN-SP pronto para a transferência.
                </p>
              </div>
              <div className="ctas">
                <a
                  className="btn btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e quero solicitar o Combo Cautelar + Transferência DETRAN.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>Solicitar Combo no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SHOWREEL INTERATIVO EM REMOTION (ANIMAÇÃO PROGRAMÁTICA 30FPS)
           ===================================================================== */}
        <section className="sec dark" id="remotion-tour">
          <div className="wrap remotion-wrap">
            <div className="sec-head" style={{ marginBottom: 8 }}>
              <span className="kicker" style={{ color: '#ED3237' }}>
                Showreel Interativo · Powered by Remotion
              </span>
              <h2 className="h2">
                <span className="lt">Veja em movimento como a</span> Auto Visão protege o seu
                patrimônio
              </h2>
              <p className="lead">
                Navegue pelas cenas abaixo ou assista à apresentação animada em tempo real de todas
                as tecnologias das nossas unidades de Campinas.
              </p>
            </div>

            {/* Botões seletores de cena Remotion */}
            <div className="remotion-nav" role="group" aria-label="Escolher cena da animação">
              {[
                { idx: null, label: '▶ Reproduzir Tudo (Auto)' },
                { idx: 0, label: '1. DETRAN & Cautelar' },
                { idx: 1, label: '2. Vistoria 360º® & Pintura' },
                { idx: 2, label: '3. Scanner KM & Bateria EV' },
                { idx: 3, label: '4. Pesados, Empresas & Pátio' },
                { idx: 4, label: '5. Mapa das 5 Lojas Campinas' },
              ].map((btn) => (
                <button
                  key={String(btn.idx)}
                  type="button"
                  className={`remotion-pill ${remotionScene === btn.idx ? 'active' : ''}`}
                  onClick={() => setRemotionScene(btn.idx)}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="remotion-stage">
              <Player
                component={AutoVisaoShowreel}
                inputProps={{ activeSceneOverride: remotionScene }}
                durationInFrames={450}
                compositionWidth={1120}
                compositionHeight={540}
                fps={30}
                style={{ width: '100%', height: 'auto', aspectRatio: '1120 / 540' }}
                controls
                loop
                autoPlay
              />
            </div>
          </div>
        </section>

        {/* =====================================================================
            CATÁLOGO COMPLETO COM TODAS AS 12+ VISTORIAS OFERECIDAS HOJE
           ===================================================================== */}
        <section className="sec alt" id="servicos">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Portfólio Completo em Campinas</span>
              <h2 className="h2">
                <span className="lt">Muito além do básico:</span> todos os tipos de vistoria para
                você e sua empresa
              </h2>
              <p className="lead">
                Hoje as unidades Auto Visão de Campinas realizam desde a Vistoria do DETRAN e
                Cautelar até diagnósticos eletrônicos de quilometragem, baterias de elétricos e
                híbridos, caminhões pesados, pátios públicos, seguradoras e veículos premium.
              </p>
            </div>

            {/* Resumo Direto para SEO e IAs (GEO / ChatGPT / Google SGE) */}
            <div className="tldr">
              <b>Resumo rápido dos 12+ serviços em Campinas:</b> Fazemos{' '}
              <b>Vistoria do DETRAN (Transferência)</b>, <b>Vistoria Cautelar</b>,{' '}
              <b>Nossa Vistoria 360º® (+180 itens, Plus e Max)</b>, <b>Vistoria de Pintura</b>,{' '}
              <b>Vistoria de KM com Scanner de Módulo</b>,{' '}
              <b>Vistoria de Bateria para Veículos Elétricos e Híbridos (Certificado AVILOO)</b>,{' '}
              <b>Vistoria em Veículos Pesados</b>, <b>Vistoria para Financeira</b>,{' '}
              <b>Seguradora (Prévia)</b>, <b>Proteção Automotiva</b>,{' '}
              <b>Vistoria em Pátio Público</b>, <b>Vistoria de Infração de Trânsito</b> e{' '}
              <b>Vistoria Premium (acima de R$ 200 mil)</b>.
            </div>

            {/* Abas de Filtro */}
            <div className="tabs" role="group" aria-label="Filtrar serviços de vistoria">
              {[
                { id: 'all', label: `Todas as Vistorias (${VISTORIA_SERVICES.length})` },
                { id: 'destaque', label: 'Mais Procuradas' },
                { id: 'comprar', label: 'Comprar ou Vender' },
                { id: 'transferir', label: 'DETRAN, Pátio e Infração' },
                { id: 'avancada', label: 'Pintura, Scanner, Elétricos e Premium' },
                { id: 'pesados', label: 'Caminhões e Pesados' },
                { id: 'empresas', label: 'Financeira, Seguradora e Proteção' },
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

            {/* Grade de Cards de Todos os Serviços */}
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
                  <h3>{svc.title}</h3>
                  <p>{svc.summary}</p>
                  <ul>
                    {svc.checklist.slice(0, 3).map((item, idx) => (
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
                    <button
                      type="button"
                      className="link-arrow"
                      style={{
                        background: 'none',
                        border: 0,
                        padding: 0,
                        color: svc.featured && serviceTab === 'all' ? '#fff' : undefined,
                      }}
                      onClick={() => setSelectedService(svc)}
                    >
                      <span>Ver tudo que inclui</span>
                      <Icon name="arrow" />
                    </button>
                  </div>
                </article>
              ))}

              {/* Card de Ajuda na Grade */}
              <div className="sv-help full">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <div>
                  <span className="kicker">Ainda em dúvida sobre qual escolher?</span>
                  <h3 className="h3">
                    Use nosso recomendador em 2 cliques ou fale direto com a central de Campinas.
                  </h3>
                </div>
                <div className="ctas">
                  <a
                    className="btn btn-white"
                    href="#qual-vistoria"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('qual-vistoria');
                    }}
                  >
                    Descobrir minha vistoria ideal
                  </a>
                  <a
                    className="btn btn-ghost-w"
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de ajuda para escolher a vistoria certa para o meu caso.'
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="wa" />
                    <span>Falar com Consultor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SPOTLIGHT EXCLUSIVO: NOSSA VISTORIA 360º® + PLUS + MAX + PREMIUM
           ===================================================================== */}
        <section className="sec dark x360" id="vistoria-360-destaque">
          <div className="wrap x360-g">
            <div className="x360-copy">
              <span className="kicker">Exclusiva Auto Visão®</span>
              <h2 className="h2">
                <span className="lt">Nossa Vistoria 360º®:</span> o carro visto por inteiro.
              </h2>
              <p className="lead">
                A Vistoria 360º® é a perícia mais completa da rede Auto Visão. São mais de 180
                aspectos avaliados em um único atendimento: estrutura, pintura peça a peça em
                micrômetros, chassi, motor e histórico completo.
              </p>
              <div className="ctas">
                <a
                  className="btn btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar a Nossa Vistoria 360º®.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>Agendar a Vistoria 360º®</span>
                </a>
                <button
                  type="button"
                  className="btn btn-ghost-w"
                  onClick={() =>
                    setSelectedService(
                      VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null
                    )
                  }
                >
                  Ver todos os +180 itens
                </button>
              </div>

              {/* 3 Selos Oficiais SVG (360º, Plus e Max) */}
              <div className="seal-row">
                <a
                  href="#vistoria-360"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(
                      VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null
                    );
                  }}
                >
                  <svg className="seal" viewBox="0 0 200 200" role="img" aria-label="Selo Vistoria 360º®">
                    <circle cx="100" cy="100" r="92" fill="#ED3237" stroke="#fff" strokeWidth="4" />
                    <circle cx="100" cy="100" r="76" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="100" y="96" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="42" fill="#fff">
                      360º
                    </text>
                    <rect x="34" y="110" width="132" height="26" rx="6" fill="#151415" />
                    <text x="100" y="128" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="13" letterSpacing="2" fill="#fff">
                      CERTIFICADA
                    </text>
                  </svg>
                  <span>360º® (+180 itens)</span>
                </a>

                <a
                  href="#vistoria-360"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(
                      VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null
                    );
                  }}
                >
                  <svg className="seal" viewBox="0 0 200 200" role="img" aria-label="Selo Vistoria 360º® Plus">
                    <circle cx="100" cy="100" r="92" fill="#151415" stroke="#ED3237" strokeWidth="4" />
                    <circle cx="100" cy="100" r="76" fill="none" stroke="#ED3237" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="100" y="96" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="42" fill="#fff">
                      360º
                    </text>
                    <rect x="52" y="110" width="96" height="26" rx="6" fill="#ED3237" />
                    <text x="100" y="128" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="14" letterSpacing="2" fill="#fff">
                      PLUS
                    </text>
                  </svg>
                  <span>360º® Plus (+ Vídeo)</span>
                </a>

                <a
                  href="#vistoria-360"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(
                      VISTORIA_SERVICES.find((s) => s.id === 'vistoria-360') || null
                    );
                  }}
                >
                  <svg className="seal" viewBox="0 0 200 200" role="img" aria-label="Selo Vistoria 360º® Max">
                    <circle cx="100" cy="100" r="92" fill="#151415" stroke="#fff" strokeWidth="4" />
                    <circle cx="100" cy="100" r="76" fill="none" stroke="#ED3237" strokeWidth="2" />
                    <text x="100" y="96" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="42" fill="#fff">
                      360º
                    </text>
                    <rect x="52" y="110" width="96" height="26" rx="6" fill="#fff" />
                    <text x="100" y="128" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="900" fontSize="14" letterSpacing="2" fill="#ED3237">
                      MAX
                    </text>
                  </svg>
                  <span>360º® Max (+ Scanner)</span>
                </a>
              </div>
            </div>

            <div className="x360-num" aria-hidden="true">
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <b>
                180<sup>+</sup>
              </b>
              <span>itens avaliados</span>
            </div>

            <ul className="x360-list">
              <li>
                <span className="ico">
                  <Icon name="paint" />
                </span>
                <div>
                  <h3>Pintura Peça a Peça</h3>
                  <p>Medição micrométrica (µm) para revelar repinturas, retoques e massa plástica.</p>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="video" />
                </span>
                <div>
                  <h3>Vídeo no WhatsApp (Plus)</h3>
                  <p>Receba o vídeo do carro funcionando (motor, ar-condicionado, painel e luzes).</p>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="scan" />
                </span>
                <div>
                  <h3>Scanner OBD-II & KM (Max)</h3>
                  <p>Auditoria eletrônica da quilometragem nos módulos e Certificado do Carro.</p>
                </div>
              </li>
              <li>
                <span className="ico">
                  <Icon name="star" />
                </span>
                <div>
                  <h3>Vistoria Premium (&gt; R$ 200k)</h3>
                  <p>Tem um carro acima de R$ 200 mil? Nossa Vistoria Premium inclui análise mecânica completa.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* =====================================================================
            RAIO-X INTERATIVO DO CARRO DE FAMÍLIA (6 PONTOS DE VERIFICAÇÃO)
           ===================================================================== */}
        <section className="sec" id="raio-x">
          <div className="wrap family">
            <div className="family-copy">
              <span className="kicker">Raio-X Interativo Auto Visão</span>
              <h2 className="h2">
                <span className="lt">O que nossos peritos enxergam</span> que não aparece a olho nu.
              </h2>
              <p className="lead">
                Um carro recém-polido pode parecer impecável por fora e esconder longarinas soldadas,
                quilometragem adulterada nos módulos, bateria degradada ou passagem por leilão de
                sinistro.
              </p>
              <ul className="why">
                <li>
                  <span className="ico">
                    <Icon name="shield" />
                  </span>
                  <div>
                    <h3>Segurança para a sua família</h3>
                    <p>
                      A estrutura (longarinas e colunas) absorve o impacto em um acidente. Garantimos
                      que ela esteja íntegra.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="ico">
                    <Icon name="gauge" />
                  </span>
                  <div>
                    <h3>Tecnologia contra fraudes eletrônicas</h3>
                    <p>
                      Scanner de módulos para auditar KM real, medidor micrométrico de tinta e
                      certificação AVILOO para baterias de elétricos/híbridos.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="ico">
                    <Icon name="file" />
                  </span>
                  <div>
                    <h3>Proteção do seu dinheiro na revenda</h3>
                    <p>
                      Evite comprar um veículo desvalorizado por leilão ou sinistro oculto sem saber.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="ctas">
                <a
                  className="btn btn-wa"
                  href={buildWhatsAppUrl(
                    'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma vistoria completa.'
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="wa" />
                  <span>Agendar pelo WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Palco Interativo do Carro de Família DS */}
            <div className="xray">
              <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                <use href="#rings" />
              </svg>
              <p className="xray-hint">
                <Icon name="search" /> Toque nos números de 1 a 6 no veículo para inspecionar:
              </p>
              <div className="xray-stage">
                <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
                  <use href="#car-sym" />
                </svg>
                {xrayPoints.map((pt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="hot"
                    style={{ left: pt.left, top: pt.top }}
                    aria-label={pt.title}
                    aria-pressed={xraySpot === idx}
                    onClick={() => setXraySpot(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="xray-panel" aria-live="polite">
                <span className="num">{xraySpot + 1}</span>
                <div>
                  <h3>{xrayPoints[xraySpot].title}</h3>
                  <p>{xrayPoints[xraySpot].desc}</p>
                  <small>{xrayPoints[xraySpot].services}</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            BLOCOS DE ALTA CONVERSÃO: PINTURA, SCANNER DE KM E BATERIA ELÉTRICOS
           ===================================================================== */}
        <section className="sec alt" id="tecnologias">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Diagnósticos Especializados em Campinas</span>
              <h2 className="h2">
                <span className="lt">Tecnologia de ponta em</span> Pintura, Scanner de KM e Carros
                Elétricos
              </h2>
              <p className="lead">
                Contrate individualmente ou combine com a sua Vistoria Cautelar / 360º® no mesmo
                atendimento em Campinas.
              </p>
            </div>

            <div className="bands">
              {/* BANDA 1: VISTORIA DE PINTURA PEÇA A PEÇA */}
              <div className="plus addon-band rdv">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <div className="plus-copy">
                  <span className="plus-badge">
                    <Icon name="paint" />
                    Vistoria de Pintura · Mapa em µm
                  </span>
                  <h3 className="h2">
                    <span className="lt">Medição micrométrica</span> peça a peça da carroceria
                  </h3>
                  <p>
                    Medimos digitalmente a espessura do verniz e da tinta em cada painel do carro.
                    Identificamos na hora se a pintura é original de fábrica, se houve repintura
                    estética ou se esconde reparo de funilaria com massa plástica.
                  </p>
                  <ul>
                    <li>
                      <Icon name="check" />
                      <span>Medição digital em micrômetros (µm)</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Detecção de massa plástica e retoques</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Mapa visual peça a peça no laudo</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Análise de remoção de portas e capô</span>
                    </li>
                  </ul>
                  <div className="ctas">
                    <a
                      className="btn btn-white"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Pintura.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Agendar Vistoria de Pintura</span>
                    </a>
                  </div>
                </div>
                <div className="band-art">
                  <div className="art v-art">
                    <svg className="v-svg" viewBox="0 0 600 420" aria-hidden="true">
                      <svg x="0" y="70" width="600" height="270" viewBox="0 0 600 270">
                        <use href="#car-sym" />
                      </svg>
                      {[
                        { x: 150, y: 120, val: '102 µm', ok: true },
                        { x: 300, y: 98, val: '96 µm', ok: true },
                        { x: 420, y: 112, val: '310 µm', ok: false },
                        { x: 520, y: 175, val: '99 µm', ok: true },
                        { x: 240, y: 205, val: '104 µm', ok: true },
                      ].map((m, i) => (
                        <g key={i} transform={`translate(${m.x} ${m.y})`}>
                          <circle
                            r="7"
                            fill={m.ok ? '#18743B' : '#ED3237'}
                            stroke="#fff"
                            strokeWidth="3"
                          />
                          <g transform="translate(-36 -42)">
                            <rect
                              width="72"
                              height="26"
                              rx="13"
                              fill={m.ok ? '#fff' : '#151415'}
                            />
                            <text
                              x="36"
                              y="17.5"
                              textAnchor="middle"
                              fontFamily="Nunito,sans-serif"
                              fontWeight="900"
                              fontSize="12.5"
                              fill={m.ok ? '#151415' : '#fff'}
                            >
                              {m.val}
                            </text>
                          </g>
                        </g>
                      ))}
                      <g transform="translate(395 300)">
                        <rect width="150" height="80" rx="16" fill="#151415" />
                        <rect x="12" y="12" width="126" height="34" rx="8" fill="#2b2a2b" />
                        <text
                          x="75"
                          y="35"
                          textAnchor="middle"
                          fontFamily="Nunito,sans-serif"
                          fontWeight="900"
                          fontSize="18"
                          fill="#fff"
                        >
                          310 µm
                        </text>
                        <text
                          x="75"
                          y="66"
                          textAnchor="middle"
                          fontFamily="Nunito,sans-serif"
                          fontWeight="800"
                          fontSize="11"
                          fill="#ED3237"
                          letterSpacing="1.5"
                        >
                          REPINTURA
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* BANDA 2: VISTORIA DE KM COM SCANNER DE MÓDULO */}
              <div className="plus addon-band dkv">
                <div className="plus-copy">
                  <span className="plus-badge">
                    <Icon name="gauge" />
                    Vistoria de KM com Scanner de Módulo
                  </span>
                  <h3 className="h2">
                    <span className="lt">Descubra se o hodômetro</span> foi adulterado antes de
                    comprar
                  </h3>
                  <p>
                    Nosso scanner profissional lê os módulos eletrônicos do veículo via porta OBD-II:
                    comparamos a quilometragem gravada na central de injeção, câmbio, ABS e airbag
                    com o número exibido no painel, além de rastrear códigos de falha ocultos.
                  </p>
                  <ul>
                    <li>
                      <Icon name="check" />
                      <span>Quilometragem nos módulos x painel</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Varredura de falhas em Motor e Câmbio</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Diagnóstico eletrônico de ABS e Airbag</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Relatório técnico impresso e digital</span>
                    </li>
                  </ul>
                  <div className="ctas">
                    <a
                      className="btn btn-wa"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de KM com Scanner de Módulo.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Agendar Scanner de KM</span>
                    </a>
                  </div>
                </div>
                <div className="band-art">
                  <div className="art v-art">
                    <svg className="v-svg" viewBox="0 0 600 420" aria-hidden="true">
                      <path
                        d="M82 300C70 360 170 380 210 330S240 240 262 236"
                        fill="none"
                        stroke="#3a3a3c"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      <g transform="translate(40 250)">
                        <path d="M0 10h90l-10 46H10z" fill="#e9e7e8" />
                        <text
                          x="45"
                          y="-6"
                          textAnchor="middle"
                          fontFamily="Nunito,sans-serif"
                          fontWeight="900"
                          fontSize="12"
                          fill="#fff"
                          letterSpacing="1.5"
                        >
                          PORTA OBD-II
                        </text>
                      </g>
                      <rect
                        x="230"
                        y="52"
                        width="270"
                        height="340"
                        rx="28"
                        fill="#2b2a2b"
                        stroke="#3d3b3c"
                        strokeWidth="2"
                      />
                      <rect x="248" y="72" width="234" height="204" rx="12" fill="#fff" />
                      <rect x="248" y="72" width="234" height="36" rx="12" fill="#ED3237" />
                      <text
                        x="266"
                        y="95"
                        fontFamily="Nunito,sans-serif"
                        fontWeight="900"
                        fontSize="13"
                        fill="#fff"
                        letterSpacing="1.5"
                      >
                        SCANNER DE MÓDULOS
                      </text>
                      {[
                        { label: 'MÓDULO MOTOR (ECU)', y: 140 },
                        { label: 'MÓDULO CÂMBIO (TCU)', y: 174 },
                        { label: 'MÓDULO ABS / FREIOS', y: 208 },
                        { label: 'MÓDULO AIRBAG (SRS)', y: 242 },
                      ].map((row) => (
                        <g key={row.label}>
                          <text
                            x="266"
                            y={row.y}
                            fontFamily="Nunito,sans-serif"
                            fontWeight="800"
                            fontSize="13.5"
                            fill="#151415"
                          >
                            {row.label}
                          </text>
                          <rect x="422" y={row.y - 14} width="46" height="20" rx="10" fill="#18743B" />
                          <text
                            x="445"
                            y={row.y + 1}
                            textAnchor="middle"
                            fontFamily="Nunito,sans-serif"
                            fontWeight="900"
                            fontSize="11.5"
                            fill="#fff"
                          >
                            OK
                          </text>
                        </g>
                      ))}
                      <rect x="248" y="290" width="234" height="44" rx="10" fill="#151415" />
                      <text
                        x="264"
                        y="317"
                        fontFamily="Nunito,sans-serif"
                        fontWeight="800"
                        fontSize="13"
                        fill="rgba(255,255,255,.75)"
                      >
                        KM auditado no módulo
                      </text>
                      <text
                        x="468"
                        y="318"
                        textAnchor="end"
                        fontFamily="Nunito,sans-serif"
                        fontWeight="900"
                        fontSize="17"
                        fill="#fff"
                      >
                        48.213 km
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* BANDA 3: VISTORIA DE BATERIA PARA ELÉTRICOS E HÍBRIDOS */}
              <div className="plus addon-band rdv">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <div className="plus-copy">
                  <span className="plus-badge">
                    <Icon name="battery" />
                    Elétricos e Híbridos · Certificado AVILOO
                  </span>
                  <h3 className="h2">
                    <span className="lt">Vistoria de Bateria para</span> Veículos Elétricos e
                    Híbridos
                  </h3>
                  <p>
                    A bateria de alta tensão é o componente mais caro de um carro elétrico ou
                    híbrido. Emitimos o Certificado Independente AVILOO atestando a saúde real da
                    bateria de tração (SoH), além de inspecionar o cofre inferior, inversores e
                    estrutura.
                  </p>
                  <ul>
                    <li>
                      <Icon name="check" />
                      <span>Saúde real da bateria de tração (SoH)</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Certificação internacional AVILOO</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>Inspeção inferior do pack de baterias</span>
                    </li>
                    <li>
                      <Icon name="check" />
                      <span>BYD, GWM, Volvo, Toyota, BMW, Porsche e mais</span>
                    </li>
                  </ul>
                  <div className="ctas">
                    <a
                      className="btn btn-white"
                      href={buildWhatsAppUrl(
                        'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Bateria para Veículo Elétrico / Híbrido.'
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="wa" />
                      <span>Agendar Vistoria Elétrico / Híbrido</span>
                    </a>
                  </div>
                </div>
                <div className="band-art">
                  {/* Ilustração Oficial da Bateria DS Seção 6 */}
                  <div
                    style={{
                      background: '#151415',
                      borderRadius: 24,
                      padding: 32,
                      width: '100%',
                      maxWidth: 400,
                      textAlign: 'center',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
                    }}
                  >
                    <svg viewBox="0 0 320 170" style={{ width: '100%', height: 'auto' }}>
                      <rect
                        x="24"
                        y="26"
                        width="246"
                        height="118"
                        rx="28"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="16"
                      />
                      <rect x="278" y="62" width="18" height="46" rx="6" fill="#FFFFFF" />
                      <rect x="48" y="50" width="46" height="70" rx="10" fill="#ED3237" />
                      <rect x="104" y="50" width="46" height="70" rx="10" fill="#ED3237" />
                      <rect x="160" y="50" width="46" height="70" rx="10" fill="#ED3237" />
                      <rect x="216" y="50" width="34" height="70" rx="10" fill="#2C2A2B" />
                      <path d="M162 52 L140 86 H162 L150 118 L182 80 H160 Z" fill="#FFFFFF" />
                    </svg>
                    <div
                      style={{
                        marginTop: 12,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className="ok">
                        <Icon name="check" /> Certificado Independente AVILOO
                      </span>
                      <span className="ok">
                        <Icon name="check" /> Módulos + Estrutura OK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            ASSISTENTE INTERATIVO: "QUAL VISTORIA EU PRECISO?"
           ===================================================================== */}
        <section className="sec" id="qual-vistoria">
          <div className="wrap">
            <div className="sec-head center">
              <span className="kicker">Recomendador Inteligente</span>
              <h2 className="h2">
                <span className="lt">Qual vistoria</span> eu preciso hoje?
              </h2>
              <p className="lead">
                Selecione o seu objetivo e o tipo de veículo para ver a recomendação ideal da nossa
                equipe técnica em Campinas.
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
                      { v: 'financeira', label: 'Financeira / Consórcio', icon: 'building' },
                      { v: 'seguro', label: 'Contratar Seguradora', icon: 'shield' },
                      { v: 'protecao', label: 'Proteção Automotiva', icon: 'heart' },
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
                <span className="kicker">Recomendação Oficial Auto Visão Campinas</span>
                <h3>{wizardRecommendation.title}</h3>
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
                  <button
                    type="button"
                    className="btn btn-ghost-w"
                    onClick={() => setSelectedService(wizardRecommendation)}
                  >
                    Ver todos os detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            TABELA COMPARATIVA LADO A LADO
           ===================================================================== */}
        <section className="sec alt" id="comparar">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">Compare Lado a Lado</span>
              <h2 className="h2">
                <span className="lt">O que cada análise</span> inclui
              </h2>
              <p className="lead">
                Compare as principais modalidades e escolha a vistoria ideal para a sua necessidade
                em Campinas.
              </p>
            </div>

            <div className="mx-wrap" tabIndex={0} role="region" aria-label="Tabela comparativa de vistorias">
              <table className="mx">
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left' }}>
                      Item avaliado
                    </th>
                    <th scope="col">
                      <span className="ico">
                        <Icon name="file" />
                      </span>
                      Vistoria DETRAN
                      <small>Transferência</small>
                    </th>
                    <th scope="col">
                      <span className="ico">
                        <Icon name="search" />
                      </span>
                      Cautelar
                      <small>Compra segura</small>
                    </th>
                    <th scope="col" className="hl">
                      <span className="ico">
                        <Icon name="orbit" />
                      </span>
                      Vistoria 360º®
                      <small>+180 itens</small>
                    </th>
                    <th scope="col">
                      <span className="ico">
                        <Icon name="video" />
                      </span>
                      360º® Plus
                      <small>+ Vídeo WhatsApp</small>
                    </th>
                    <th scope="col">
                      <span className="ico">
                        <Icon name="scan" />
                      </span>
                      360º® Max
                      <small>+ Scanner e Certificado</small>
                    </th>
                    <th scope="col">
                      <span className="ico">
                        <Icon name="star" />
                      </span>
                      Premium
                      <small>Acima de R$ 200 mil</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Exigida pelo DETRAN-SP na transferência',
                      vals: [true, false, false, false, false, false],
                    },
                    {
                      label: 'Identificação: chassi, motor, câmbio e vidros',
                      vals: [true, true, true, true, true, true],
                    },
                    {
                      label: 'Estrutura: longarinas, colunas e originalidade',
                      vals: [false, true, true, true, true, true],
                    },
                    {
                      label: 'Histórico: leilão, sinistro, roubo/furto e débitos',
                      vals: [false, true, true, true, true, true],
                    },
                    {
                      label: 'Medição de pintura peça a peça (µm)',
                      vals: [false, false, true, true, true, true],
                    },
                    {
                      label: 'Mais de 180 itens avaliados em checklist',
                      vals: [false, false, true, true, true, true],
                    },
                    {
                      label: 'Vídeo de funcionamento enviado no WhatsApp',
                      vals: [false, false, false, true, true, false],
                    },
                    {
                      label: 'Scanner eletrônico dos módulos e auditoria de KM',
                      vals: [false, false, false, false, true, true],
                    },
                    {
                      label: 'Certificado Oficial do Carro Auto Visão',
                      vals: [false, false, false, false, true, true],
                    },
                    {
                      label: 'Análise mecânica completa (motor, câmbio, suspensão)',
                      vals: [false, false, false, false, false, true],
                    },
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <th scope="row">{row.label}</th>
                      {row.vals.map((v, cIdx) => (
                        <td key={cIdx} className={cIdx === 2 ? 'hl' : ''}>
                          {v ? (
                            <span className="yes" aria-label="Inclui">
                              <Icon name="check" />
                            </span>
                          ) : (
                            <span className="no" aria-label="Não inclui" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Versão compacta Mobile */}
            <div className="mxs" role="region" aria-label="Comparativo resumido no celular">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">DETRAN</th>
                    <th scope="col">Cautelar</th>
                    <th scope="col" className="hl">
                      360º®
                    </th>
                    <th scope="col">Max</th>
                    <th scope="col">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Válida DETRAN Transferência', v: [true, false, false, false, false] },
                    { label: 'Chassi, motor e vidros', v: [true, true, true, true, true] },
                    { label: 'Estrutura e Histórico (Leilão)', v: [false, true, true, true, true] },
                    { label: 'Pintura peça a peça (µm)', v: [false, false, true, true, true] },
                    { label: 'Scanner de KM + Módulos', v: [false, false, false, true, true] },
                    { label: 'Avaliação Mecânica Completa', v: [false, false, false, false, true] },
                  ].map((r, i) => (
                    <tr key={i}>
                      <th scope="row">{r.label}</th>
                      {r.v.map((inc, j) => (
                        <td key={j} className={j === 2 ? 'hl' : ''}>
                          {inc ? (
                            <span className="y">
                              <Icon name="check" />
                            </span>
                          ) : (
                            <span className="n" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =====================================================================
            AS 5 UNIDADES EM CAMPINAS + DESTAQUE UNIDADE DE PLANTÃO SÁBADO ATÉ 16H
           ===================================================================== */}
        <section className="sec" id="unidades">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">5 Lojas Credenciadas DETRAN-SP em Campinas</span>
              <h2 className="h2">
                <span className="lt">Encontre a unidade Auto Visão</span> mais perto de você em
                Campinas
              </h2>
              <p className="lead">
                Todas as 5 unidades contam com sala de espera climatizada, café, Wi-Fi, pagamento
                facilitado e equipe pericial credenciada pelo DETRAN-SP.
              </p>
            </div>

            {/* BANNER DESTAQUE UNIDADE DE PLANTÃO SÁBADO ATÉ 16H (ABOLIÇÃO / PONTE PRETA) */}
            <div className="duty-banner">
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <span className="duty-badge">
                    <Icon name="clock" />
                    Unidade de Plantão aos Sábados até as 16h
                  </span>
                </div>
                <h3 className="h2" style={{ color: '#fff' }}>
                  <span className="lt">Precisa fazer vistoria no sábado à tarde?</span> Auto Visão
                  Ponte Preta (Abolição)
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16.5 }}>
                  Enquanto a maioria das empresas fecha ao meio-dia, a nossa{' '}
                  <strong>Unidade 3 — Rua da Abolição, 2036 (em frente ao Extra Abolição)</strong>{' '}
                  atende em plantão especial aos sábados das <strong>08h às 16h</strong> para você
                  fechar negócio no fim de semana com total segurança!
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
                    <span>Agendar no Plantão Abolição</span>
                  </a>
                  <a
                    className="btn btn-ghost-w"
                    href="https://waze.com/ul?q=Rua+da+Aboli%C3%A7%C3%A3o%2C+2036+%E2%80%93+Ponte+Preta%2C+Campinas%2FSP&navigate=yes"
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="waze" />
                    <span>Ir com Waze</span>
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
                />
                <span>Aberta Sábado das 08h às 16h · DETRAN-SP nº 9072</span>
              </div>
            </div>

            {/* Ferramentas de busca rápida por bairro */}
            <div className="stores-tools">
              <label className="search">
                <Icon name="search" />
                <span className="sr">Buscar unidade por bairro, rua ou referência em Campinas</span>
                <input
                  type="search"
                  placeholder="Buscar por bairro (ex: Taquaral, Centro, Abolição, Amoreiras...)"
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
                            <Icon name="phone" />
                            <span className="sr">Telefone Fixo</span>
                          </dt>
                          <dd>
                            <a href={`tel:${u.phoneTel}`}>{u.phoneDisplay}</a>
                          </dd>
                        </div>
                        <div>
                          <dt>
                            <Icon name="wa" />
                            <span className="sr">WhatsApp</span>
                          </dt>
                          <dd>
                            <a
                              href={buildWhatsAppUrl(u.whatsappMsg)}
                              target="_blank"
                              rel="noopener"
                            >
                              {u.whatsappDisplay}
                            </a>
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
                        <span>Agendar nesta unidade</span>
                      </a>
                      <div className="unit-nav">
                        <a className="ub" href={`tel:${u.phoneTel}`}>
                          <Icon name="phone" />
                          <span>Ligar</span>
                        </a>
                        <a className="ub" href={u.mapsUrl} target="_blank" rel="noopener">
                          <Icon name="gmaps" />
                          <span>Maps</span>
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

              {/* Card de Ajuda / Atendimento In Loco ou Dúvida de Localização */}
              <div className="unit-help">
                <svg className="rings" viewBox="0 0 800 800" aria-hidden="true">
                  <use href="#rings" />
                </svg>
                <span className="kicker">Atendimento Rápido</span>
                <h3>Não sabe qual das 5 lojas de Campinas está mais perto?</h3>
                <p>
                  Envie sua localização pelo WhatsApp e indicamos na hora a unidade mais próxima e
                  de menor movimento para você ser atendido imediatamente.
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
                  <span>Perguntar na Central {WA_DISPLAY}</span>
                </a>
              </div>
            </div>

            {/* Aviso de Documentos Necessários */}
            <p className="callout" style={{ marginTop: 28 }}>
              <Icon name="file" />
              <span>
                <strong>Documentos necessários para a vistoria:</strong> Documento do veículo
                (CRLV-e digital ou impresso / CRV) e documento oficial com foto de quem conduzir o
                veículo (CNH ou RG).
              </span>
            </p>
          </div>
        </section>

        {/* =====================================================================
            QUEM SOMOS (HISTÓRIA EM CAMPINAS DESDE 2006) + AGENDAMENTO RÁPIDO
           ===================================================================== */}
        <section className="sec alt" id="agendamento">
          <div className="wrap schedule-grid">
            <div className="net-copy">
              <span className="kicker">Nascida em Campinas · Presente em Todo o Brasil</span>
              <h2 className="h2">
                <span className="lt">Especialistas em vistorias</span> automotivas desde 2006.
              </h2>
              <p className="lead">
                Fundada em Campinas/SP em 2006, a <strong>Auto Visão®</strong> nasceu com a missão
                de proteger vidas e garantir transparência total na compra, venda e transferência de
                veículos. Hoje somos mais de 240 unidades pelo Brasil, mantendo em nossas 5 lojas de
                Campinas o rigor técnico que deu origem à rede.
              </p>

              <ul className="why">
                <li>
                  <span className="ico">
                    <Icon name="shield" />
                  </span>
                  <div>
                    <h3>Certificação ISO 9001 e Seguro de Responsabilidade Civil</h3>
                    <p>
                      Processos auditados, peritos em treinamento contínuo e laudos assegurados.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="ico">
                    <Icon name="clock" />
                  </span>
                  <div>
                    <h3>Laudo na Hora e Pagamento Facilitado</h3>
                    <p>
                      Atendimento ágil por ordem de chegada ou horário agendado, com todas as
                      formas de pagamento.
                    </p>
                  </div>
                </li>
              </ul>

              <figure className="net-photo" style={{ marginTop: 12 }}>
                <img
                  src="/assets/img/fachada-auto-visao.webp"
                  alt="Fachada Oficial Auto Visão Vistorias Automotivas em Campinas"
                  loading="lazy"
                  width="1280"
                  height="937"
                />
                <figcaption>
                  <Icon name="store" /> Seu carro em boas mãos em Campinas
                </figcaption>
              </figure>
            </div>

            {/* Formulário de Pré-Agendamento Direto para o WhatsApp */}
            <div className="schedule-card">
              <span className="kicker">Pré-Agendamento Online em 30 Segundos</span>
              <h3 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>
                <span className="lt">Garanta seu atendimento</span> prioritário em Campinas
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: 22, fontSize: 15 }}>
                Preencha os dados abaixo para gerar sua mensagem pronta e iniciar o atendimento
                imediato com a nossa central no WhatsApp <strong>{WA_DISPLAY}</strong>.
              </p>

              <form className="schedule-form" onSubmit={handleScheduleSubmit}>
                <div className="field full">
                  <label htmlFor="sch-service">Qual vistoria você precisa?</label>
                  <select
                    id="sch-service"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                  >
                    {VISTORIA_SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
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
                  <label htmlFor="sch-phone">Seu WhatsApp / Telefone</label>
                  <input
                    id="sch-phone"
                    type="tel"
                    placeholder="(19) 99999-9999"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="sch-plate">Modelo ou Placa (opcional)</label>
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
                    <span>Enviar Pré-Agendamento no WhatsApp</span>
                  </button>
                </div>
              </form>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: '1px dashed var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  fontSize: 13.5,
                  color: 'var(--muted)',
                }}
              >
                <span>✓ Atendimento imediato</span>
                <span>✓ 5 Lojas Credenciadas DETRAN-SP</span>
                <span>✓ Central: {CENTRAL_DISPLAY}</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PERGUNTAS FREQUENTES (FAQ OTIMIZADO PARA GOOGLE & CHATGPT)
           ===================================================================== */}
        <section className="sec" id="duvidas">
          <div className="wrap faq-cols">
            <div className="faq-side">
              <span className="kicker">Dúvidas Frequentes</span>
              <h2 className="h2">
                <span className="lt">Tudo sobre vistoria</span> veicular em Campinas
              </h2>
              <p className="lead">
                Respostas diretas sobre documentos, horários de plantão aos sábados, diferenças
                entre vistorias e atendimento para empresas.
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
                  <span>Tirar dúvida no WhatsApp</span>
                </a>
                <a className="btn btn-ghost" href={`tel:${CENTRAL_TEL}`}>
                  <Icon name="phone" />
                  <span>Ligar {CENTRAL_DISPLAY}</span>
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
            CTA FINAL DE CONVERSÃO (#ED3237 COM ANÉIS CONCÊNTRICOS)
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
                Chame no WhatsApp para saber valores, tirar dúvidas ou agendar seu atendimento sem
                espera no Taquaral, Centro, Ponte Preta (Abolição), Campos Elíseos ou Parque
                Industrial.
              </p>
            </div>
            <div className="final-card">
              <a
                className="btn btn-wa"
                href={buildWhatsAppUrl(
                  'Olá! Vim pelo site da Auto Visão Campinas e gostaria de saber o valor e agendar uma vistoria.'
                )}
                target="_blank"
                rel="noopener"
              >
                <Icon name="wa" />
                <span>Agende pelo WhatsApp {WA_DISPLAY}</span>
              </a>
              <a
                className="btn btn-ghost-w"
                href="#unidades"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('unidades');
                }}
              >
                <Icon name="pin" />
                <span>Ver Endereços das 5 Lojas</span>
              </a>
              <small>
                <Icon name="phone" /> Central de Atendimento Campinas:{' '}
                <a href={`tel:${CENTRAL_TEL}`} style={{ color: '#fff', fontWeight: 700 }}>
                  {CENTRAL_DISPLAY}
                </a>
              </small>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          RODAPÉ INSTITUCIONAL COMPLETO + FAIXA QUADRICULADA OFICIAL
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
              <h4>Todas as Vistorias</h4>
              <ul>
                {VISTORIA_SERVICES.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedService(s);
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
                  <a href={`tel:${CENTRAL_TEL}`}>Central {CENTRAL_DISPLAY}</a>
                </li>
                <li>
                  <a href="tel:+551932343929">Taquaral / Centro (19) 3234-3929</a>
                </li>
                <li>
                  <a href="tel:+551933684142">Pq. Industrial (19) 3368-4142</a>
                </li>
                <li>
                  <a href="mailto:contato@autovisao.com">contato@autovisao.com</a>
                </li>
                <li>
                  <a href="https://sejaumfranqueado.autovisao.com/" target="_blank" rel="noopener">
                    Seja um Franqueado Auto Visão
                  </a>
                </li>
              </ul>
            </div>
          </div>

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

      {/* =====================================================================
          MODAL DETALHADO DE CADA SERVIÇO (QUANDO O USUÁRIO CLICA EM UM SERVIÇO)
         ===================================================================== */}
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
                    <Icon name="check" /> O que é avaliado e conferido
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

                  <div className="box">
                    <h3>
                      <Icon name="users" /> Para quem é indicado
                    </h3>
                    <p style={{ fontSize: 15, color: 'var(--ink)' }}>{selectedService.idealFor}</p>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--action)',
                      }}
                    >
                      ⏱ Tempo médio de execução: {selectedService.timeEstimate}
                    </p>
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
                    <span>Agendar {selectedService.shortTitle} no WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      const title = selectedService.title;
                      setSelectedService(null);
                      setFormService(title);
                      scrollToSection('agendamento');
                    }}
                  >
                    Escolher Unidade em Campinas
                  </button>
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

      {/* =====================================================================
          MODAL DE POLÍTICA DE PRIVACIDADE (LGPD)
         ===================================================================== */}
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

      {/* BOTÃO FLUTUANTE WHATSAPP DESKTOP + VOLTAR AO TOPO + BARRA FIXA MOBILE */}
      <a
        className="fab"
        href={buildWhatsAppUrl(
          'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
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

      <nav className="mbar" aria-label="Atalhos rápidos no celular">
        <a
          href="#unidades"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('unidades');
          }}
        >
          <Icon name="pin" />5 Lojas
        </a>
        <a href={`tel:${CENTRAL_TEL}`}>
          <Icon name="phone" />
          Ligar
        </a>
        <a
          className="wa"
          href={buildWhatsAppUrl(
            'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria.'
          )}
          target="_blank"
          rel="noopener"
        >
          <Icon name="wa" />
          WhatsApp
        </a>
      </nav>
    </>
  );
}
export default App;

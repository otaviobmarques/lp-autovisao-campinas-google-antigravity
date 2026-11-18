import React from 'react';
import { Icon } from './SvgSprites';

export const ServiceHeroIllustration: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  switch (serviceId) {
    // 1. VISTORIA DO DETRAN (TRANSFERÊNCIA): Placa Mercosul ABC1D23 + Carro + Etiquetas
    case 'vistoria-detran':
      return (
        <div className="art">
          {/* Placa Mercosul girada -4deg */}
          <div
            style={{
              position: 'absolute',
              right: '6%',
              top: '4%',
              width: '54%',
              maxWidth: 260,
              background: '#fff',
              border: '6px solid #151415',
              borderRadius: 16,
              transform: 'rotate(-4deg)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <div
              style={{
                background: '#1D3A8A',
                color: '#fff',
                font: '900 11px/1 var(--f-head)',
                letterSpacing: '0.3em',
                textAlign: 'center',
                padding: '6px 0',
              }}
            >
              BRASIL
            </div>
            <div
              style={{
                font: '900 clamp(24px, 3vw, 34px)/1.1 var(--f-head)',
                color: '#151415',
                textAlign: 'center',
                padding: '8px 0 10px',
                letterSpacing: '0.04em',
              }}
            >
              ABC1D23
            </div>
          </div>

          <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
            <use href="#car-sym" />
          </svg>

          <span className="tagc t1">
            <b>
              <Icon name="shield" />
            </b>
            <span>
              Credenciada DETRAN-SP<small>laudo oficial na hora</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="check" />
            </b>
            <span>
              Chassi, Motor e Placa<small>sistema e-CRVsp</small>
            </span>
          </span>
        </div>
      );

    // 2. VISTORIA CAUTELAR: Carro de Família + Lupa + Etiquetas Flutuantes
    case 'vistoria-cautelar':
      return (
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
              Estrutura Avaliada<small>longarinas e colunas</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="search" />
            </b>
            <span>
              Histórico Completo<small>leilão, sinistro e roubo</small>
            </span>
          </span>
        </div>
      );

    // 3. NOSSA VISTORIA 360º®: Órbita 360º + Carro + Celular Plus
    case 'vistoria-360':
      return (
        <div className="art">
          <div
            style={{
              position: 'absolute',
              right: '4%',
              top: '-2%',
              font: '900 clamp(64px, 7vw, 96px)/0.9 var(--f-head)',
              color: '#fff',
            }}
          >
            360<span style={{ color: '#ED3237', fontSize: '0.6em' }}>°</span>
          </div>
          <svg
            viewBox="0 0 600 260"
            style={{ position: 'absolute', inset: '18% 0 0 0', width: '100%', overflow: 'visible' }}
          >
            <ellipse
              cx="300"
              cy="140"
              rx="280"
              ry="74"
              fill="none"
              stroke="#ED3237"
              strokeWidth="6"
              strokeDasharray="6 18"
              strokeLinecap="round"
            />
          </svg>
          <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
            <use href="#car-sym" />
          </svg>
          <span className="tagc t1">
            <b>
              <Icon name="orbit" />
            </b>
            <span>
              +180 Itens Avaliados<small>estrutura + pintura µm</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="video" />
            </b>
            <span>
              Versões Plus e Max<small>vídeo + scanner OBD</small>
            </span>
          </span>
        </div>
      );

    // 4. VISTORIA DE PINTURA: Carro com Medições Micrométricas em µm
    case 'vistoria-pintura':
      return (
        <div className="art v-art">
          <svg className="v-svg" viewBox="0 0 600 420" aria-hidden="true">
            <svg x="0" y="70" width="600" height="270" viewBox="0 0 600 270">
              <use href="#car-sym" />
            </svg>
            {[
              { x: 150, y: 120, val: '102 µm', ok: true },
              { x: 300, y: 98, val: '96 µm', ok: true },
              { x: 420, y: 112, val: '310 µm', ok: false },
              { x: 240, y: 205, val: '104 µm', ok: true },
            ].map((m, i) => (
              <g key={i} transform={`translate(${m.x} ${m.y})`}>
                <circle
                  r="7"
                  fill={m.ok ? '#18743B' : '#151415'}
                  stroke="#fff"
                  strokeWidth="3"
                />
                <g transform="translate(-36 -42)">
                  <rect width="72" height="26" rx="13" fill={m.ok ? '#fff' : '#151415'} />
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
          </svg>
          <span className="tagc t1">
            <b>
              <Icon name="paint" />
            </b>
            <span>
              Medição Peça a Peça<small>mapa digital em µm</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="check" />
            </b>
            <span>
              Repintura e Massa<small>identificadas na hora</small>
            </span>
          </span>
        </div>
      );

    // 5. VISTORIA DE KM COM SCANNER DE MÓDULO: Velocímetro + Odômetro DS Seção 6
    case 'vistoria-km-scanner':
      return (
        <div className="art" style={{ display: 'grid', placeItems: 'center' }}>
          <div
            style={{
              background: '#1E1D1E',
              borderRadius: 28,
              padding: '28px 24px',
              width: '100%',
              maxWidth: 420,
              border: '1.5px solid rgba(255,255,255,0.14)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.55)',
              textAlign: 'center',
            }}
          >
            <svg viewBox="0 0 260 150" style={{ width: '100%', maxWidth: 240, margin: '0 auto' }}>
              <path
                d="M 30 130 A 100 100 0 0 1 230 130"
                fill="none"
                stroke="#2C2A2B"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d="M 168 44 A 100 100 0 0 1 230 130"
                fill="none"
                stroke="#ED3237"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <g transform="translate(130, 130) rotate(32)">
                <path d="M -5 0 L 0 -82 L 5 0 Z" fill="#FFFFFF" />
                <circle r="11" fill="#FFFFFF" />
              </g>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              {['0', '4', '8', '2', '1', '3'].map((d, idx) => (
                <span
                  key={idx}
                  style={{
                    background: idx === 5 ? '#ED3237' : '#2A2829',
                    color: '#fff',
                    font: '900 22px/1 var(--f-head)',
                    width: 34,
                    height: 40,
                    borderRadius: 8,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {d}
                </span>
              ))}
              <span
                style={{
                  alignSelf: 'end',
                  font: '700 14px/1 var(--f-body)',
                  color: '#9A9597',
                  marginLeft: 4,
                }}
              >
                km
              </span>
            </div>
          </div>
          <span className="tagc t1">
            <b>
              <Icon name="gauge" />
            </b>
            <span>
              Leitura Eletrônica<small>comparada ao painel</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="scan" />
            </b>
            <span>
              Scanner OBD-II<small>motor, câmbio e ABS</small>
            </span>
          </span>
        </div>
      );

    // 6. VISTORIA DE BATERIA ELÉTRICOS E HÍBRIDOS: Bateria DS Seção 6
    case 'vistoria-bateria-eletricos':
      return (
        <div className="art" style={{ display: 'grid', placeItems: 'center' }}>
          <div
            style={{
              background: '#1E1D1E',
              borderRadius: 28,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 420,
              border: '1.5px solid rgba(255,255,255,0.14)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.55)',
              textAlign: 'center',
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
          </div>
          <span className="tagc t1">
            <b>
              <Icon name="battery" />
            </b>
            <span>
              Elétricos e Híbridos<small>bateria de alta tensão</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="shield" />
            </b>
            <span>
              Certificado AVILOO<small>independente</small>
            </span>
          </span>
        </div>
      );

    // 7. VISTORIA EM VEÍCULOS PESADOS: Caminhão DS Seção 6
    case 'vistoria-pesados':
      return (
        <div className="art">
          <svg
            viewBox="0 0 600 260"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '8%',
              width: '100%',
              filter: 'drop-shadow(0 28px 28px rgba(0,0,0,0.3))',
            }}
          >
            <ellipse cx="300" cy="238" rx="275" ry="12" fill="#000000" opacity="0.28" />
            <rect x="30" y="36" width="360" height="164" rx="14" fill="#FFFFFF" />
            <rect x="30" y="182" width="360" height="18" rx="4" fill="#151415" />
            <path
              d="M396 82 h112 c18 0 32 10 40 28 l22 46 v44 h-174 z"
              fill="#F6F4F5"
            />
            <path d="M416 98 h84 l26 42 h-110 z" fill="#1A1A1A" />
            <rect x="556" y="166" width="16" height="12" rx="3" fill="#FFE7A3" />
            {[115, 205, 485].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="212" r="36" fill="#1A1A1A" />
                <circle cx={cx} cy="212" r="19" fill="#9A9597" />
                <circle cx={cx} cy="212" r="6" fill="#1A1A1A" />
              </g>
            ))}
          </svg>
          <span className="tagc t1">
            <b>
              <Icon name="truck" />
            </b>
            <span>
              Caminhões e Ônibus<small>carretas e utilitários</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="scan" />
            </b>
            <span>
              Chassi, Motor e Eixos<small>DETRAN e Cautelar</small>
            </span>
          </span>
        </div>
      );

    // 8. VISTORIA PREMIUM: Selo Circular Premium DS Seção 5 + Carro
    case 'vistoria-premium':
      return (
        <div className="art">
          {/* Selo Circular Ø250 DS Seção 5 */}
          <div
            style={{
              position: 'absolute',
              right: '4%',
              top: '2%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: '#ED3237',
              border: '6px solid #fff',
              boxShadow: '0 20px 40px rgba(237,50,55,0.5)',
              display: 'grid',
              placeItems: 'center',
              alignContent: 'center',
              textAlign: 'center',
              color: '#fff',
              padding: 12,
              zIndex: 2,
            }}
          >
            <Icon name="star" />
            <strong style={{ font: '900 22px/1.1 var(--f-head)', marginTop: 4 }}>Premium</strong>
            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.92 }}>
              a análise mais completa
            </span>
          </div>
          <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
            <use href="#car-sym" />
          </svg>
          <span className="tagc t1">
            <b>
              <Icon name="wrench" />
            </b>
            <span>
              Análise Mecânica<small>+ scanner e pintura µm</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="star" />
            </b>
            <span>
              Acima de R$ 200 mil<small>importados e luxo</small>
            </span>
          </span>
        </div>
      );

    // 9. DEMAIS SERVIÇOS (Financeira, Seguradora, Proteção, Pátio, Infração): Escudo / Moldura + Carro
    default:
      return (
        <div className="art">
          {/* Escudo de Proteção DS Seção 6 */}
          <div
            style={{
              position: 'absolute',
              right: '8%',
              top: '2%',
              width: 136,
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
              zIndex: 2,
            }}
          >
            <svg viewBox="0 0 160 180">
              <path
                d="M80 12 L144 36 V88 C144 130 116 156 80 168 C44 156 16 130 16 88 V36 Z"
                fill="#ED3237"
                stroke="#FFFFFF"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              <path
                d="M54 88 L72 106 L108 68"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <svg className="car" viewBox="0 0 600 270" aria-hidden="true">
            <use href="#car-sym" />
          </svg>
          <span className="tagc t1">
            <b>
              <Icon name="shield" />
            </b>
            <span>
              Laudo Homologado<small>5 unidades Campinas</small>
            </span>
          </span>
          <span className="tagc t3">
            <b>
              <Icon name="clock" />
            </b>
            <span>
              Atendimento Rápido<small>emissão na hora</small>
            </span>
          </span>
        </div>
      );
  }
};

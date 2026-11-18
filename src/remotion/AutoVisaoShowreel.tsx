import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface RemotionShowreelProps {
  activeSceneOverride?: number | null;
}

const FamilyCarVector: React.FC<{ withFamily?: boolean }> = ({ withFamily = true }) => (
  <svg viewBox="0 0 600 270" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
    <defs>
      <clipPath id="rem-csw">
        <path d="M226 136 263 101h85v35z" />
        <path d="M356 136V100l110-1c13 0 21 4 28 12l21 25z" />
      </clipPath>
      <linearGradient id="rem-csb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E9E7E8" />
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="250" rx="270" ry="13" fill="#000000" opacity="0.22" />
    <path
      fill="url(#rem-csb)"
      d="M48 230H40c-8 0-12-5-12-14v-24c2-18 14-27 34-31l126-22c11-2 20-7 28-14l38-32c8-7 18-10 30-10l188-2c17 0 29 5 38 14l40 40c13 9 20 20 21 35l2 46c0 9-5 14-13 14h-36a52 52 0 0 0-104 0H192a52 52 0 0 0-104 0z"
    />
    <path
      fill="#1A1A1A"
      d="M226 136 263 101h85v35zM356 136V100l110-1c13 0 21 4 28 12l21 25z"
    />
    {withFamily && (
      <g clipPath="url(#rem-csw)" fill="#3A3A3C">
        <circle cx="300" cy="113" r="12" />
        <path d="M276 140c2-14 12-20 24-20s22 6 24 20z" />
        <circle cx="388" cy="121" r="9" />
        <path d="M370 140c2-10 9-15 18-15s16 5 18 15z" />
        <circle cx="440" cy="114" r="11" />
        <path d="M418 140c2-13 11-19 22-19s20 6 22 19z" />
      </g>
    )}
    <path d="M352 100v76M226 140l-8 52M520 140v40" stroke="#CFCBCD" strokeWidth="2" fill="none" />
    <path d="M30 196h548" stroke="#D9D5D7" strokeWidth="2" />
    <rect x="300" y="150" width="26" height="6" rx="3" fill="#BDB8BA" />
    <rect x="430" y="150" width="26" height="6" rx="3" fill="#BDB8BA" />
    <path d="M30 184c10-2 22-2 34 0v12H30z" fill="#FFE7A3" />
    <path d="M560 160h14l2 22h-16z" fill="#C9232C" />
    <g>
      <circle cx="140" cy="230" r="40" fill="#1A1A1A" />
      <circle cx="140" cy="230" r="21" fill="#9A9597" />
      <circle cx="140" cy="230" r="7" fill="#1A1A1A" />
    </g>
    <g>
      <circle cx="472" cy="230" r="40" fill="#1A1A1A" />
      <circle cx="472" cy="230" r="21" fill="#9A9597" />
      <circle cx="472" cy="230" r="7" fill="#1A1A1A" />
    </g>
  </svg>
);

const ConcentricRings: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => (
  <svg
    viewBox="0 0 800 800"
    style={{
      position: 'absolute',
      right: '-22%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '92%',
      height: 'auto',
      pointerEvents: 'none',
    }}
  >
    <g fill="none" stroke="#000000" strokeOpacity={opacity} strokeWidth="34">
      <circle cx="400" cy="400" r="60" />
      <circle cx="400" cy="400" r="130" />
      <circle cx="400" cy="400" r="200" />
      <circle cx="400" cy="400" r="270" />
      <circle cx="400" cy="400" r="340" />
      <circle cx="400" cy="400" r="410" />
      <circle cx="400" cy="400" r="480" />
      <circle cx="400" cy="400" r="550" />
    </g>
  </svg>
);

const FloatingTag: React.FC<{
  title: string;
  subtitle: string;
  x: number;
  y: number;
  delay: number;
  frame: number;
  fps: number;
}> = ({ title, subtitle, x, y, delay, frame, fps }) => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const floatY = Math.sin((frame + delay * 3) / 14) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${s}) translateY(${floatY}px)`,
        opacity: s,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#FFFFFF',
        color: '#151415',
        padding: '12px 18px 12px 12px',
        borderRadius: 16,
        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.42)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: '#ED3237',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 19, lineHeight: 1.1, color: '#151415' }}>
          {title}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13.5, color: '#696267', marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const AutoVisaoShowreel: React.FC<RemotionShowreelProps> = ({ activeSceneOverride = null }) => {
  const rawFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 5 scenes of 90 frames each (3 seconds per scene = 15s total @ 30fps)
  const sceneIndex = activeSceneOverride !== null && activeSceneOverride !== undefined
    ? activeSceneOverride
    : Math.floor(rawFrame / 90) % 5;
  const localFrame = activeSceneOverride !== null && activeSceneOverride !== undefined
    ? rawFrame % 90
    : rawFrame % 90;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const isRedBg = sceneIndex === 0 || sceneIndex === 1 || sceneIndex === 4;

  const scenesMeta = [
    {
      kicker: 'DESTAQUE · VISTORIA DO DETRAN & CAUTELAR',
      lightTitle: 'Quem você ama merece',
      boldTitle: 'um carro vistoriado.',
      badge: 'ECV Credenciada DETRAN-SP',
    },
    {
      kicker: 'EXCLUSIVA AUTO VISÃO · VISTORIA 360º®',
      lightTitle: 'Mais de 180 itens',
      boldTitle: 'e pintura peça a peça.',
      badge: 'Versões 360º® · Plus · Max',
    },
    {
      kicker: 'DIAGNÓSTICO AVANÇADO · SCANNER & BATERIA EV',
      lightTitle: 'KM real nos módulos e',
      boldTitle: 'saúde da bateria elétrica.',
      badge: 'OBD-II + Certificação AVILOO',
    },
    {
      kicker: 'PESADOS, EMPRESAS, PÁTIO & INFRAÇÃO',
      lightTitle: 'Caminhões, financeiras,',
      boldTitle: 'seguradoras e regularização.',
      badge: 'Atendimento B2B e Pátios',
    },
    {
      kicker: '5 UNIDADES EM CAMPINAS · PLANTÃO SÁBADO',
      lightTitle: 'Sempre tem uma Auto Visão',
      boldTitle: 'perto de você em Campinas.',
      badge: 'Sábado até 16h na Abolição',
    },
  ];

  const meta = scenesMeta[sceneIndex];

  // Dynamic values for Scene 2 (Speedometer & Battery)
  const kmCounter = Math.round(
    interpolate(localFrame, [0, 45], [12400, 48213], { extrapolateRight: 'clamp' })
  );
  const needleAngle = interpolate(localFrame, [0, 50], [-110, 38], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: isRedBg
          ? '#ED3237'
          : 'radial-gradient(120% 120% at 80% 20%, #2C2A2B 0%, #151415 65%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {isRedBg && <ConcentricRings opacity={0.09} />}

      {/* Top Bar inside video */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              display: 'inline-block',
              width: 28,
              height: 5,
              borderRadius: 3,
              background: isRedBg ? '#FFFFFF' : '#ED3237',
            }}
          />
          <span
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            {meta.kicker}
          </span>
        </div>
        <div
          style={{
            padding: '7px 16px',
            borderRadius: 999,
            background: isRedBg ? 'rgba(21,20,21,0.24)' : 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 13.5,
          }}
        >
          {meta.badge}
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          position: 'absolute',
          top: 86,
          bottom: 58,
          left: 44,
          right: 44,
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {/* Left Copy Column */}
        <div
          style={{
            transform: `translateY(${(1 - enterSpring) * 24}px)`,
            opacity: enterSpring,
            display: 'grid',
            gap: 16,
          }}
        >
          <div style={{ fontFamily: 'Nunito, sans-serif', lineHeight: 1.03 }}>
            <div style={{ fontWeight: 300, fontSize: 42, color: '#FFFFFF' }}>{meta.lightTitle}</div>
            <div style={{ fontWeight: 900, fontSize: 46, color: '#FFFFFF', marginTop: 2 }}>
              {meta.boldTitle}
            </div>
          </div>

          {/* Scene-specific checklist pills */}
          {sceneIndex === 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {['Transferência DETRAN-SP', 'Histórico de Leilão e Sinistro', 'Chassi, Motor e Estrutura'].map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'rgba(21,20,21,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    padding: '7px 13px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          {sceneIndex === 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {['Pintura Medida em µm', 'Vídeo no WhatsApp (Plus)', 'Certificado do Carro (Max)'].map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'rgba(21,20,21,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    padding: '7px 13px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          {sceneIndex === 2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {['Auditoria de KM via OBD-II', 'Bateria de Alta Tensão (SoH)', 'Vistoria Premium (> R$ 200 mil)'].map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '7px 13px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          {sceneIndex === 3 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {['Caminhões e Ônibus', 'Financeira, Seguradora e Proteção', 'Pátio Público e Infração'].map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '7px 13px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          {sceneIndex === 4 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {['Taquaral · Centro · Abolição', 'Campos Elíseos · Amoreiras', 'Plantão Sábado até 16h'].map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'rgba(21,20,21,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    padding: '7px 13px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}

          {/* WhatsApp Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <div
              style={{
                background: '#25D366',
                color: '#0B3B22',
                padding: '12px 22px',
                borderRadius: 12,
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 18,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 14px 28px -8px rgba(0,0,0,0.35)',
              }}
            >
              <span>Agende pelo WhatsApp</span>
            </div>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22 }}>
              (19) 99224-8383
            </span>
          </div>
        </div>

        {/* Right Art Column (DS Vector Elements) */}
        <div style={{ position: 'relative', height: '100%', display: 'grid', placeItems: 'center' }}>
          {/* SCENE 0: Family Car + Magnifying Glass + Laudo Card + Mercosul Plate */}
          {sceneIndex === 0 && (
            <div style={{ position: 'relative', width: '100%', height: 360 }}>
              {/* Lupa da marca */}
              <div
                style={{
                  position: 'absolute',
                  right: 30,
                  top: 0,
                  width: 150,
                  transform: `translateY(${Math.sin(localFrame / 12) * 8}px) scale(${enterSpring})`,
                }}
              >
                <svg viewBox="0 0 200 200">
                  <circle cx="86" cy="86" r="62" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" strokeWidth="22" />
                  <path d="M134 134l42 42" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="86" cy="86" r="16" fill="#151415" />
                </svg>
              </div>

              {/* Placa Mercosul ABC1D23 */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 12,
                  background: '#FFFFFF',
                  border: '5px solid #151415',
                  borderRadius: 14,
                  width: 210,
                  overflow: 'hidden',
                  transform: `rotate(-4deg) scale(${enterSpring})`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div
                  style={{
                    background: '#1D3A8A',
                    color: '#FFFFFF',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 900,
                    fontSize: 10,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    padding: '4px 0',
                  }}
                >
                  BRASIL
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 900,
                    fontSize: 28,
                    color: '#151415',
                    textAlign: 'center',
                    padding: '4px 0 6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  ABC1D23
                </div>
              </div>

              {/* Carro de Família */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 18,
                  left: 20,
                  right: 10,
                  transform: `translateX(${(1 - enterSpring) * 50}px)`,
                }}
              >
                <FamilyCarVector withFamily />
              </div>

              <FloatingTag
                title="Estrutura & Histórico"
                subtitle="Leilão, sinistro e chassi OK"
                x={20}
                y={260}
                delay={10}
                frame={localFrame}
                fps={fps}
              />
              <FloatingTag
                title="Padrão DETRAN-SP"
                subtitle="Transferência na hora"
                x={300}
                y={100}
                delay={18}
                frame={localFrame}
                fps={fps}
              />
            </div>
          )}

          {/* SCENE 1: Vistoria 360º Orbit + Micron Paint Points + Video Phone */}
          {sceneIndex === 1 && (
            <div style={{ position: 'relative', width: '100%', height: 360 }}>
              {/* 360º Number */}
              <div
                style={{
                  position: 'absolute',
                  right: 16,
                  top: -8,
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: 88,
                  lineHeight: 0.9,
                  color: '#FFFFFF',
                  opacity: 0.95,
                }}
              >
                360<span style={{ color: '#151415', fontSize: 52 }}>°</span>
              </div>

              {/* Dotted 360 Orbit */}
              <svg
                viewBox="0 0 600 260"
                style={{ position: 'absolute', inset: '45px 0 0 0', width: '100%', overflow: 'visible' }}
              >
                <ellipse
                  cx="300"
                  cy="140"
                  rx="275"
                  ry="76"
                  fill="none"
                  stroke="#151415"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="4 18"
                  strokeDashoffset={-localFrame * 2}
                />
              </svg>

              <div style={{ position: 'absolute', bottom: 32, left: 20, right: 20 }}>
                <FamilyCarVector withFamily />
              </div>

              {/* Paint thickness pills */}
              {[
                { label: 'Capô · 102 µm', x: 75, y: 155, ok: true },
                { label: 'Teto · 98 µm', x: 235, y: 105, ok: true },
                { label: 'Porta · 310 µm (Repintura)', x: 340, y: 255, ok: false },
              ].map((pt, idx) => (
                <div
                  key={pt.label}
                  style={{
                    position: 'absolute',
                    left: pt.x,
                    top: pt.y,
                    background: pt.ok ? '#FFFFFF' : '#151415',
                    color: pt.ok ? '#151415' : '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 900,
                    fontSize: 13,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transform: `scale(${spring({ frame: Math.max(0, localFrame - idx * 7), fps })})`,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: pt.ok ? '#18743B' : '#ED3237',
                    }}
                  />
                  {pt.label}
                </div>
              ))}

              <FloatingTag
                title="Pintura peça a peça"
                subtitle="+ Vídeo no WhatsApp (Plus)"
                x={16}
                y={18}
                delay={6}
                frame={localFrame}
                fps={fps}
              />
            </div>
          )}

          {/* SCENE 2: Speedometer + Odometer + EV Battery */}
          {sceneIndex === 2 && (
            <div style={{ position: 'relative', width: '100%', height: 360, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'center' }}>
              {/* Velocímetro + Odômetro (DS Section 6) */}
              <div
                style={{
                  background: '#1E1D1E',
                  borderRadius: 24,
                  padding: '22px 18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  textAlign: 'center',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, letterSpacing: '0.14em', color: '#ED3237', textTransform: 'uppercase' }}>
                  SCANNER DE MÓDULOS OBD-II
                </div>
                <svg viewBox="0 0 240 140" style={{ width: '100%', maxWidth: 210, margin: '8px auto 0' }}>
                  <path
                    d="M 30 120 A 90 90 0 0 1 210 120"
                    fill="none"
                    stroke="#2C2A2B"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 155 42 A 90 90 0 0 1 210 120"
                    fill="none"
                    stroke="#ED3237"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <g transform={`translate(120, 120) rotate(${needleAngle})`}>
                    <path d="M -4 0 L 0 -74 L 4 0 Z" fill="#FFFFFF" />
                    <circle r="9" fill="#FFFFFF" />
                  </g>
                </svg>
                {/* Odômetro 6 dígitos */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                  {String(kmCounter)
                    .padStart(6, '0')
                    .split('')
                    .map((d, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: idx === 5 ? '#ED3237' : '#2A2829',
                          color: '#FFFFFF',
                          fontFamily: 'Nunito, sans-serif',
                          fontWeight: 900,
                          fontSize: 18,
                          width: 26,
                          height: 32,
                          borderRadius: 6,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  <span style={{ alignSelf: 'end', fontSize: 12, fontWeight: 700, color: '#9A9597', marginLeft: 3 }}>
                    km
                  </span>
                </div>
                <div style={{ marginTop: 10, fontSize: 12.5, color: '#E7F4EC', background: '#18743B', display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                  ✓ KM real auditado nos módulos
                </div>
              </div>

              {/* Bateria Elétricos e Híbridos (DS Section 6) */}
              <div
                style={{
                  background: '#1E1D1E',
                  borderRadius: 24,
                  padding: '22px 18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  textAlign: 'center',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, letterSpacing: '0.14em', color: '#ED3237', textTransform: 'uppercase' }}>
                  ELÉTRICOS & HÍBRIDOS
                </div>
                <svg viewBox="0 0 260 140" style={{ width: '100%', maxWidth: 220, margin: '12px auto 6px' }}>
                  <rect x="20" y="24" width="200" height="92" rx="20" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                  <rect x="226" y="52" width="14" height="36" rx="5" fill="#FFFFFF" />
                  <rect x="38" y="42" width="36" height="56" rx="8" fill="#ED3237" />
                  <rect x="82" y="42" width="36" height="56" rx="8" fill="#ED3237" />
                  <rect x="126" y="42" width="36" height="56" rx="8" fill="#ED3237" />
                  <rect x="170" y="42" width="32" height="56" rx="8" fill="#2C2A2B" />
                  <path d="M126 46 L108 72 H126 L116 96 L142 66 H124 Z" fill="#FFFFFF" />
                </svg>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 17, color: '#FFFFFF' }}>
                  Saúde da Bateria de Tração
                </div>
                <div style={{ marginTop: 8, fontSize: 12.5, color: '#E7F4EC', background: '#18743B', display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                  ✓ Certificado Independente AVILOO
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: Caminhão (Pesados) + Escudo Proteção + Financeira/Seguradora/Pátio */}
          {sceneIndex === 3 && (
            <div style={{ position: 'relative', width: '100%', height: 360 }}>
              {/* Caminhão DS Section 6 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: 10,
                  right: 10,
                  transform: `translateX(${(1 - enterSpring) * -40}px)`,
                }}
              >
                <svg viewBox="0 0 600 260" style={{ width: '100%', height: 'auto' }}>
                  <ellipse cx="300" cy="238" rx="275" ry="12" fill="#000000" opacity="0.35" />
                  {/* Baú branco raio 14 com faixa vermelha na base */}
                  <rect x="30" y="36" width="360" height="164" rx="14" fill="#FFFFFF" />
                  <rect x="30" y="182" width="360" height="18" rx="4" fill="#ED3237" />
                  {/* Cabine off-white com vidro grafite */}
                  <path
                    d="M396 82 h112 c18 0 32 10 40 28 l22 46 v44 h-174 z"
                    fill="#F6F4F5"
                  />
                  <path d="M416 98 h84 l26 42 h-110 z" fill="#1A1A1A" />
                  <rect x="556" y="166" width="16" height="12" rx="3" fill="#FFE7A3" />
                  {/* 3 rodas iguais às do carro */}
                  {[115, 205, 485].map((cx) => (
                    <g key={cx}>
                      <circle cx={cx} cy="212" r="36" fill="#1A1A1A" />
                      <circle cx={cx} cy="212" r="19" fill="#9A9597" />
                      <circle cx={cx} cy="212" r="6" fill="#1A1A1A" />
                    </g>
                  ))}
                </svg>
              </div>

              <FloatingTag
                title="Veículos Pesados"
                subtitle="Caminhões, ônibus, vans e carretas"
                x={20}
                y={14}
                delay={4}
                frame={localFrame}
                fps={fps}
              />
              <FloatingTag
                title="Seguradora, Financeira & Proteção"
                subtitle="Laudo prévio, crédito e frotas"
                x={265}
                y={22}
                delay={12}
                frame={localFrame}
                fps={fps}
              />
              <FloatingTag
                title="Pátio Público & Infração"
                subtitle="Liberação e regularização DETRAN"
                x={250}
                y={260}
                delay={20}
                frame={localFrame}
                fps={fps}
              />
            </div>
          )}

          {/* SCENE 4: Mapa Ilustrado de Campinas com as 5 Lojas (DS Section 6) */}
          {sceneIndex === 4 && (
            <div style={{ position: 'relative', width: '100%', height: 350, display: 'grid', placeItems: 'center' }}>
              <svg
                viewBox="0 0 600 400"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  borderRadius: 24,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
                  transform: 'rotate(-1.5deg)',
                }}
              >
                <rect width="600" height="400" rx="24" fill="#FFFFFF" />
                {/* Ruas #F1EEF0 */}
                <g stroke="#F1EEF0" strokeWidth="8">
                  <path d="M0 70 L600 40 M0 150 L600 130 M0 240 L600 220 M0 330 L600 310" />
                  <path d="M90 0 L70 400 M210 0 L195 400 M340 0 L355 400 M480 0 L495 400" />
                </g>
                {/* Lagoa do Taquaral #EAF2F7 & Parque #EEF5EE */}
                <ellipse cx="470" cy="85" rx="55" ry="30" fill="#EAF2F7" />
                <ellipse cx="120" cy="290" rx="50" ry="32" fill="#EEF5EE" />
                {/* Avenidas #E4DFE2 */}
                <g stroke="#E4DFE2" strokeWidth="16" fill="none" strokeLinecap="round">
                  <path d="M-20 200 C150 185 280 195 340 180 S490 120 620 95" />
                  <path d="M310 180 C290 250 260 320 240 410" />
                </g>
                {/* Rodovia preta 12px com tracejado branco */}
                <path d="M-10 350 C110 290 160 210 210 0" stroke="#151415" strokeWidth="12" fill="none" />
                <path d="M-10 350 C110 290 160 210 210 0" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 10" fill="none" />

                {/* 5 Pinos Vermelhos das Unidades de Campinas */}
                {[
                  { name: 'Taquaral', x: 445, y: 105 },
                  { name: 'Centro', x: 300, y: 175 },
                  { name: 'Ponte Preta (Sáb 16h)', x: 435, y: 245 },
                  { name: 'Campos Elíseos', x: 155, y: 255 },
                  { name: 'Pq. Industrial', x: 265, y: 335 },
                ].map((pin, idx) => (
                  <g key={pin.name} transform={`translate(${pin.x}, ${pin.y})`}>
                    <path d="M0 0 C-4 -8 -16 -17 -16 -28 a16 16 0 0 1 32 0 C16 -17 4 -8 0 0z" fill="#ED3237" />
                    <circle cy="-28" r="7" fill="#FFFFFF" />
                    <circle cy="-28" r="2.8" fill="#151415" />
                    <rect x={-pin.name.length * 4.2 - 8} y="5" width={pin.name.length * 8.4 + 16} height="22" rx="11" fill="#151415" />
                    <text
                      x="0"
                      y="20"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="Nunito, sans-serif"
                      fontWeight="800"
                      fontSize="11.5"
                    >
                      {pin.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Official Checkered Strip at Base (DS Section 3) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 36,
          backgroundImage: 'url(/assets/img/faixa-quadriculada.webp)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
        }}
      />
    </AbsoluteFill>
  );
};

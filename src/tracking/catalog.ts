import { findServiceBySlug, VISTORIA_SERVICES } from '../data/campinasData';

/**
 * Nomes estáveis para públicos. Plus e Max vivem na página da Vistoria 360;
 * Scanner de KM e Certificado da bateria têm página própria.
 */
export const SERVICE_NAMES: Record<string, string> = {
  'vistoria-detran': 'Transferência DETRAN',
  'vistoria-cautelar': 'Cautelar',
  'vistoria-360': 'Vistoria 360 Plus Max',
  'vistoria-pintura': 'Pintura',
  'vistoria-km-scanner': 'Scanner de KM',
  'vistoria-bateria-eletricos': 'Certificado Bateria',
  'vistoria-premium': 'Premium',
  'vistoria-pesados': 'Pesados',
  'vistoria-infracao-transito': 'Infração',
  'vistoria-patio-publico': 'Pátio Público',
  'para-empresas': 'Empresas',
  'vistoria-financeira': 'Financeira',
  'vistoria-seguradora': 'Seguradora',
  'vistoria-protecao-automotiva': 'Proteção Automotiva',
};

export const COMBO_SERVICE = {
  id: 'combo-cautelar-transferencia',
  name: 'Combo Cautelar Transferência',
} as const;

export type ServiceRef = { id: string; name: string };

export function serviceRefFromId(id: string | null | undefined): ServiceRef | null {
  if (!id) return null;
  const name = SERVICE_NAMES[id];
  if (!name) return null;
  return { id, name };
}

export function serviceFromPath(pathname: string): ServiceRef | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 1) return null;
  const svc = findServiceBySlug(parts[0]);
  return svc ? serviceRefFromId(svc.id) : null;
}

export function serviceFromLabel(label: string): ServiceRef | null {
  const trimmed = label.trim();
  if (trimmed === 'Combo Vistoria Cautelar + Transferência DETRAN') return { ...COMBO_SERVICE };
  const found = VISTORIA_SERVICES.find((item) => item.title === trimmed || item.shortTitle === trimmed);
  return found ? serviceRefFromId(found.id) : null;
}

export function allCatalogIds(): string[] {
  return VISTORIA_SERVICES.map((item) => item.id);
}

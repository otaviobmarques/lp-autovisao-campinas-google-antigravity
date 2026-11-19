export const INTEREST_STORAGE_KEY = 'av_campinas_interest';
export const SERVICE_VIEW_SESSION_KEY = 'av_campinas_svc_view';
const MAX_INTEREST = 20;

export function rememberInterest(list: string[], id: string): string[] {
  const next = list.filter((item) => item !== id);
  next.push(id);
  return next.slice(-MAX_INTEREST);
}

/** Mais recente primeiro, dentro do limite de 100 caracteres do parâmetro de evento do GA4. */
export function recentInterestParam(list: string[]): string {
  let out = '';
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const id = list[index];
    const candidate = out ? `${id},${out}` : id;
    if (candidate.length > 100) break;
    out = candidate;
  }
  return out;
}

export function interestFields(list: string[]): Record<string, string | number> {
  const fields: Record<string, string | number> = { interest_count: list.length };
  const last = list[list.length - 1];
  if (last) fields.interest_last = last;
  const recent = recentInterestParam(list);
  if (recent) fields.interest_services = recent;
  return fields;
}

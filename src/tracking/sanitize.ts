const PII_KEY =
  /^(name|nome|full_name|first_name|last_name|email|e-?mail|mail|phone|telefone|tel|celular|whatsapp|cpf|placa|plate|message|mensagem)$/i;

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const LONG_VALUE_KEYS = new Set([
  'gclid',
  'fbclid',
  'gbraid',
  'wbraid',
  'utm_campaign',
  'interest_services',
  'page_title',
]);

export function sanitizeParams(
  input: Record<string, unknown>
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key || PII_KEY.test(key)) continue;
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'number') {
      if (Number.isFinite(value)) out[key] = value;
      continue;
    }
    if (typeof value === 'boolean') {
      out[key] = value;
      continue;
    }
    if (typeof value !== 'string') continue;
    const trimmed = value.trim().slice(0, LONG_VALUE_KEYS.has(key) ? 200 : 120);
    if (!trimmed || EMAIL.test(trimmed) || looksLikePhone(trimmed)) continue;
    out[key] = trimmed;
  }
  return out;
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

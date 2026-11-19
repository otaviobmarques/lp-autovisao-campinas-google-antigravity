/** Nomes estáveis. Não coincidem com a medição otimizada do GA4 (page_view, scroll, click). */
export const EVENTS = {
  whatsapp: 'whatsapp_click',
  serviceClick: 'service_click',
  serviceView: 'service_view',
  phone: 'phone_click',
  map: 'map_click',
  address: 'address_click',
  scroll: 'scroll_depth',
  time: 'time_on_page',
  spa: 'spa_navigation',
} as const;

/** Eventos que a medição otimizada do GA4 já dispara sozinha. */
export const RESERVED_GA4_EVENTS = [
  'scroll',
  'click',
  'page_view',
  'user_engagement',
  'form_start',
  'form_submit',
  'file_download',
  'view_search_results',
  'video_start',
  'video_progress',
  'video_complete',
] as const;

export function safeEventName(name: string): string {
  return (RESERVED_GA4_EVENTS as readonly string[]).includes(name) ? `av_${name}` : name;
}

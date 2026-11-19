import { startTracking } from './listeners';

export function initTracking(): void {
  if (typeof window === 'undefined') return;
  const flag = '__avTrackingInit';
  const holder = window as unknown as Record<string, boolean>;
  if (holder[flag]) return;
  holder[flag] = true;
  try {
    startTracking();
  } catch {
    // a página abre mesmo se o rastreamento falhar
  }
}

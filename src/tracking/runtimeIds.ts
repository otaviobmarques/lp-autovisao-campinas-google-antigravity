import { resolveTrackingIds } from './config';

export const trackingIds = resolveTrackingIds({
  VITE_GTM_ID: import.meta.env.VITE_GTM_ID,
  VITE_GADS_ID: import.meta.env.VITE_GADS_ID,
  VITE_GADS_WHATSAPP_LABEL: import.meta.env.VITE_GADS_WHATSAPP_LABEL,
  VITE_META_PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID,
  VITE_GA4_ID: import.meta.env.VITE_GA4_ID,
});

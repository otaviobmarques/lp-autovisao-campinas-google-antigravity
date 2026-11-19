/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID?: string;
  readonly VITE_GADS_ID?: string;
  readonly VITE_GADS_WHATSAPP_LABEL?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_GA4_ID?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    AV_TRACKING?: {
      gtmId?: string;
      gadsId?: string;
      gadsWhatsappLabel?: string;
      metaPixelId?: string;
      ga4Id?: string;
    };
  }
}

export {};

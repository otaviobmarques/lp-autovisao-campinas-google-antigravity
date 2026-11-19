import { type TrackingIds } from './config';

/**
 * Snippets do `<head>` e do `<body>`.
 * Cada bloco só entra se o ID passou na validação.
 * O GA4 não ganha gtag('config'): a tag fica no GTM.
 * O Google Ads entra com send_page_view desligado para o page_view do GA4,
 * disparado pela medição otimizada dentro do GTM, continuar único.
 */
export function renderTrackingSnippets(ids: TrackingIds): { head: string; bodyStart: string } {
  const exposed = {
    ...(ids.gtmId ? { gtmId: ids.gtmId } : {}),
    ...(ids.gadsId ? { gadsId: ids.gadsId } : {}),
    ...(ids.gadsWhatsappLabel ? { gadsWhatsappLabel: ids.gadsWhatsappLabel } : {}),
    ...(ids.metaPixelId ? { metaPixelId: ids.metaPixelId } : {}),
    ...(ids.ga4Id ? { ga4Id: ids.ga4Id } : {}),
  };
  const layer: Record<string, string> = {};
  if (ids.gtmId) layer.gtm_id = ids.gtmId;
  if (ids.gadsId) layer.gads_id = ids.gadsId;
  if (ids.gadsWhatsappLabel) layer.gads_whatsapp_label = ids.gadsWhatsappLabel;
  if (ids.metaPixelId) layer.meta_pixel_id = ids.metaPixelId;
  if (ids.ga4Id) layer.ga4_measurement_id = ids.ga4Id;

  const head: string[] = [
    `<script data-av-tracking="ids">
window.dataLayer = window.dataLayer || [];
window.AV_TRACKING = ${jsonForInline(exposed)};
window.dataLayer.push(${jsonForInline(layer)});
</script>`,
  ];

  if (ids.gtmId) {
    head.push(`<!-- Google Tag Manager -->
<script data-av-tracking="gtm">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${jsonForInline(ids.gtmId)});</script>
<!-- End Google Tag Manager -->`);
  }

  if (ids.metaPixelId) {
    head.push(`<!-- Meta Pixel -->
<script data-av-tracking="meta">
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${jsonForInline(ids.metaPixelId)});
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" alt=""
src="https://www.facebook.com/tr?id=${ids.metaPixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel -->`);
  }

  if (ids.gadsId) {
    head.push(`<!-- Google Ads remarketing. page_view fica com o GA4 no GTM. -->
<!-- Conversão de WhatsApp: só no GTM (acionador whatsapp_click). Aqui só o config. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ids.gadsId}" data-av-tracking="gads"></script>
<script data-av-tracking="gads-config">
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', ${jsonForInline(ids.gadsId)}, { send_page_view: false });
</script>`);
  }

  const bodyStart = ids.gtmId
    ? `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${ids.gtmId}"
height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`
    : '';

  return { head: head.join('\n'), bodyStart };
}

function jsonForInline(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

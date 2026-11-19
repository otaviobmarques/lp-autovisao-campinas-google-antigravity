import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveTrackingIds } from './src/tracking/config';
import { renderTrackingSnippets } from './src/tracking/htmlSnippet';

function trackingHtmlPlugin(mode: string): Plugin {
  return {
    name: 'av-tracking-html',
    transformIndexHtml(html) {
      if (html.includes('data-av-tracking="ids"')) return html;
      const snippets = renderTrackingSnippets(resolveTrackingIds(loadEnv(mode, process.cwd(), 'VITE_')));
      const charset = '<meta charset="utf-8" />';
      let out = html.includes(charset)
        ? html.replace(charset, `${charset}\n${snippets.head}`)
        : html.replace('<head>', `<head>\n${charset}\n${snippets.head}`);
      if (snippets.bodyStart) out = out.replace('<body>', `<body>\n${snippets.bodyStart}`);
      return out;
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), trackingHtmlPlugin(mode)],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('remotion') || id.includes('AutoVisaoShowreel')) {
            return 'remotion-player';
          }
        },
      },
    },
  },
}));

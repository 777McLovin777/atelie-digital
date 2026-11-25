import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {sensitiveFileProtection} from './scripts/lib/file-security.mjs';
import {HOME_METADATA, OPEN_GRAPH_IMAGE_URL, routeDocuments} from './src/data/publicUrls.js';
import {showcase} from './vitrine/content.js';

const project = dirname(fileURLToPath(import.meta.url));
const root = resolve(project, 'vitrine');
const contactIconFiles = ['gmail.svg', 'github.svg', 'whatsapp.svg'];
const faviconFiles = ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png'];
const openGraphImageFile = 'og-image.jpg';

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function setMeta(html, attribute, name, value) {
  const pattern = new RegExp(`<meta ${attribute}="${name}" content="[^"]*" \/>`, 'g');
  if (html.match(pattern)?.length !== 1) throw new Error(`Metadado único ausente: ${name}`);
  return html.replace(pattern, `<meta ${attribute}="${name}" content="${escapeHtml(value)}" />`);
}

function showcaseFiles() {
  return {
    name: 'atelier-vitrine-files',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const id of this.getModuleIds()) {
        const file = id.replaceAll('\\', '/').split('?')[0];
        if (/(?:\/node_modules\/@supabase\/|\/src\/(?:main\.jsx$|hooks\/|data\/(?:auth|cloudRepository|config|initial|media|mediaPolicy|migration|repository|saveIntent|supabase)\.js$|components\/(?:Admin\w*|EditorDialog|EditorialFields|MediaManager|MigrationTools|ProjectEditor|PublicExperience)\.jsx$))/.test(file)) {
          this.error('Uma dependência da aplicação completa entrou no grafo da vitrine.');
        }
      }
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') this.error('Documento principal ausente do pacote.');
      const rootHtml = String(index.source);
      const baseTitle = `<title>${HOME_METADATA.title}</title>`;
      if ((rootHtml.match(new RegExp(baseTitle, 'g')) || []).length !== 1) {
        this.error('Título base ausente ou duplicado no documento da vitrine.');
      }
      if (!rootHtml.includes(`<meta property="og:image" content="${OPEN_GRAPH_IMAGE_URL}" />`)) {
        this.error('Imagem Open Graph absoluta ausente no documento principal.');
      }
      for (const page of routeDocuments(showcase.projects)) {
        let source = rootHtml;
        if (page.title !== HOME_METADATA.title) source = source.replace(baseTitle, `<title>${escapeHtml(page.title)}</title>`);
        for (const [attribute, name, value] of [
          ['property', 'og:title', page.ogTitle],
          ['property', 'og:description', page.ogDescription],
          ['property', 'og:url', page.url],
          ['name', 'twitter:title', page.ogTitle],
          ['name', 'twitter:description', page.ogDescription],
        ]) {
          try { source = setMeta(source, attribute, name, value); }
          catch { this.error(`Metadado estático ausente ou duplicado: ${name}`); }
        }
        this.emitFile({type:'asset', fileName:page.file, source});
      }
      for (const fileName of ['_headers', '404.html']) {
        this.emitFile({type:'asset', fileName, source:readFileSync(resolve(root, fileName), 'utf8')});
      }
      for (const fileName of contactIconFiles) {
        this.emitFile({type:'asset', fileName:`assets/${fileName}`, source:readFileSync(resolve(project, 'src', 'assets', 'contact', fileName))});
      }
      for (const fileName of faviconFiles) {
        this.emitFile({type:'asset', fileName, source:readFileSync(resolve(root, 'icons', fileName))});
      }
      this.emitFile({type:'asset', fileName:openGraphImageFile, source:readFileSync(resolve(root, openGraphImageFile))});
    },
  };
}

export default defineConfig(({command, mode}) => {
  if (command !== 'build' || mode !== 'vitrine') {
    throw new Error('Use npm run build:vitrine para gerar o artefato estático.');
  }
  return {
    root,
    publicDir: false,
    envFile: false,
    envPrefix: [],
    build: {
      outDir: resolve(project, 'dist-vitrine'),
      emptyOutDir: true,
      copyPublicDir: false,
      sourcemap: false,
      modulePreload: false,
    },
    plugins: [sensitiveFileProtection(), react(), showcaseFiles()],
  };
});

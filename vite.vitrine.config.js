import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {sensitiveFileProtection} from './scripts/lib/file-security.mjs';

const project = dirname(fileURLToPath(import.meta.url));
const root = resolve(project, 'vitrine');

function showcaseFiles() {
  return {
    name: 'atelier-vitrine-files',
    generateBundle() {
      for (const id of this.getModuleIds()) {
        const file = id.replaceAll('\\', '/').split('?')[0];
        if (/(?:\/node_modules\/@supabase\/|\/src\/(?:main\.jsx$|hooks\/|data\/(?:auth|cloudRepository|config|initial|media|mediaPolicy|migration|repository|saveIntent|supabase)\.js$|components\/(?:Admin\w*|EditorDialog|EditorialFields|MediaManager|MigrationTools|ProjectEditor|PublicExperience)\.jsx$))/.test(file)) {
          this.error('Uma dependência da aplicação completa entrou no grafo da vitrine.');
        }
      }
      for (const fileName of ['_headers', '404.html']) {
        this.emitFile({type:'asset', fileName, source:readFileSync(resolve(root, fileName), 'utf8')});
      }
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

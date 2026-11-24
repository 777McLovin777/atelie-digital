import {createHash} from 'node:crypto';
import {lstatSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sensitiveArtifacts} from './lib/file-security.mjs';
import {publicDocumentFiles, routeDocuments} from '../src/data/publicUrls.js';
import {showcase} from '../vitrine/content.js';

const root = fileURLToPath(new URL('../dist-vitrine/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const permissions = /(?:default-src 'none'.*script-src 'self'.*connect-src 'none'.*form-action 'none'.*frame-ancestors 'none')/;

function treeEntries(directory, prefix = '') {
  return readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    const path = join(directory, entry.name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error('Link simbólico inesperado.');
    if (stat.isDirectory()) return [name, ...treeEntries(path, name)];
    if (stat.isFile()) return [name];
    throw new Error('Tipo de arquivo inesperado.');
  });
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

try {
  if (lstatSync(root).isSymbolicLink() || !lstatSync(root).isDirectory()) throw new Error('Estrutura inesperada.');
  const assets = readdirSync(join(root, 'assets'));
  const bundleAssets = assets.filter(name => /^index-[\w-]+\.(?:js|css)$/.test(name));
  const portraitAssets = assets.filter(name => /^leonardo-oliveira-[\w-]+\.webp$/.test(name));
  if (assets.length !== 3 || bundleAssets.length !== 2 || portraitAssets.length !== 1 ||
      !bundleAssets.some(name => name.endsWith('.js')) || !bundleAssets.some(name => name.endsWith('.css'))) {
    throw new Error('Conjunto de bundles inesperado.');
  }
  const documents = publicDocumentFiles(showcase.projects);
  const files = ['404.html', '_headers', ...documents, ...assets.map(name => `assets/${name}`)].sort();
  const directories = new Set(['assets']);
  for (const name of files) {
    let parent = posix.dirname(name);
    while (parent !== '.') {
      directories.add(parent);
      parent = posix.dirname(parent);
    }
  }
  const expectedTree = [...files, ...directories].sort();
  if (treeEntries(root).sort().join(',') !== expectedTree.join(',') || sensitiveArtifacts(root).length) {
    throw new Error('Artefato sensível ou tipo de arquivo inesperado.');
  }
  const index = readFileSync(join(root, 'index.html'), 'utf8');
  const script = readFileSync(join(root, `assets/${bundleAssets.find(name => name.endsWith('.js'))}`), 'utf8');
  const routeHtml = routeDocuments(showcase.projects).map(route => ({
    ...route,
    html: readFileSync(join(root, route.file), 'utf8'),
  }));
  const publicContacts = ['leo.ateliedigital@gmail.com', 'https://github.com/777McLovin777', '5511910513097', 'https://wa.me/'];
  if (!permissions.test(readFileSync(join(root, '_headers'), 'utf8')) ||
      !bundleAssets.every(name => index.includes('/assets/' + name)) ||
      !script.includes('/assets/' + portraitAssets[0]) ||
      routeHtml.some(({title, html}) => !html.includes(`<title>${escapeHtml(title)}</title>`) || !bundleAssets.every(name => html.includes('/assets/' + name))) ||
      publicContacts.some(value => !script.includes(value)) ||
      /supabase\.co|storage:\/\/|#\/admin|VITE_|contato@exemplo\.com|delivery-pedemoca\.pages\.dev|atelier_portfolio_v1_data|sb_(?:secret|publishable)_|doceconecta|doce conecta|doce-conecta/i.test([index, script, ...routeHtml.map(route => route.html)].join('\n'))) {
    throw new Error('Referência privada, proteção ausente ou bundle não referenciado.');
  }
  const manifest = files.map(name => `${createHash('sha256').update(readFileSync(join(root, name))).digest('hex')}  dist-vitrine/${name}`).join('\n') + '\n';
  writeFileSync(join(projectRoot, 'SHA256SUMS.vitrine-build.txt'), manifest, 'utf8');
  console.log(manifest.trimEnd());
} catch {
  console.error('Auditoria da vitrine reprovada. Gere dist-vitrine e confira a estrutura, os cabeçalhos e as referências. Não distribua o diretório.');
  process.exitCode = 1;
}

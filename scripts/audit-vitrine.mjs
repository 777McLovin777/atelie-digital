import {createHash} from 'node:crypto';
import {lstatSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sensitiveArtifacts} from './lib/file-security.mjs';
import {HOME_METADATA, OPEN_GRAPH_IMAGE_URL, PUBLIC_ORIGIN, publicDocumentFiles, routeDocuments} from '../src/data/publicUrls.js';
import {showcase} from '../vitrine/content.js';

const root = fileURLToPath(new URL('../dist-vitrine/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const permissions = /(?:default-src 'none'.*script-src 'self'.*connect-src 'none'.*form-action 'none'.*frame-ancestors 'none')/;
const contactIconFiles = ['gmail.svg', 'github.svg', 'whatsapp.svg'];
const faviconFiles = ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png'];
const openGraphImageFile = 'og-image.jpg';
const unsafeSvg = /<\s*(?:script|foreignObject|iframe|object|embed|image|use|animate(?:Motion|Transform)?|set|audio|video)\b|\bon[a-z0-9_-]+\s*=|\b(?:href|xlink:href|src)\s*=|\bstyle\s*=|url\s*\(|javascript:|data:/i;
const decorativeStar = /[✳✱✻✼✽❋❊❉⁎∗＊]/u;

function safeContactSvg(source) {
  return /^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(source) && !unsafeSvg.test(source) &&
    [...source.matchAll(/<\/?([a-z][\w-]*)\b/gi)].every(([, name]) => ['svg', 'g', 'path'].includes(name.toLowerCase()));
}

function isPng(buffer) {
  return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}

function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda || offset + 1 >= buffer.length) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return null;
    if (frameMarkers.has(marker)) {
      return {width:buffer.readUInt16BE(offset + 5), height:buffer.readUInt16BE(offset + 3)};
    }
    offset += length;
  }
  return null;
}

function escapedHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function hasOneMeta(html, attribute, name, value) {
  const pattern = new RegExp(`<meta ${attribute}="${name}" content="([^"]*)" \/>`, 'g');
  const matches = [...html.matchAll(pattern)];
  return matches.length === 1 && matches[0][1] === escapedHtml(value);
}

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
  const publicContactIcons = assets.filter(name => contactIconFiles.includes(name));
  if (assets.length !== 6 || bundleAssets.length !== 2 || portraitAssets.length !== 1 ||
      publicContactIcons.length !== contactIconFiles.length ||
      !bundleAssets.some(name => name.endsWith('.js')) || !bundleAssets.some(name => name.endsWith('.css'))) {
    throw new Error('Conjunto de bundles inesperado.');
  }
  const documents = publicDocumentFiles(showcase.projects);
  const files = ['404.html', '_headers', ...faviconFiles, openGraphImageFile, ...documents, ...assets.map(name => `assets/${name}`)].sort();
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
  const stylesheet = readFileSync(join(root, `assets/${bundleAssets.find(name => name.endsWith('.css'))}`), 'utf8');
  const iconContents = contactIconFiles.map(name => readFileSync(join(root, `assets/${name}`), 'utf8'));
  const ico = readFileSync(join(root, 'favicon.ico'));
  const smallFavicon = readFileSync(join(root, 'favicon-32.png'));
  const appleTouchIcon = readFileSync(join(root, 'apple-touch-icon.png'));
  const openGraphImage = readFileSync(join(root, openGraphImageFile));
  const openGraphDimensions = jpegDimensions(openGraphImage);
  const notFound = readFileSync(join(root, '404.html'), 'utf8');
  const routeHtml = routeDocuments(showcase.projects).map(route => ({
    ...route,
    html: readFileSync(join(root, route.file), 'utf8'),
  }));
  const publicContacts = ['leo.ateliedigital@gmail.com', 'https://github.com/777McLovin777', '5511910513097', 'https://wa.me/'];
  const faviconLinks = [
    '<link rel="icon" href="/favicon.ico" sizes="any" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
  ];
  const icoValid = ico.length >= 22 && ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1 &&
    ico.readUInt16LE(4) === 1 && ico[6] === 32 && ico[7] === 32 && ico.readUInt32LE(18) === 22 &&
    ico.readUInt32LE(14) === ico.length - 22 && isPng(ico.subarray(22));
  const htmlDocuments = [index, ...routeHtml.map(route => route.html)];
  const metadataDocuments = [
    {html:index, title:HOME_METADATA.title, ogTitle:HOME_METADATA.ogTitle, ogDescription:HOME_METADATA.ogDescription, url:HOME_METADATA.url},
    ...routeHtml,
  ];
  const exactMeta = metadataDocuments.every(({html, title, ogTitle, ogDescription, url}) =>
    (html.match(/<title>/g) || []).length === 1 && html.includes(`<title>${escapeHtml(title)}</title>`) &&
    new URL(url).protocol === 'https:' && new URL(url).origin === PUBLIC_ORIGIN &&
    hasOneMeta(html, 'property', 'og:type', 'website') &&
    hasOneMeta(html, 'property', 'og:title', ogTitle) &&
    hasOneMeta(html, 'property', 'og:description', ogDescription) &&
    hasOneMeta(html, 'property', 'og:image', OPEN_GRAPH_IMAGE_URL) &&
    hasOneMeta(html, 'property', 'og:image:width', '1200') &&
    hasOneMeta(html, 'property', 'og:image:height', '630') &&
    hasOneMeta(html, 'property', 'og:image:alt', 'Ateliê Digital — identidade visual e soluções digitais.') &&
    hasOneMeta(html, 'property', 'og:url', url) &&
    hasOneMeta(html, 'name', 'twitter:card', 'summary_large_image') &&
    hasOneMeta(html, 'name', 'twitter:title', ogTitle) &&
    hasOneMeta(html, 'name', 'twitter:description', ogDescription) &&
    hasOneMeta(html, 'name', 'twitter:image', OPEN_GRAPH_IMAGE_URL));
  const publicText = [script, stylesheet, ...htmlDocuments, ...iconContents].join('\n');
  if (!permissions.test(readFileSync(join(root, '_headers'), 'utf8')) || !icoValid ||
      !isPng(smallFavicon) || !isPng(appleTouchIcon) || iconContents.some(source => !safeContactSvg(source)) ||
      !openGraphDimensions || openGraphDimensions.width !== 1200 || openGraphDimensions.height !== 630 || openGraphImage.length > 500000 ||
      !exactMeta || /property="og:|name="twitter:/i.test(notFound) ||
      decorativeStar.test(publicText) ||
      htmlDocuments.some(html => faviconLinks.some(link => !html.includes(link))) ||
      !bundleAssets.every(name => index.includes('/assets/' + name)) ||
      !script.includes('/assets/' + portraitAssets[0]) ||
      contactIconFiles.some(name => !script.includes(`/assets/${name}`)) ||
      routeHtml.some(({html}) => !bundleAssets.every(name => html.includes('/assets/' + name))) ||
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

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
const projectImageFiles = [
  'home-desktop.webp', 'home-mobile.webp', 'catalog-capture.webp', 'catalog-mobile.webp',
  'cart-desktop.webp', 'account-desktop.webp', 'account-mobile.webp',
];
const projectImageDimensions = {
  'home-desktop.webp': [1916, 867], 'home-mobile.webp': [810, 12771],
  'catalog-capture.webp': [355, 870], 'catalog-mobile.webp': [810, 9319],
  'cart-desktop.webp': [1432, 852], 'account-desktop.webp': [1697, 877],
  'account-mobile.webp': [810, 1800],
};
const operationalProjectAssets = {
  conciliacnes: {
    cover: 'files-step.webp', icon: 'icon.webp',
    images: {
      'files-step.webp': [1440, 857], 'establishments-step.webp': [1439, 861],
      'excel-report-step.webp': [1438, 858], 'icon.webp': [32, 32],
    },
  },
  'conversores-sus': {
    cover: 'home-portfolio.webp', icon: 'icon.webp',
    images: {
      'home-portfolio.webp': [1440, 856], 'apac-paciente-portfolio.webp': [1440, 858], 'apac-procedimentos-portfolio.webp': [1440, 846],
      'biomega-bpac-portfolio.webp': [1440, 857], 'visa-bpac-portfolio.webp': [1440, 858], 'samu-bpac-portfolio.webp': [1440, 858],
      'icon.webp': [512, 512],
    },
  },
};
function configDimensions(projectId, fileName) {
  return operationalProjectAssets[projectId]?.images[fileName] || [];
}
const unsafeSvg = /<\s*(?:script|foreignObject|iframe|object|embed|image|use|animate(?:Motion|Transform)?|set|audio|video)\b|\bon[a-z0-9_-]+\s*=|\b(?:href|xlink:href|src)\s*=|\bstyle\s*=|url\s*\(|javascript:|data:/i;
const decorativeStar = /[✳✱✻✼✽❋❊❉⁎∗＊]/u;

function safeContactSvg(source) {
  return /^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(source) && !unsafeSvg.test(source) &&
    [...source.matchAll(/<\/?([a-z][\w-]*)\b/gi)].every(([, name]) => ['svg', 'g', 'path'].includes(name.toLowerCase()));
}

function isPng(buffer) {
  return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}

function webpDimensions(buffer) {
  if (buffer.length < 25 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8 ' && buffer.length >= 30 && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
    return {width:buffer.readUInt16LE(26) & 0x3fff, height:buffer.readUInt16LE(28) & 0x3fff};
  }
  if (chunk === 'VP8L' && buffer[20] === 0x2f) {
    return {width:1 + buffer[21] + ((buffer[22] & 0x3f) << 8), height:1 + ((buffer[22] >> 6) | (buffer[23] << 2) | ((buffer[24] & 0x0f) << 10))};
  }
  if (chunk === 'VP8X' && buffer.length >= 30) {
    return {width:1 + buffer.readUIntLE(24, 3), height:1 + buffer.readUIntLE(27, 3)};
  }
  return null;
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
  const project = showcase.projects.find(item => item.id === 'pe-de-moca');
  const operationalProjects = showcase.projects.filter(item => ['conciliacnes', 'conversores-sus'].includes(item.id));
  const operationalProjectsValid = operationalProjects.length === 2 &&
    operationalProjects.map(item => item.id).join(',') === 'conciliacnes,conversores-sus' &&
    operationalProjects.every(item => item.category === 'Automação' && item.year === '' && item.caseStudy &&
      item.image === `/assets/projects/${item.id}/${operationalProjectAssets[item.id].cover}` &&
      item.icon === `/assets/projects/${item.id}/${operationalProjectAssets[item.id].icon}` && item.gallery.length === Object.keys(operationalProjectAssets[item.id].images).length - 1 &&
      item.gallery.every(image => image.src.startsWith(`/assets/projects/${item.id}/`) && image.alt && image.caption && image.width > 0 && image.height > 0) &&
      !item.demoUrl && !item.repositoryUrl);
  const operationalImageNames = Object.fromEntries(Object.entries(operationalProjectAssets).map(([id, config]) => [id, Object.keys(config.images)]));
  const operationalGalleryNamesMatch = operationalProjects.every(item => {
    const galleryNames = item.gallery.map(image => image.src.replace(`/assets/projects/${item.id}/`, '')).sort();
    const expectedNames = operationalImageNames[item.id].filter(name => name !== 'icon.webp').sort();
    return galleryNames.join(',') === expectedNames.join(',') && item.gallery.every(image => {
      const [width, height] = configDimensions(item.id, image.src.split('/').at(-1));
      return image.width === width && image.height === height;
    });
  });
  const projectGalleryNames = project?.gallery.map(image => image.src.replace('/assets/projects/pe-de-moca/', '')).sort() || [];
  if (assets.length !== 7 || !assets.includes('projects') || bundleAssets.length !== 2 || portraitAssets.length !== 1 ||
      publicContactIcons.length !== contactIconFiles.length ||
      !bundleAssets.some(name => name.endsWith('.js')) || !bundleAssets.some(name => name.endsWith('.css')) ||
      projectImageFiles.length !== 7 || new Set(projectImageFiles).size !== projectImageFiles.length ||
      projectGalleryNames.join(',') !== [...projectImageFiles].sort().join(',') ||
      project?.image !== '/assets/projects/pe-de-moca/catalog-mobile.webp' || !operationalProjectsValid || !operationalGalleryNamesMatch ||
      project?.demoUrl !== 'https://delivery-pedemoca.pages.dev/' ||
      project?.repositoryUrl !== 'https://github.com/777McLovin777/delivery-pedemoca') {
    throw new Error('Conjunto de bundles inesperado.');
  }
  const documents = publicDocumentFiles(showcase.projects);
  const files = ['404.html', '_headers', ...faviconFiles, openGraphImageFile, ...documents,
    ...assets.filter(name => name !== 'projects').map(name => `assets/${name}`),
    ...projectImageFiles.map(name => `assets/projects/pe-de-moca/${name}`),
    ...Object.entries(operationalImageNames).flatMap(([id, names]) => names.map(name => `assets/projects/${id}/${name}`))].sort();
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
  const projectImageBuffers = projectImageFiles.map(name => readFileSync(join(root, 'assets', 'projects', 'pe-de-moca', name)));
  const projectImagesValid = projectImageBuffers.every((buffer, index) => {
    const dimensions = webpDimensions(buffer);
    const [width, height] = projectImageDimensions[projectImageFiles[index]];
    return dimensions?.width === width && dimensions?.height === height && buffer.length < 1_000_000;
  });
  const operationalImageBuffers = Object.entries(operationalImageNames).flatMap(([id, names]) => names.map(name => ({
    id, name, buffer:readFileSync(join(root, 'assets', 'projects', id, name)),
  })));
  const operationalImagesValid = operationalImageBuffers.every(({id, name, buffer}) => {
    const dimensions = webpDimensions(buffer);
    const [width, height] = operationalProjectAssets[id].images[name];
    return dimensions?.width === width && dimensions?.height === height && buffer.length < 1_000_000;
  });
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
  const publicTextWithoutApprovedDemoUrl = publicText.replaceAll(project.demoUrl, '');
  if (!permissions.test(readFileSync(join(root, '_headers'), 'utf8')) || !icoValid ||
      !isPng(smallFavicon) || !isPng(appleTouchIcon) || iconContents.some(source => !safeContactSvg(source)) ||
      !openGraphDimensions || openGraphDimensions.width !== 1200 || openGraphDimensions.height !== 630 || openGraphImage.length > 500000 ||
      !exactMeta || /property="og:|name="twitter:/i.test(notFound) ||
      !projectImagesValid || projectImageBuffers.reduce((total, image) => total + image.length, 0) > 2_000_000 ||
      !operationalImagesValid || operationalImageBuffers.reduce((total, image) => total + image.buffer.length, 0) > 1_500_000 ||
      decorativeStar.test(publicText) ||
      htmlDocuments.some(html => faviconLinks.some(link => !html.includes(link))) ||
      !bundleAssets.every(name => index.includes('/assets/' + name)) ||
      !script.includes('/assets/' + portraitAssets[0]) ||
      projectImageFiles.some(name => !script.includes(`/assets/projects/pe-de-moca/${name}`)) ||
      operationalImageBuffers.some(({id, name}) => !script.includes(`/assets/projects/${id}/${name}`)) ||
      contactIconFiles.some(name => !script.includes(`/assets/${name}`)) ||
      routeHtml.some(({html}) => !bundleAssets.every(name => html.includes('/assets/' + name))) ||
      publicContacts.some(value => !script.includes(value)) ||
      !script.includes(project.demoUrl) || !script.includes(project.repositoryUrl) ||
      /supabase\.co|storage:\/\/|#\/admin|VITE_|contato@exemplo\.com|delivery-pedemoca\.pages\.dev|atelier_portfolio_v1_data|sb_(?:secret|publishable)_|doceconecta|doce conecta|doce-conecta|C:\\\\MCLOVIN|C:\\\\Users\\\\Saude4|Saude4\\\\Documents/i.test(publicTextWithoutApprovedDemoUrl)) {
    throw new Error('Referência privada, proteção ausente ou bundle não referenciado.');
  }
  const manifest = files.map(name => `${createHash('sha256').update(readFileSync(join(root, name))).digest('hex')}  dist-vitrine/${name}`).join('\n') + '\n';
  writeFileSync(join(projectRoot, 'SHA256SUMS.vitrine-build.txt'), manifest, 'utf8');
  console.log(manifest.trimEnd());
} catch {
  console.error('Auditoria da vitrine reprovada. Gere dist-vitrine e confira a estrutura, os cabeçalhos e as referências. Não distribua o diretório.');
  process.exitCode = 1;
}

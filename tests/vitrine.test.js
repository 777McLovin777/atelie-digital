import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {showcase} from '../vitrine/content.js';
import {quoteHref, WHATSAPP_INITIAL_MESSAGE, whatsappHref} from '../src/data/contact.js';
import {isDemoProject} from '../src/data/demoProjects.js';
import {currentPublicPath, HOME_METADATA, OPEN_GRAPH_IMAGE_URL, PUBLIC_ORIGIN, PUBLIC_PATHS, PUBLIC_TITLE, projectPath, publicDocumentFiles, routeDocuments, routeId, safeUrl} from '../src/data/publicUrls.js';

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
    if (frameMarkers.has(marker)) return {width:buffer.readUInt16BE(offset + 5), height:buffer.readUInt16BE(offset + 3)};
    offset += length;
  }
  return null;
}

test('vitrine has four services, disclosed samples and the authorized contact channels', () => {
  assert.equal(showcase.services.length, 4);
  assert.equal(showcase.projects.length, 2);
  assert.deepEqual(showcase.projects.map(project => project.id), ['pe-de-moca', 'laboratorio']);
  assert.deepEqual([...new Set(showcase.projects.map(project => project.category))], ['Web', 'Experimento']);
  assert.ok(showcase.projects.every(p => isDemoProject(p) && !p.link && !p.results));
  const peDeMoca = showcase.projects[0];
  const laboratorio = showcase.projects[1];
  assert.equal(peDeMoca.image, '/assets/projects/pe-de-moca/catalog-mobile.webp');
  assert.equal(peDeMoca.gallery.length, 7);
  assert.ok(peDeMoca.gallery.every(image => image.src.startsWith('/assets/projects/pe-de-moca/') && image.alt && image.caption && image.width > 0 && image.height > 0));
  assert.deepEqual(laboratorio.gallery, []);
  assert.equal(laboratorio.image, '');
  assert.equal(peDeMoca.demoUrl, 'https://delivery-pedemoca.pages.dev/');
  assert.equal(peDeMoca.repositoryUrl, 'https://github.com/777McLovin777/delivery-pedemoca');
  assert.doesNotMatch(peDeMoca.description, /vendas|clientes ativos|pagamento em produção/i);
  assert.equal(showcase.profile.email, 'leo.ateliedigital@gmail.com');
  assert.equal(showcase.profile.github, 'https://github.com/777McLovin777');
  assert.equal(showcase.profile.whatsapp, '5511910513097');
  const email = new URL(quoteHref(showcase.profile.email, 'Sites'));
  assert.equal(email.protocol, 'mailto:');
  assert.equal(email.pathname, showcase.profile.email);
  assert.equal(email.searchParams.get('subject'), 'Solicitação de orçamento — Ateliê Digital');
  assert.equal(email.searchParams.get('body'), [
    'Olá, Leonardo de Oliveira!', '', 'Tipo de Projeto: Sites', 'Telefone:', 'Objetivo:', 'Prazo Previsto:',
  ].join('\r\n'));
  const generalEmail = new URL(quoteHref(showcase.profile.email));
  assert.equal(generalEmail.searchParams.get('body'), [
    'Olá, Leonardo de Oliveira!', '', 'Tipo de Projeto:', 'Telefone:', 'Objetivo:', 'Prazo Previsto:',
  ].join('\r\n'));
  assert.equal(quoteHref('contato@example.com'), '');
  const whatsapp = new URL(whatsappHref(showcase.profile.whatsapp));
  assert.equal(whatsapp.origin, 'https://wa.me');
  assert.equal(whatsapp.pathname, '/5511910513097');
  assert.equal(whatsapp.searchParams.get('text'), WHATSAPP_INITIAL_MESSAGE);
  assert.equal(whatsappHref('123'), '');
});

test('Pé de Moça case study separates demonstrated screens from integrations pending validation', () => {
  const page = readFileSync(new URL('../src/components/PublicPage.jsx', import.meta.url), 'utf8');
  const gallery = readFileSync(new URL('../src/components/Experience.jsx', import.meta.url), 'utf8');
  const model = readFileSync(new URL('../src/data/demoProjects.js', import.meta.url), 'utf8');
  const vite = readFileSync(new URL('../vite.vitrine.config.js', import.meta.url), 'utf8');
  const audit = readFileSync(new URL('../scripts/audit-vitrine.mjs', import.meta.url), 'utf8');
  assert.match(page, /\{project\.name\} — Plataforma digital para confeitaria artesanal/);
  assert.match(page, /Organizar a apresentação dos produtos/);
  assert.match(page, /autenticação, operação do pedido e integrações de pagamento, incluindo PIX, não são apresentadas aqui como homologadas ou em produção/);
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
  assert.match(page, /detail\.id === 'pe-de-moca' \? <PeDeMocaCaseStudy/);
  assert.match(gallery, /alt=\{image\.alt\}/);
  assert.match(gallery, /aria-label=\{`Ampliar imagem/);
  assert.match(gallery, /dialogRef\.current\.close\(\)/);
  assert.match(gallery, /event\.key === 'ArrowRight'/);
  assert.match(gallery, /event\.key === 'ArrowLeft'/);
  assert.match(gallery, /triggerRef\.current\?\.focus/);
  assert.match(gallery, /aria-live="polite"/);
  assert.equal((model.match(/src:'\/assets\/projects\/pe-de-moca\//g) || []).length, 7);
  assert.match(vite, /projectImageFiles = \[/);
  assert.match(vite, /assets\/projects\/pe-de-moca\/\$\{fileName\}/);
  assert.match(audit, /projectImageFiles\.length !== 7/);
  assert.match(audit, /function webpDimensions\(/);
  assert.match(audit, /projectImagesValid/);
});

test('contact links use the requested order and safe external-tab attributes', () => {
  const page = readFileSync(new URL('../src/components/PublicPage.jsx', import.meta.url), 'utf8');
  assert.ok(page.indexOf('E-mail</span>') < page.indexOf('GitHub — Conheça meus projetos'));
  assert.ok(page.indexOf('GitHub — Conheça meus projetos') < page.indexOf('WhatsApp — Conversar sobre um projeto'));
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
  assert.match(page, /className="contact-channel" href=\{emailContact\} aria-label="Enviar e-mail para solicitar orçamento">\s*<span className="contact-channel-label"><img src="\/assets\/gmail\.svg" width="22" height="22" alt="" aria-hidden="true" \/>E-mail<\/span>\s*<ArrowUpRight size=\{18\} aria-hidden="true" \/>/);
  assert.doesNotMatch(page, /<strong>\{data\.profile\.email\}<\/strong>/);
  for (const icon of ['gmail', 'github', 'whatsapp']) {
    assert.match(page, new RegExp(`/assets/${icon}\\.svg`));
  }
  assert.equal((page.match(/width="22" height="22" alt="" aria-hidden="true"/g) || []).length, 3);
});

test('favicon files are linked on every generated route and decorative stars are absent', () => {
  const html = readFileSync(new URL('../vitrine/index.html', import.meta.url), 'utf8');
  for (const link of [
    '<link rel="icon" href="/favicon.ico" sizes="any" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
  ]) assert.ok(html.includes(link));
  const publicFiles = [
    '../src/components/CommercialHome.jsx', '../src/components/PublicPage.jsx',
    '../src/components/Experience.jsx', '../vitrine/main.jsx', '../vitrine/index.html',
  ].map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');
  assert.doesNotMatch(publicFiles, /✳|✱|✻|✼|✽|❋|❊|❉|⁎|∗|＊|&#10035;|&#x2733;/);
  assert.doesNotMatch(publicFiles, /Sparkles/);
  const styles = readFileSync(new URL('../src/components/commercial-home.css', import.meta.url), 'utf8');
  assert.doesNotMatch(styles, /content\s*:\s*['"][✳✱✻✼✽❋❊❉⁎∗＊]/);
});

test('commercial SVGs contain only passive local vector shapes', () => {
  for (const name of ['gmail.svg', 'github.svg', 'whatsapp.svg']) {
    const source = readFileSync(new URL(`../src/assets/contact/${name}`, import.meta.url), 'utf8');
    assert.match(source, /^\s*<svg\b[\s\S]*<\/svg>\s*$/i);
    assert.doesNotMatch(source, /<\s*(?:script|foreignObject|iframe|object|embed|image|use|animate(?:Motion|Transform)?|set)\b|\bon[a-z0-9_-]+\s*=|\b(?:href|xlink:href|src)\s*=|\bstyle\s*=|url\s*\(|javascript:|data:/i);
    const elements = [...source.matchAll(/<\/?([a-z][\w-]*)\b/gi)].map(([, element]) => element.toLowerCase());
    assert.ok(elements.length > 0 && elements.every(element => ['svg', 'g', 'path'].includes(element)));
  }
});

test('contact page presents the approved portrait with a responsive profile card', () => {
  const page = readFileSync(new URL('../src/components/PublicPage.jsx', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('../src/components/commercial-home.css', import.meta.url), 'utf8');
  const audit = readFileSync(new URL('../scripts/audit-vitrine.mjs', import.meta.url), 'utf8');
  assert.match(page, /\.\.\/assets\/people\/leonardo-oliveira\.webp/);
  assert.match(page, /alt="Retrato profissional de Leonardo Oliveira, usando óculos e barba\."/);
  assert.match(page, /width="960" height="960"/);
  assert.match(page, /Leonardo Oliveira/);
  assert.match(page, /Desenvolvo sites, sistemas personalizados e automações que unem identidade visual, organização e praticidade\./);
  assert.match(page, /No Ateliê Digital, transformo ideias em experiências digitais claras e funcionais\./);
  assert.match(styles, /\.contact-profile-photo\s*\{[^}]*border-radius:\s*50%[^}]*object-fit:\s*cover/s);
  assert.match(styles, /@media\s*\(max-width:\s*900px\)\s*\{[^}]*\.contact-page \.contact-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(styles, /width:\s*clamp\(11rem,\s*14vw,\s*12rem\)/);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)\s*and\s*\(min-height:\s*650px\)/);
  assert.match(audit, /leonardo-oliveira-\[\\w-\]\+\\\.webp/);
});

test('SEO metadata matches the Portuguese public showcase', () => {
  const html = readFileSync(new URL('../vitrine/index.html', import.meta.url), 'utf8');
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<title>Ateliê Digital<\/title>/);
  assert.equal(PUBLIC_TITLE, 'Ateliê Digital');
  assert.deepEqual(HOME_METADATA, {
    title: 'Ateliê Digital',
    ogTitle: 'Ateliê Digital | Soluções digitais',
    ogDescription: 'Sites, sistemas personalizados e automações para transformar ideias em soluções digitais.',
    url: `${PUBLIC_ORIGIN}/`,
  });
  assert.match(html, /property="og:site_name" content="Ateliê Digital"/);
  assert.match(html, /property="og:locale" content="pt_BR"/);
  for (const tag of [
    `property="og:title" content="${HOME_METADATA.ogTitle}"`,
    `property="og:description" content="${HOME_METADATA.ogDescription}"`,
    `property="og:image" content="${OPEN_GRAPH_IMAGE_URL}"`,
    'property="og:image:width" content="1200"',
    'property="og:image:height" content="630"',
    'property="og:image:alt" content="Ateliê Digital — identidade visual e soluções digitais."',
    `property="og:url" content="${HOME_METADATA.url}"`,
    'name="twitter:card" content="summary_large_image"',
    `name="twitter:image" content="${OPEN_GRAPH_IMAGE_URL}"`,
    `name="twitter:title" content="${HOME_METADATA.ogTitle}"`,
    `name="twitter:description" content="${HOME_METADATA.ogDescription}"`,
  ]) assert.ok(html.includes(tag), `Metadado esperado ausente: ${tag}`);
  for (const name of ['og:type', 'og:title', 'og:description', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:url', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    const attribute = name.startsWith('twitter:') ? 'name' : 'property';
    assert.equal((html.match(new RegExp(`<meta ${attribute}="${name}"`, 'g')) || []).length, 1, `${name} deve aparecer uma única vez`);
  }
  const ogImage = readFileSync(new URL('../vitrine/og-image.jpg', import.meta.url));
  assert.deepEqual(jpegDimensions(ogImage), {width:1200, height:630});
  assert.ok(ogImage.length < 500000, 'Imagem Open Graph deve ser leve para compartilhamento');
  assert.equal(new URL(OPEN_GRAPH_IMAGE_URL).protocol, 'https:');
  const runtime = readFileSync(new URL('../vitrine/main.jsx', import.meta.url), 'utf8');
  assert.match(runtime, /document\.title = PUBLIC_TITLE/);
  assert.doesNotMatch(runtime, /document\.title\s*=.*· Ateliê Digital/);
});

test('public routes and headers keep navigation and network restricted', () => {
  assert.equal(routeId('#/projeto/pe-de-moca'), 'pe-de-moca');
  assert.equal(routeId('/projeto/pe-de-moca/'), 'pe-de-moca');
  assert.equal(routeId('/projeto/%E0%A4%A'), '__invalid_route__');
  assert.equal(projectPath('laboratorio'), '/projeto/laboratorio');
  assert.equal(currentPublicPath('/', '#/sobre'), '/estudio');
  assert.equal(currentPublicPath('/estudio/', ''), '/estudio');
  assert.equal(currentPublicPath('/projeto/pe-de-moca', ''), '/projeto/pe-de-moca');
  const documents = routeDocuments(showcase.projects);
  assert.deepEqual(documents.map(route => route.path), [
    '/projetos', '/estudio', '/servicos', '/contato', '/projeto/pe-de-moca', '/projeto/laboratorio',
  ]);
  assert.deepEqual(documents.map(route => route.title), Array(6).fill(PUBLIC_TITLE));
  assert.ok(documents.every(route => route.url === `${PUBLIC_ORIGIN}${route.path}` && route.ogTitle && route.ogDescription));
  assert.deepEqual(publicDocumentFiles(showcase.projects), [
    'index.html', 'projetos/index.html', 'estudio/index.html', 'servicos/index.html', 'contato/index.html',
    'projeto/pe-de-moca/index.html', 'projeto/laboratorio/index.html',
  ]);
  assert.equal(safeUrl('javascript:void(0)'), '');
  const app = readFileSync(new URL('../vitrine/main.jsx', import.meta.url), 'utf8');
  assert.match(app, /addEventListener\('popstate'/);
  assert.match(app, /currentPublicPath\(location\.pathname, location\.hash\)/);
  const notFound = readFileSync(new URL('../vitrine/404.html', import.meta.url), 'utf8');
  assert.match(notFound, /<title>Ateliê Digital<\/title>/);
  assert.match(notFound, /Voltar à vitrine do Ateliê Digital/);
  const headers = readFileSync(new URL('../vitrine/_headers', import.meta.url), 'utf8');
  for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-ancestors 'none'"]) {
    assert.ok(headers.includes(directive));
  }
});

test('home is a summary and keeps links to projects, services, studio and contact', () => {
  const home = readFileSync(new URL('../src/components/CommercialHome.jsx', import.meta.url), 'utf8');
  assert.match(home, /Boas ideias merecem experiências extraordinárias\./);
  assert.match(home, /className="service-summary"/);
  assert.equal((home.match(/<section\b/g) || []).length, 4);
  assert.match(home, /className="hero"/);
  assert.match(home, /className="home-services"/);
  assert.match(home, /className="featured"/);
  assert.match(home, /className="big-cta"/);
  assert.match(home, /\.slice\(0, 2\)/);
  assert.match(home, /PUBLIC_PATHS\.projects/);
  assert.match(home, /PUBLIC_PATHS\.services/);
  assert.match(home, /PUBLIC_PATHS\.contact/);
  assert.doesNotMatch(home, /home-process|studio-section|<Services/);
  const homeStyles = readFileSync(new URL('../src/components/commercial-home.css', import.meta.url), 'utf8');
  assert.match(homeStyles, /\.service-summary li\s*\{[^}]*flex-direction:\s*column/);
  assert.match(homeStyles, /\.service-summary li > strong\s*\{[^}]*white-space:\s*nowrap/);
  assert.match(homeStyles, /@media \(max-width: 1050px\)\s*\{\s*\.service-summary\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(homeStyles, /\.service-summary\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(homeStyles, /\.commercial-home > \.hero\s*\{\s*min-height:\s*clamp\(/);
  assert.match(homeStyles, /\.commercial-home \.featured \.project-visual\s*\{\s*height:\s*clamp\(14rem/);
  assert.doesNotMatch(homeStyles, /grid-template-areas:/);
  const responsive = readFileSync(new URL('../src/responsive.css', import.meta.url), 'utf8');
  assert.match(responsive, /@media \(hover:hover\) and \(pointer:fine\)/);
  assert.match(responsive, /html::-webkit-scrollbar\{width:8px/);
  assert.match(responsive, /scrollbar-color:var\(--teal\)/);
  assert.match(responsive, /html::-webkit-scrollbar-thumb:hover\{background:var\(--rust\)/);
  assert.doesNotMatch(responsive, /scroll-snap/);
  const publicPages = [
    '../src/components/CommercialHome.jsx', '../src/components/PublicPage.jsx',
    '../src/components/Project.jsx', '../src/components/Experience.jsx', '../vitrine/main.jsx',
  ].map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');
  assert.doesNotMatch(publicPages, /href\s*=\s*['"]#\//);
});

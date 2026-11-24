import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {showcase} from '../vitrine/content.js';
import {quoteHref, WHATSAPP_INITIAL_MESSAGE, whatsappHref} from '../src/data/contact.js';
import {isDemoProject} from '../src/data/demoProjects.js';
import {currentPublicPath, projectPath, publicDocumentFiles, routeDocuments, routeId, safeUrl} from '../src/data/publicUrls.js';

test('vitrine has four services, disclosed samples and the authorized contact channels', () => {
  assert.equal(showcase.services.length, 4);
  assert.equal(showcase.projects.length, 2);
  assert.deepEqual(showcase.projects.map(project => project.id), ['pe-de-moca', 'laboratorio']);
  assert.deepEqual([...new Set(showcase.projects.map(project => project.category))], ['Web', 'Experimento']);
  assert.ok(showcase.projects.every(p => isDemoProject(p) && !p.link && !p.image && !p.gallery.length && !p.results));
  assert.equal(showcase.profile.email, 'leo.ateliedigital@gmail.com');
  assert.equal(showcase.profile.github, 'https://github.com/777McLovin777');
  assert.equal(showcase.profile.whatsapp, '5511910513097');
  const email = new URL(quoteHref(showcase.profile.email, 'Sites'));
  assert.equal(email.protocol, 'mailto:');
  assert.equal(email.pathname, showcase.profile.email);
  assert.equal(email.searchParams.get('subject'), 'Solicitação de orçamento');
  assert.match(email.searchParams.get('body'), /Tipo de projeto: Sites\r\n/);
  assert.equal(quoteHref('contato@example.com'), '');
  const whatsapp = new URL(whatsappHref(showcase.profile.whatsapp));
  assert.equal(whatsapp.origin, 'https://wa.me');
  assert.equal(whatsapp.pathname, '/5511910513097');
  assert.equal(whatsapp.searchParams.get('text'), WHATSAPP_INITIAL_MESSAGE);
  assert.equal(whatsappHref('123'), '');
});

test('contact links use the requested order and safe external-tab attributes', () => {
  const page = readFileSync(new URL('../src/components/PublicPage.jsx', import.meta.url), 'utf8');
  assert.ok(page.indexOf('E-mail</span>') < page.indexOf('GitHub — Conheça meus projetos'));
  assert.ok(page.indexOf('GitHub — Conheça meus projetos') < page.indexOf('WhatsApp — Conversar sobre um projeto'));
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
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
  assert.match(html, /<title>Ateliê Digital · Estúdio de soluções digitais<\/title>/);
  assert.match(html, /property="og:site_name" content="Ateliê Digital"/);
  assert.match(html, /property="og:locale" content="pt_BR"/);
  assert.match(html, /name="twitter:card" content="summary"/);
});

test('public routes and headers keep navigation and network restricted', () => {
  assert.equal(routeId('#/projeto/pe-de-moca'), 'pe-de-moca');
  assert.equal(routeId('/projeto/pe-de-moca/'), 'pe-de-moca');
  assert.equal(routeId('/projeto/%E0%A4%A'), '__invalid_route__');
  assert.equal(projectPath('laboratorio'), '/projeto/laboratorio');
  assert.equal(currentPublicPath('/', '#/sobre'), '/estudio');
  assert.equal(currentPublicPath('/estudio/', ''), '/estudio');
  assert.equal(currentPublicPath('/projeto/pe-de-moca', ''), '/projeto/pe-de-moca');
  assert.deepEqual(routeDocuments(showcase.projects).map(route => route.path), [
    '/projetos', '/estudio', '/servicos', '/contato', '/projeto/pe-de-moca', '/projeto/laboratorio',
  ]);
  assert.deepEqual(publicDocumentFiles(showcase.projects), [
    'index.html', 'projetos/index.html', 'estudio/index.html', 'servicos/index.html', 'contato/index.html',
    'projeto/pe-de-moca/index.html', 'projeto/laboratorio/index.html',
  ]);
  assert.equal(safeUrl('javascript:void(0)'), '');
  const app = readFileSync(new URL('../vitrine/main.jsx', import.meta.url), 'utf8');
  assert.match(app, /addEventListener\('popstate'/);
  assert.match(app, /currentPublicPath\(location\.pathname, location\.hash\)/);
  const notFound = readFileSync(new URL('../vitrine/404.html', import.meta.url), 'utf8');
  assert.match(notFound, /<title>Página não encontrada · Ateliê Digital<\/title>/);
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

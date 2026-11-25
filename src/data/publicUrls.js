export const PUBLIC_PATHS = Object.freeze({
  home: '/',
  projects: '/projetos',
  studio: '/estudio',
  services: '/servicos',
  contact: '/contato',
  projectPrefix: '/projeto/',
});

export const PUBLIC_ORIGIN = 'https://atelie-digital-211.pages.dev';
export const OPEN_GRAPH_IMAGE_URL = `${PUBLIC_ORIGIN}/og-image.jpg`;
export const PUBLIC_TITLE = 'Ateliê Digital';
export const HOME_METADATA = Object.freeze({
  title: PUBLIC_TITLE,
  ogTitle: 'Ateliê Digital | Soluções digitais',
  ogDescription: 'Sites, sistemas personalizados e automações para transformar ideias em soluções digitais.',
  url: `${PUBLIC_ORIGIN}/`,
});

const LEGACY_PATHS = Object.freeze({
  '/': PUBLIC_PATHS.home,
  '/projetos': PUBLIC_PATHS.projects,
  '/sobre': PUBLIC_PATHS.studio,
  '/estudio': PUBLIC_PATHS.studio,
  '/servicos': PUBLIC_PATHS.services,
  '/contato': PUBLIC_PATHS.contact,
});

export function normalizePathname(pathname = '/') {
  const path = String(pathname).split(/[?#]/, 1)[0] || '/';
  return path === '/' ? '/' : path.replace(/\/+$/, '') || '/';
}

export function currentPublicPath(pathname = '/', hash = '') {
  const path = normalizePathname(pathname);
  if (path !== '/' || !hash.startsWith('#/')) return LEGACY_PATHS[path] || path;
  const legacyPath = normalizePathname(hash.slice(1));
  if (legacyPath.startsWith(PUBLIC_PATHS.projectPrefix)) return legacyPath;
  return LEGACY_PATHS[legacyPath] || legacyPath;
}

export function projectPath(id) {
  return `${PUBLIC_PATHS.projectPrefix}${encodeURIComponent(String(id))}`;
}

export function routeId(route) {
  try {
    const path = normalizePathname(route.startsWith('#') ? route.slice(1) : route);
    if (!path.startsWith(PUBLIC_PATHS.projectPrefix)) return '';
    const id = path.slice(PUBLIC_PATHS.projectPrefix.length);
    if (!id || id.includes('/')) return '__invalid_route__';
    return decodeURIComponent(id);
  } catch {
    return '__invalid_route__';
  }
}

export function routeDocuments(projects = []) {
  const pages = [
    {path: PUBLIC_PATHS.projects, file: 'projetos/index.html', title: PUBLIC_TITLE,
      ogTitle: 'Projetos | Ateliê Digital', ogDescription: 'Explore projetos demonstrativos de experiências digitais criadas pelo Ateliê Digital.'},
    {path: PUBLIC_PATHS.studio, file: 'estudio/index.html', title: PUBLIC_TITLE,
      ogTitle: 'Estúdio | Ateliê Digital', ogDescription: 'Conheça o Ateliê Digital e sua abordagem para criar sites, sistemas e automações.'},
    {path: PUBLIC_PATHS.services, file: 'servicos/index.html', title: PUBLIC_TITLE,
      ogTitle: 'Serviços | Ateliê Digital', ogDescription: HOME_METADATA.ogDescription},
    {path: PUBLIC_PATHS.contact, file: 'contato/index.html', title: PUBLIC_TITLE,
      ogTitle: 'Contato | Ateliê Digital', ogDescription: 'Entre em contato com Leonardo Oliveira para conversar sobre um projeto digital.'},
  ];
  for (const project of projects) {
    const path = projectPath(project.id);
    if (!/^[a-z0-9-]+$/i.test(path.slice(PUBLIC_PATHS.projectPrefix.length))) {
      throw new Error(`ID de projeto inválido para rota pública: ${project.id}`);
    }
    pages.push({
      path,
      file: `${path.slice(1)}/index.html`,
      title: PUBLIC_TITLE,
      ogTitle: `${project.name} | Ateliê Digital`,
      ogDescription: `Projeto demonstrativo. ${project.description}`,
    });
  }
  return pages.map(page => ({...page, url: new URL(page.path, PUBLIC_ORIGIN).href}));
}

export function publicDocumentFiles(projects = []) {
  return ['index.html', ...routeDocuments(projects).map(route => route.file)];
}

export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

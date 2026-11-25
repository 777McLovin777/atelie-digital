import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Menu, X} from 'lucide-react';
import PublicPage from '../src/components/PublicPage';
import {currentPublicPath, PUBLIC_PATHS, PUBLIC_TITLE, routeId} from '../src/data/publicUrls.js';
import '../src/styles.css';
import '../src/theme.css';
import '../src/responsive.css';
import {showcase} from './content.js';

const pages = [
  [PUBLIC_PATHS.projects, 'Projetos'],
  [PUBLIC_PATHS.studio, 'O estúdio'],
  [PUBLIC_PATHS.services, 'Serviços'],
  [PUBLIC_PATHS.contact, 'Contato'],
];
const currentRoute = () => currentPublicPath(location.pathname, location.hash);

function App() {
  const [route, setRoute] = useState(currentRoute);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const menuToggle = useRef(null);
  const detailId = route.startsWith(PUBLIC_PATHS.projectPrefix) ? routeId(route) || '__invalid_route__' : null;
  const detail = showcase.projects.find(project => project.id === detailId);
  const page = pages.find(([href]) => route === href);
  const known = route === PUBLIC_PATHS.home || page || detailId;
  const focusContent = () => document.getElementById('conteudo')?.focus({preventScroll:true});

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(currentRoute());
      setMenu(false);
    };
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    document.title = PUBLIC_TITLE;
    if (route !== PUBLIC_PATHS.home) {
      window.scrollTo({top:0, behavior:'instant'});
      focusContent();
    }
  }, [route, detail, detailId, page, known]);

  function closeMenu(event) {
    if (menu && event.key === 'Escape') {
      setMenu(false);
      menuToggle.current?.focus();
    }
  }

  return <div className="app">
    <a className="skip-link" href="#conteudo" onClick={event => { event.preventDefault(); document.getElementById('conteudo')?.focus(); }}>Pular para o conteúdo</a>
    <div className="landscape" aria-hidden="true"><div className="landscape-sun"/><div className="dune dune-back"/><div className="dune dune-front"/><div className="landscape-grain"/></div>
    <header className="topbar" onKeyDown={closeMenu}>
      <a className="wordmark" href={PUBLIC_PATHS.home} onClick={() => setMenu(false)}>{showcase.profile.brand}</a>
      <button ref={menuToggle} className="menu-toggle" type="button" aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(open => !open)}>
        {menu ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}
      </button>
      <nav id="navigation" aria-label="Navegação principal" className={menu ? 'nav open' : 'nav'}>
        {pages.map(([href, label]) => <a key={href} href={href}
          aria-current={route === href || (href === PUBLIC_PATHS.projects && detailId) ? 'page' : undefined}
          onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
    </header>
    {known ? <PublicPage key={route} data={showcase} {...{route, detailId, detail, filter, setFilter}}/> :
      <main id="conteudo" tabIndex={-1} className="simple-page">
        <h1>Página não encontrada.</h1><a className="pill dark" href={PUBLIC_PATHS.home}>Voltar à vitrine</a>
      </main>}
    <footer className="footer">
      <div><strong>{showcase.profile.brand}</strong></div>
      <div className="footer-right"><a href={PUBLIC_PATHS.contact}>Contato comercial</a></div>
      <span className="footer-bottom">© {new Date().getFullYear()} · {showcase.profile.brand}</span>
    </footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

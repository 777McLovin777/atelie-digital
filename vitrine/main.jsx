import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Menu, X} from 'lucide-react';
import PublicPage from '../src/components/PublicPage';
import {routeId} from '../src/data/publicUrls.js';
import '../src/styles.css';
import '../src/theme.css';
import '../src/responsive.css';
import {showcase} from './content.js';

const pages = [
  ['#/projetos', 'Projetos'],
  ['#/sobre', 'O estúdio'],
  ['#/servicos', 'Serviços'],
  ['#/contato', 'Contato'],
];
const currentRoute = () => location.hash || '#/';

function App() {
  const [route, setRoute] = useState(currentRoute);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const menuToggle = useRef(null);
  const detailId = route.startsWith('#/projeto/') ? routeId(route) || '__invalid_route__' : null;
  const detail = showcase.projects.find(project => project.id === detailId);
  const page = pages.find(([href]) => route === href);
  const known = route === '#/' || page || detailId;
  const focusContent = () => document.getElementById('conteudo')?.focus({preventScroll:true});

  useEffect(() => {
    const onHashChange = () => {
      setRoute(currentRoute());
      setMenu(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const title = detail?.name || (detailId ? 'Projeto não encontrado' : page?.[1]);
    document.title = `${title || (known ? 'Estúdio de soluções digitais' : 'Página não encontrada')} · Ateliê Digital`;
    if (location.hash) {
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
      <a className="wordmark" href="#/" onClick={() => setMenu(false)}>{showcase.profile.brand}<span className="mark" aria-hidden="true">✳</span></a>
      <button ref={menuToggle} className="menu-toggle" type="button" aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(open => !open)}>
        {menu ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}
      </button>
      <nav id="navigation" aria-label="Navegação principal" className={menu ? 'nav open' : 'nav'}>
        {pages.map(([href, label]) => <a key={href} href={href}
          aria-current={route === href || (href === '#/projetos' && detailId) ? 'page' : undefined}
          onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
    </header>
    {known ? <PublicPage key={route} data={showcase} {...{route, detailId, detail, filter, setFilter}}/> :
      <main id="conteudo" tabIndex={-1} className="simple-page">
        <h1>Página não encontrada.</h1><a className="pill dark" href="#/">Voltar à vitrine</a>
      </main>}
    <footer className="footer">
      <div><strong>{showcase.profile.brand} ✳</strong></div>
      <div className="footer-right"><a href="#/contato">Contato comercial</a></div>
      <span className="footer-bottom">© {new Date().getFullYear()} · {showcase.profile.brand}</span>
    </footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

import React from 'react';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { safeUrl } from '../data/publicUrls.js';
import { CONTACT_PENDING, quoteHref } from '../data/contact';
import { Services, ProjectGallery } from './Experience';
import { ProjectVisual, ProjectCard, isDemoProject } from './Project';
import CommercialHome from './CommercialHome';

function ProjectDetails({project}) {
  const link = safeUrl(project.link);
  return <main id="conteudo" tabIndex={-1} className="detail">
    <a className="back" href="#/projetos"><ArrowLeft size={17} aria-hidden="true" /> Voltar aos projetos</a>
    <span className="eyebrow">PROJETO / {project.year}</span>
    <h1>{project.name}</h1>
    <p className="detail-sub">{project.type}</p>
    {isDemoProject(project) && <p className="project-disclosure">Projeto demonstrativo</p>}
    <ProjectVisual project={project} large />
    <div className="detail-bottom">
      <div><h2>Sobre o projeto</h2><p>{project.description}</p></div>
      <div>
        {!!project.tags.length && <><span className="eyebrow">FERRAMENTAS E FOCO</span>
          <div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></>}
        {project.results && <div className="project-results">
          <span className="eyebrow">RESULTADOS E APRENDIZADOS</span><p>{project.results}</p>
        </div>}
        {link && <a className="pill dark detail-link" href={link} target="_blank" rel="noreferrer">Visitar projeto <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </div>
    </div>
    <ProjectGallery project={project} />
  </main>;
}

function ProjectCollection({projects, filter, setFilter}) {
  const categories = [...new Set(projects.map(project => project.category))];
  const visible = projects.filter(project => filter === 'Todos' || project.category === filter);
  return <main id="conteudo" tabIndex={-1} className="projects-page">
    <div className="section-title"><h1>Projetos do estúdio</h1><p>Explore os estudos, projetos e experiências do Ateliê Digital.</p></div>
    {!!categories.length && <div className="filters" role="group" aria-label="Filtrar projetos por categoria">
      {['Todos', ...categories].map(category => <button key={category} aria-pressed={filter === category}
        className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}
    </div>}
    <p className="collection-count" role="status">{visible.length} {visible.length === 1 ? 'projeto' : 'projetos'} · {filter}</p>
    {visible.length ? <div className="project-grid">{visible.map(project => <ProjectCard key={project.id} p={project} />)}</div>
      : <p className="project-grid">{projects.length ? 'Nenhum projeto nessa categoria.' : 'Os projetos publicados aparecerão aqui.'}</p>}
  </main>;
}

export default function PublicPage({detailId, detail, route, data, filter, setFilter}) {
  if (detailId) return detail ? <ProjectDetails project={detail} /> :
    <main id="conteudo" tabIndex={-1} className="missing"><h1>Projeto não encontrado.</h1><a className="pill dark" href="#/projetos">Ver projetos</a></main>;
  if (route === '#/projetos') return <ProjectCollection projects={data.projects} filter={filter} setFilter={setFilter} />;
  if (route === '#/servicos') return <main id="conteudo" tabIndex={-1} className="simple-page services-page">
    <Services services={data.services} email={data.profile.email} standalone />
  </main>;
  if (route === '#/sobre') return <main id="conteudo" tabIndex={-1} className="simple-page">
    <h1>O estúdio</h1><p>{data.profile.about}</p>
    <div className="statement">Design com intenção.<br />Código com personalidade.<br /><em>Ideias em movimento.</em></div>
    <a className="pill dark" href="#/servicos">Conheça nossas soluções <ArrowUpRight size={18} aria-hidden="true" /></a>
  </main>;
  if (route === '#/contato') {
    const contact = quoteHref(data.profile.email);
    return <main id="conteudo" tabIndex={-1} className="simple-page contact-page">
      <h1>{contact ? 'Solicite um orçamento' : 'Contato comercial'}</h1>
      {contact ? <>
        <p>Conte o que você quer criar ou melhorar. Um objetivo e um prazo aproximado já ajudam a começar.</p>
        <a className="pill dark contact-action" href={contact}>Solicitar orçamento <ArrowUpRight size={18} aria-hidden="true" /></a>
      </> : <div className="contact-pending">
          <p>{CONTACT_PENDING}</p>
          <div className="hero-actions">
            <a className="pill dark" href="#/servicos">Conheça nossas soluções <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="text-button" href="#/projetos">Explorar projetos <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>}
    </main>;
  }
  return <CommercialHome data={data} />;
}


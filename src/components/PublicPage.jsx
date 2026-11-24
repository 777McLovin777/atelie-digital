import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import leonardoPortrait from '../assets/people/leonardo-oliveira.webp';
import { PUBLIC_PATHS, safeUrl } from '../data/publicUrls.js';
import { CONTACT_PENDING, quoteHref, whatsappHref } from '../data/contact';
import { Services, ProjectGallery } from './Experience';
import { ProjectVisual, ProjectCard, isDemoProject } from './Project';
import CommercialHome from './CommercialHome';

function ProjectDetails({project}) {
  const link = safeUrl(project.link);
  return <main id="conteudo" tabIndex={-1} className="detail">
    <a className="back" href={PUBLIC_PATHS.projects}><ArrowLeft size={17} aria-hidden="true" /> Voltar aos projetos</a>
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
    <div className="section-title"><h1>Projetos do estúdio</h1><p>Explore exemplos demonstrativos de projetos e experiências digitais.</p></div>
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
    <main id="conteudo" tabIndex={-1} className="missing"><h1>Projeto não encontrado.</h1><a className="pill dark" href={PUBLIC_PATHS.projects}>Ver projetos</a></main>;
  if (route === PUBLIC_PATHS.projects) return <ProjectCollection projects={data.projects} filter={filter} setFilter={setFilter} />;
  if (route === PUBLIC_PATHS.services) return <main id="conteudo" tabIndex={-1} className="simple-page services-page">
    <Services services={data.services} email={data.profile.email} standalone />
  </main>;
  if (route === PUBLIC_PATHS.studio) return <main id="conteudo" tabIndex={-1} className="simple-page">
    <h1>O estúdio</h1><p>{data.profile.about}</p>
    <div className="statement">Design com intenção.<br />Código com personalidade.<br /><em>Ideias em movimento.</em></div>
    <a className="pill dark" href={PUBLIC_PATHS.services}>Conheça nossas soluções <ArrowUpRight size={18} aria-hidden="true" /></a>
  </main>;
  if (route === PUBLIC_PATHS.contact) {
    const emailContact = quoteHref(data.profile.email);
    const github = safeUrl(data.profile.github);
    const whatsapp = whatsappHref(data.profile.whatsapp);
    return <main id="conteudo" tabIndex={-1} className="simple-page contact-page">
      <div className="contact-layout">
        <section className="contact-info" aria-labelledby="contact-title">
          <h1 id="contact-title">Contato comercial</h1>
          <p>Escolha um canal para conversar sobre seu projeto.</p>
          <ul className="contact-channels" aria-label="Canais de contato">
            {emailContact && <li><a className="contact-channel" href={emailContact}>
              <span>E-mail</span><strong>{data.profile.email}</strong>
            </a></li>}
            {github && <li><a className="contact-channel" href={github} target="_blank" rel="noopener noreferrer">
              GitHub — Conheça meus projetos <ArrowUpRight size={18} aria-hidden="true" />
            </a></li>}
            {whatsapp && <li><a className="contact-channel whatsapp-channel" href={whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp — Conversar sobre um projeto <ArrowUpRight size={18} aria-hidden="true" />
            </a></li>}
          </ul>
          {!emailContact && !github && !whatsapp && <div className="contact-pending">
            <p>{CONTACT_PENDING}</p>
            <a className="text-button" href={PUBLIC_PATHS.services}>Conheça nossas soluções <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>}
        </section>
        <aside className="contact-profile" aria-labelledby="profile-title">
          <img className="contact-profile-photo" src={leonardoPortrait} alt="Retrato profissional de Leonardo Oliveira, usando óculos e barba." width="960" height="960" decoding="async" />
          <div className="contact-profile-card">
            <span className="contact-profile-brand"><span aria-hidden="true">✳</span> ATELIÊ DIGITAL</span>
            <h2 id="profile-title">Leonardo Oliveira</h2>
            <p>Desenvolvo sites, sistemas personalizados e automações que unem identidade visual, organização e praticidade.</p>
            <p>No Ateliê Digital, transformo ideias em experiências digitais claras e funcionais.</p>
          </div>
        </aside>
      </div>
    </main>;
  }
  return <CommercialHome data={data} />;
}


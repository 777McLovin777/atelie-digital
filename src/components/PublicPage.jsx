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
    <h1 className="operational-title">{project.icon && <img src={project.icon} width="48" height="48" alt="" aria-hidden="true" />}{project.name}</h1>
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

function OperationalCaseStudy({project}) {
  const study = project.caseStudy;
  return <main id="conteudo" tabIndex={-1} className="detail case-study operational-case-study">
    <a className="back" href={PUBLIC_PATHS.projects}><ArrowLeft size={17} aria-hidden="true" /> Voltar aos projetos</a>
    <span className="eyebrow">ESTUDO DE CASO</span>
    <h1>{project.name}</h1>
    <p className="case-study-intro">{project.description}</p>
    <p className="project-disclosure">Projeto demonstrativo · interfaces apresentadas sem validação operacional nesta vitrine</p>
    <ProjectVisual project={project} large />
    <div className="case-study-grid">
      <section className="case-study-card" aria-labelledby={`${project.id}-overview`}>
        <span className="eyebrow">VISÃO GERAL</span>
        <h2 id={`${project.id}-overview`}>Como é a ferramenta</h2>
        <p>{study.overview}</p>
      </section>
      <section className="case-study-card" aria-labelledby={`${project.id}-problem`}>
        <span className="eyebrow">PROBLEMA QUE RESOLVE</span>
        <h2 id={`${project.id}-problem`}>A proposta</h2>
        <p>{study.problem}</p>
      </section>
    </div>
    {study.steps && <section className="case-study-card operational-section" aria-labelledby={`${project.id}-steps`}>
      <span className="eyebrow">FLUXO DE TRABALHO</span>
      <h2 id={`${project.id}-steps`}>Como funciona</h2>
      <ol className="operational-list">{study.steps.map((step, index) => <li key={step}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{step}
      </li>)}</ol>
    </section>}
    {study.modules && <section className="case-study-card operational-section" aria-labelledby={`${project.id}-modules`}>
      <span className="eyebrow">MÓDULOS DISPONÍVEIS</span>
      <h2 id={`${project.id}-modules`}>Conversores</h2>
      <ul className="module-list">{study.modules.map(module => <li key={module}>{module}</li>)}</ul>
    </section>}
    <section className="case-study-card operational-section" aria-labelledby={`${project.id}-highlights`}>
      <span className="eyebrow">DESTAQUES</span>
      <h2 id={`${project.id}-highlights`}>Apoio à operação</h2>
      <ul className="operational-highlights">{study.highlights.map(item => <li key={item}>{item}</li>)}</ul>
    </section>
    <p className="operational-note">{study.notice} {study.validation}</p>
    <p className="authorization-note"><strong>Divulgação autorizada pelo proprietário:</strong> {study.ownershipDisclosure}</p>
    <ProjectGallery project={project} />
  </main>;
}

function PeDeMocaCaseStudy({project}) {
  const demoUrl = safeUrl(project.demoUrl);
  const repositoryUrl = safeUrl(project.repositoryUrl);
  return <main id="conteudo" tabIndex={-1} className="detail case-study">
    <a className="back" href={PUBLIC_PATHS.projects}><ArrowLeft size={17} aria-hidden="true" /> Voltar aos projetos</a>
    <span className="eyebrow">ESTUDO DE CASO / {project.year}</span>
    <h1>{project.name} — Plataforma digital para confeitaria artesanal</h1>
    <p className="case-study-intro">Aplicação web de delivery e presença digital que reúne identidade visual, catálogo de produtos e uma experiência orientada à preparação do pedido.</p>
    <ProjectVisual project={project} large />
    <div className="case-study-actions">
      {demoUrl && <a className="pill dark" href={demoUrl} target="_blank" rel="noopener noreferrer">Visualizar projeto <ArrowUpRight size={17} aria-hidden="true" /></a>}
      {repositoryUrl && <a className="pill outline" href={repositoryUrl} target="_blank" rel="noopener noreferrer">Repositório GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>}
    </div>
    <div className="case-study-grid">
      <section className="case-study-card" aria-labelledby="pdm-challenge">
        <span className="eyebrow">PROPOSTA</span>
        <h2 id="pdm-challenge">O desafio</h2>
        <p>Organizar a apresentação dos produtos e facilitar a navegação entre a descoberta dos doces e a preparação de um pedido.</p>
      </section>
      <section className="case-study-card" aria-labelledby="pdm-solution">
        <span className="eyebrow">INTERFACE</span>
        <h2 id="pdm-solution">A solução apresentada</h2>
        <ul>
          <li>Identidade visual própria e páginas adaptadas a desktop e celular.</li>
          <li>Catálogo por categorias, com imagens, descrições e preços.</li>
          <li>Carrinho com quantidades e opção de adicional visível na captura.</li>
          <li>Telas de acesso e criação de conta.</li>
        </ul>
      </section>
    </div>
    <section className="case-study-status" aria-labelledby="pdm-status">
      <div><span className="eyebrow">ESTÁGIO</span><h2 id="pdm-status">Demonstração e homologação</h2></div>
      <p>As imagens registram interfaces do projeto. A demonstração pública pode ser explorada, mas autenticação, operação do pedido e integrações de pagamento, incluindo PIX, não são apresentadas aqui como homologadas ou em produção.</p>
    </section>
    <section className="case-study-tools" aria-label="Tecnologias confirmadas">
      <span className="eyebrow">TECNOLOGIAS CONFIRMADAS NO REPOSITÓRIO</span>
      <div className="tags"><span>React</span><span>Vite</span></div>
    </section>
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
  if (detailId) return detail ? detail.id === 'pe-de-moca' ? <PeDeMocaCaseStudy project={detail} /> : detail.caseStudy ? <OperationalCaseStudy project={detail} /> : <ProjectDetails project={detail} /> :
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
            {emailContact && <li><a className="contact-channel" href={emailContact} aria-label="Enviar e-mail para solicitar orçamento">
              <span className="contact-channel-label"><img src="/assets/gmail.svg" width="22" height="22" alt="" aria-hidden="true" />E-mail</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a></li>}
            {github && <li><a className="contact-channel" href={github} target="_blank" rel="noopener noreferrer">
              <span className="contact-channel-label"><img src="/assets/github.svg" width="22" height="22" alt="" aria-hidden="true" />GitHub — Conheça meus projetos</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a></li>}
            {whatsapp && <li><a className="contact-channel whatsapp-channel" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <span className="contact-channel-label"><img src="/assets/whatsapp.svg" width="22" height="22" alt="" aria-hidden="true" />WhatsApp — Conversar sobre um projeto</span>
              <ArrowUpRight size={18} aria-hidden="true" />
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
            <span className="contact-profile-brand">ATELIÊ DIGITAL</span>
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


import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DEFAULT_PROFILE_COPY } from '../data/profileCopy.js';
import { CONTACT_PENDING, quoteHref } from '../data/contact';
import { Services } from './Experience';
import { ProjectCard } from './Project';
import './commercial-home.css';

const processSteps = [
  ['Descoberta', 'Entendemos o negócio, as necessidades e os objetivos.'],
  ['Planejamento', 'Estruturamos a solução e definimos a experiência.'],
  ['Desenvolvimento', 'Transformamos o planejamento em um produto funcional.'],
  ['Refinamento e entrega', 'Testamos, ajustamos e preparamos o resultado para utilização.']
];

export default function CommercialHome({ data }) {
  const { profile, projects, services } = data;
  const headline = profile.headline && profile.headline !== DEFAULT_PROFILE_COPY.headline
    ? profile.headline : 'Boas ideias merecem experiências extraordinárias.';
  const description = profile.description && profile.description !== DEFAULT_PROFILE_COPY.description
    ? profile.description : '';
  const featured = projects.filter(project => project.featured);
  const selected = [...featured, ...projects.filter(project => !project.featured)].slice(0, 2);
  const contact = quoteHref(profile.email);

  return <main id="conteudo" tabIndex={-1} className="commercial-home">
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <span className="eyebrow"><span className="live-dot" />{profile.eyebrow || 'ESTÚDIO CRIATIVO E TECNOLÓGICO'}</span>
        <h1 id="home-title">{headline}</h1>
        <p className="hero-offer">Sites, sistemas e automações para transformar ideias em soluções digitais.</p>
        {description && <p>{description}</p>}
        <div className="hero-actions">
          <a className="pill dark" href={contact || '#/servicos'}>
            {contact ? 'Solicitar orçamento' : 'Conheça nossas soluções'} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="text-button" href="#/projetos">Explorar projetos <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-glass"><strong>Entre a ideia<br />e o extraordinário.</strong></div>
        <div className="sun" /><div className="arch arch-one" /><div className="arch arch-two" />
        <div className="art-star">✳</div>
      </div>
    </section>
    <Services services={services} email={profile.email} />
    <section className="featured" aria-labelledby="selected-title">
      <div className="section-top">
        <div><h2 id="selected-title">Projetos selecionados</h2><p>Veja como aplicamos design e tecnologia em diferentes tipos de solução.</p></div>
        <a className="text-button" href="#/projetos">Ver o acervo inteiro <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      {selected.length ? <div className="featured-grid">
        {selected.map(project => <ProjectCard p={project} key={project.id} />)}
      </div> : <p>Os projetos publicados aparecerão aqui.</p>}
    </section>
    <section className="home-process" aria-labelledby="process-title">
      <h2 id="process-title">Nosso processo de trabalho</h2>
      <ol>{processSteps.map(([title, detail], index) => <li key={title}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h3>{title}</h3><p>{detail}</p>
      </li>)}</ol>
    </section>
    <section className="studio-section" aria-labelledby="studio-title">
      <div>
        <h2 id="studio-title">Sobre o estúdio</h2>
        <p>Unimos criatividade e tecnologia para desenvolver experiências digitais pensadas para pessoas reais.</p>
        {profile.about && <p>{profile.about}</p>}
        <a className="text-button" href="#/sobre">Conheça o estúdio <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      {profile.availability && <div className="studio-note"><span className="live-dot" />{profile.availability}</div>}
    </section>
    <section className="big-cta" aria-labelledby="quote-title">
      <h2 id="quote-title">Vamos transformar sua ideia em realidade?</h2>
      {contact ? <p>Conte o que você precisa. Vamos conversar sobre as possibilidades e encontrar um caminho para o seu projeto.</p>
        : <p className="quote-pending">{CONTACT_PENDING}</p>}
      <a className="pill pale" href={contact || '#/servicos'}>
        {contact ? 'Solicitar orçamento' : 'Conheça nossas soluções'} <ArrowUpRight size={19} aria-hidden="true" />
      </a>
      <span className="cta-star" aria-hidden="true">✳</span>
    </section>
  </main>;
}

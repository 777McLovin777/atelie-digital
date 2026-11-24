import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DEFAULT_PROFILE_COPY } from '../data/profileCopy.js';
import { quoteHref } from '../data/contact';
import { PUBLIC_PATHS } from '../data/publicUrls.js';
import { ProjectCard } from './Project';
import './commercial-home.css';

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
          <a className="pill dark" href={contact || PUBLIC_PATHS.services}>
            {contact ? 'Solicitar orçamento' : 'Conheça nossas soluções'} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="text-button" href={PUBLIC_PATHS.projects}>Explorar projetos <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <p className="home-intro">Um estúdio independente que combina design e desenvolvimento para negócios, profissionais e criadores.</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-glass"><strong>Entre a ideia<br />e o extraordinário.</strong></div>
        <div className="sun" /><div className="arch arch-one" /><div className="arch arch-two" />
        <div className="art-star">✳</div>
      </div>
    </section>
    <section className="home-services" aria-labelledby="home-services-title">
      <div className="section-top">
        <h2 id="home-services-title">Nossas soluções</h2>
        <a className="text-button" href={PUBLIC_PATHS.services}>Ver serviços <ArrowRight size={17} aria-hidden="true" /></a>
      </div>
      <ul className="service-summary">{services.map((service, index) => <li key={service.id}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{service.title}</strong>
      </li>)}</ul>
    </section>
    <section className="featured" aria-labelledby="selected-title">
      <div className="section-top">
        <div><h2 id="selected-title">Projetos selecionados</h2><p>Dois exemplos demonstrativos de design e tecnologia.</p></div>
        <a className="text-button" href={PUBLIC_PATHS.projects}>Ver todos os projetos <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      {selected.length ? <div className="featured-grid">
        {selected.map(project => <ProjectCard p={project} key={project.id} />)}
      </div> : <p>Os projetos publicados aparecerão aqui.</p>}
    </section>
    <section className="big-cta" aria-labelledby="quote-title">
      <h2 id="quote-title">Vamos transformar sua ideia em realidade?</h2>
      <p>Escolha o canal que preferir para conversar sobre seu projeto.</p>
      <a className="pill pale" href={PUBLIC_PATHS.contact}>
        Ver canais de contato <ArrowUpRight size={19} aria-hidden="true" />
      </a>
      <span className="cta-star" aria-hidden="true">✳</span>
    </section>
  </main>;
}

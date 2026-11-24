import React from 'react';
import { ArrowUpRight, Layers3, Compass, Workflow, PanelsTopLeft, Sparkles } from 'lucide-react';
import { DEFAULT_SERVICES, SERVICE_DETAILS } from '../data/content';
import { CONTACT_PENDING, quoteHref } from '../data/contact';
import {PublicAsset} from './AssetUrlContext';
const serviceIcons = {development:PanelsTopLeft, systems:Layers3, automation:Workflow, interfaces:Sparkles};

export function Services({services=[], email, standalone=false}) {
  const Heading = standalone ? 'h1' : 'h2';
  const CardHeading = standalone ? 'h2' : 'h3';
  return <section className="services" aria-labelledby="services-title">
    <div className="section-top"><Heading id="services-title">{standalone ? 'Soluções digitais para o seu projeto' : 'Nossas soluções'}</Heading></div>
    <div className="service-grid">{services.map(service => {
      const standard = DEFAULT_SERVICES.some(item => item.id === service.id && item.title === service.title);
      const details = standard ? SERVICE_DETAILS[service.id] : undefined;
      const Icon = standard ? serviceIcons[service.id] : Compass;
      const contact = quoteHref(email, service.title);
      return <article className="service-card" key={service.id}>
        <div><Icon size={24} aria-hidden="true" /></div>
        <CardHeading className="service-title">{service.title}</CardHeading>
        {service.description && <p>{service.description}</p>}
        {details && <>
          <p className="service-benefit">{details.benefit}</p>
          <p className="service-examples"><strong>Exemplos</strong><br />{details.examples}</p>
        </>}
        {contact && <a className="text-button service-contact" href={contact}
          aria-label={`Solicitar orçamento para ${service.title}`}>Solicitar orçamento <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </article>;
    })}</div>
    {!services.length && <p>As soluções publicadas aparecerão aqui.</p>}
    {standalone && !quoteHref(email) && <div className="service-availability">
      <p>{CONTACT_PENDING}</p>
      <a className="text-button" href="#/projetos">Explorar projetos <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>}
  </section>;
}
export function ProjectGallery({
  project
}) {
  const images = (project.gallery || []).filter(Boolean);
  if (!images.length) return null;
  return <section className="project-gallery" aria-label="Galeria do projeto"><h2>Outros pontos de vista.</h2><div>{images.map((source,i)=><GalleryImage key={source+i} {...{source,project,i}}/>)}</div></section>;
}
function GalleryImage({source,project,i}) {
  return <PublicAsset source={source}>{url=><figure>
    <div className="gallery-media">
      {url ? <img src={url} loading="lazy" decoding="async" alt={`${project.name} — imagem ${i+1}`} />
        : <p className="asset-placeholder">Imagem indisponível</p>}
    </div>
    <figcaption>Imagem {i+1} · {project.name}</figcaption>
  </figure>}</PublicAsset>;
}

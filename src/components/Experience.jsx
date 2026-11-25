import React, {useEffect, useRef, useState} from 'react';
import { ArrowUpRight, Layers3, Compass, Workflow, PanelsTopLeft } from 'lucide-react';
import { DEFAULT_SERVICES, SERVICE_DETAILS } from '../data/content';
import { CONTACT_PENDING, quoteHref } from '../data/contact';
import { PUBLIC_PATHS } from '../data/publicUrls.js';
const serviceIcons = {development:PanelsTopLeft, systems:Layers3, automation:Workflow, interfaces:Compass};

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
      <a className="text-button" href={PUBLIC_PATHS.projects}>Explorar projetos <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>}
  </section>;
}
export function ProjectGallery({
  project
}) {
  const images = (project.gallery || []).filter(Boolean);
  if (!images.length) return null;
  return <ProjectGalleryView images={images} project={project} />;
}

function ProjectGalleryView({images, project}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeIndex === null || !dialog) return;
    if (!dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [activeIndex]);

  function closePreview() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function moveImage(delta) {
    setActiveIndex(index => (index + delta + images.length) % images.length);
  }

  function handleDialogKeyDown(event) {
    if (event.key === 'ArrowRight') { event.preventDefault(); moveImage(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveImage(-1); }
  }

  function handleDialogClose() {
    setActiveIndex(null);
    triggerRef.current?.focus({preventScroll:true});
  }

  return <section className="project-gallery" aria-labelledby="project-gallery-title">
    <div className="project-gallery-heading">
      <div><span className="eyebrow">INTERFACES</span><h2 id="project-gallery-title">Galeria de telas</h2></div>
      <p>Capturas do projeto em diferentes páginas e tamanhos de tela. Selecione uma imagem para ampliar.</p>
    </div>
    <div className="project-gallery-grid">{images.map((image, index) => <figure className={image.portrait ? 'portrait-capture' : ''} key={image.src}>
      <button className="gallery-image-button" type="button" aria-label={`Ampliar imagem ${index + 1}: ${image.caption}`}
        onClick={event => { triggerRef.current = event.currentTarget; setActiveIndex(index); }}>
        <span className="gallery-media"><img src={image.src} width={image.width} height={image.height} loading="lazy" decoding="async" alt={image.alt} /></span>
      </button>
      <figcaption><span>{image.caption}</span><span className="gallery-enlarge-hint">Ampliar</span></figcaption>
    </figure>)}</div>
    <dialog ref={dialogRef} className="project-image-dialog" aria-label={`Visualização de imagens do projeto ${project.name}`}
      onClose={handleDialogClose} onKeyDown={handleDialogKeyDown}>
      {activeImage && <div className="project-image-preview">
        <div className="project-image-toolbar">
          <p aria-live="polite">{activeImage.caption} · {activeIndex + 1} de {images.length}</p>
          <button ref={closeRef} type="button" className="gallery-close" onClick={closePreview} aria-label="Fechar imagem ampliada">Fechar <span aria-hidden="true">×</span></button>
        </div>
        <div className="project-image-stage">
          <button type="button" className="gallery-step" onClick={() => moveImage(-1)} aria-label="Imagem anterior">‹</button>
          <img src={activeImage.src} width={activeImage.width} height={activeImage.height} alt={activeImage.alt} decoding="async" />
          <button type="button" className="gallery-step" onClick={() => moveImage(1)} aria-label="Próxima imagem">›</button>
        </div>
        <p className="project-image-caption">Use as setas do teclado para navegar pelas imagens. Pressione Escape para fechar.</p>
      </div>}
    </dialog>
  </section>;
}

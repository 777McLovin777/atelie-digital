import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {isDemoProject} from '../data/demoProjects.js';
import {projectPath} from '../data/publicUrls.js';
export {isDemoProject} from '../data/demoProjects.js';
import {PublicAsset} from './AssetUrlContext';

export function ProjectVisual({
  project: p,
  large = false
}) {
  return <PublicAsset source={p.image}>{url=>url ? <div className={'project-visual '+p.tone+(large?' visual-large':'')}><img className="project-cover" src={url} alt={'Capa de '+p.name} loading={large?'eager':'lazy'} decoding="async"/><span className="visual-corner">↗ / {p.year}</span></div> :
    <div aria-hidden="true" className={'project-visual project-visual-fallback ' + p.tone + (large ? ' visual-large' : '')}>
    <div className="visual-orbit" /><div className="visual-square" />
    <span className="visual-word">{p.name}</span><span className="visual-corner">↗ / {p.year}</span>
  </div>}</PublicAsset>;
}
export function ProjectCard({p}) {
  return <a className="project-card" href={projectPath(p.id)}>
    <ProjectVisual project={p} />
    <div className="project-meta">
      <div><span className="eyebrow">{p.category}</span>
        <h3>{p.name}<ArrowUpRight size={25} aria-hidden="true" /></h3>
        <p>{p.type}</p>
        {isDemoProject(p) && <p className="project-disclosure">Projeto demonstrativo</p>}
      </div>
      <span className="year">{p.year}</span>
    </div>
  </a>;
}

import {DEFAULT_SERVICES} from '../src/data/content.js';
import {DEMO_PROJECTS} from '../src/data/demoProjects.js';

export const showcase = {
  profile: {
    brand: 'ATELIÊ / DIGITAL',
    eyebrow: 'ESTÚDIO INDEPENDENTE • BRASIL',
    about: 'Unimos design e desenvolvimento para criar sites, sistemas e automações para negócios, profissionais e criadores.',
    email: '',
  },
  projects: DEMO_PROJECTS.map(project => ({...project, gallery: []})),
  services: DEFAULT_SERVICES,
};

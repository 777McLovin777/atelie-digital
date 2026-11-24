import {DEFAULT_SERVICES} from '../src/data/content.js';
import {DEMO_PROJECTS} from '../src/data/demoProjects.js';

export const showcase = {
  profile: {
    brand: 'ATELIÊ / DIGITAL',
    eyebrow: 'ESTÚDIO INDEPENDENTE • BRASIL',
    about: 'Unimos design e desenvolvimento para criar sites, sistemas e automações para negócios, profissionais e criadores.',
    email: 'leo.ateliedigital@gmail.com',
    github: 'https://github.com/777McLovin777',
    whatsapp: '5511910513097',
  },
  projects: DEMO_PROJECTS.map(project => ({...project, gallery: []})),
  services: DEFAULT_SERVICES,
};

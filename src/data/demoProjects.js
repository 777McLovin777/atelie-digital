export const DEMO_PROJECTS=[{id:'pe-de-moca',name:'Pé de Moça',type:'E-commerce • Identidade digital',year:'2026',category:'Web',description:'Uma doceria com personalidade: catálogo interativo, experiência de compra e um universo visual feito para dar água na boca.',tags:['React','Vite','UI/UX'],link:'',image:'',tone:'peach',featured:true},{id:'laboratorio',name:'Laboratório Criativo',type:'Experimentos • Interação',year:'2026',category:'Experimento',description:'Uma coleção de pequenos testes visuais, protótipos e interfaces para explorar possibilidades.',tags:['Interação','Motion','Frontend'],link:'',image:'',tone:'rust',featured:false}];

export function isDemoProject(project) {
  return DEMO_PROJECTS.some(sample => sample.id === project.id && sample.name === project.name);
}

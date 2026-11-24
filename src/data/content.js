export const DEFAULT_SERVICES=[
  {id:'development',title:'Sites e Landing Pages',description:'Páginas para apresentar seu negócio, produto ou campanha no celular e no computador.',published:true},
  {id:'systems',title:'Sistemas Personalizados',description:'Ferramentas sob medida para acompanhar pedidos e organizar informações.',published:true},
  {id:'automation',title:'Automações Inteligentes',description:'Integrações entre ferramentas para automatizar tarefas do dia a dia.',published:true},
  {id:'interfaces',title:'Experiências Criativas',description:'Portfólios e páginas interativas para apresentar seu trabalho.',published:true}
];
export const SERVICE_DETAILS={
  development:{benefit:'Facilite o primeiro contato com seu público.',examples:'Site institucional, página de campanha'},
  systems:{benefit:'Centralize informações e simplifique o trabalho diário.',examples:'Painel de pedidos, cadastro interno'},
  automation:{benefit:'Libere tempo em rotinas que se repetem.',examples:'Alertas de prazo, sincronização de registros'},
  interfaces:{benefit:'Convide o público a explorar suas ideias.',examples:'Portfólio interativo, protótipo navegável'}
};
export function withEditorial(data){return {...data,published:data.published!==false,
  projects:data.projects.map(p=>({...p,status:p.status||'published'})),
  services:data.services||structuredClone(DEFAULT_SERVICES),
  categories:data.categories||[...new Set(data.projects.map(p=>p.category))].map(name=>({name,published:true}))};}

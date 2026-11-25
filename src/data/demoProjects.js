const peDeMocaGallery = [
  {src:'/assets/projects/pe-de-moca/home-desktop.webp', alt:'Página inicial do Pé de Moça em uma captura desktop, com apresentação da confeitaria e destaques de produtos.', caption:'Página inicial · captura desktop', width:1916, height:867},
  {src:'/assets/projects/pe-de-moca/home-mobile.webp', alt:'Captura longa da página inicial do Pé de Moça em formato mobile, incluindo destaques e recomendações de produtos.', caption:'Página inicial · captura mobile', width:810, height:12771, portrait:true},
  {src:'/assets/projects/pe-de-moca/catalog-capture.webp', alt:'Captura da seção de cardápio do Pé de Moça com produtos, categorias e preços.', caption:'Cardápio · captura disponibilizada', width:355, height:870, portrait:true},
  {src:'/assets/projects/pe-de-moca/catalog-mobile.webp', alt:'Captura longa do cardápio do Pé de Moça em formato mobile, com produtos organizados por categorias.', caption:'Cardápio · captura mobile', width:810, height:9319, portrait:true},
  {src:'/assets/projects/pe-de-moca/cart-desktop.webp', alt:'Tela de carrinho do Pé de Moça mostrando itens, quantidades e um adicional selecionado.', caption:'Carrinho · captura desktop', width:1432, height:852},
  {src:'/assets/projects/pe-de-moca/account-desktop.webp', alt:'Tela de acesso e criação de conta do Pé de Moça, sem sessão autenticada.', caption:'Minha Conta · captura desktop', width:1697, height:877},
  {src:'/assets/projects/pe-de-moca/account-mobile.webp', alt:'Tela de acesso e criação de conta do Pé de Moça em formato mobile, sem sessão autenticada.', caption:'Minha Conta · captura mobile', width:810, height:1800, portrait:true},
];

export const DEMO_PROJECTS = [
  {
    id:'pe-de-moca', name:'Pé de Moça', type:'Plataforma digital para confeitaria artesanal', year:'2026', category:'Web',
    description:'Aplicação web de delivery e presença digital que reúne identidade visual, catálogo de produtos e uma experiência orientada à preparação do pedido.',
    tags:['React','Vite'], link:'', demoUrl:'https://delivery-pedemoca.pages.dev/', repositoryUrl:'https://github.com/777McLovin777/delivery-pedemoca',
    image:'/assets/projects/pe-de-moca/catalog-mobile.webp', gallery:peDeMocaGallery, tone:'peach', featured:true,
  },
  {
    id:'laboratorio', name:'Laboratório Criativo', type:'Experimentos • Interação', year:'2026', category:'Experimento',
    description:'Uma coleção de pequenos testes visuais, protótipos e interfaces para explorar possibilidades.',
    tags:['Interação','Motion','Frontend'], link:'', image:'', gallery:[], tone:'rust', featured:false,
  },
];

export function isDemoProject(project) {
  return DEMO_PROJECTS.some(sample => sample.id === project.id && sample.name === project.name);
}

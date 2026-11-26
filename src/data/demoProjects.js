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
  {
    id:'conciliacnes', name:'ConciliaCNES', type:'Automação local • Desktop', year:'', category:'Automação',
    description:'Aplicativo local para conferência RH × CNES com geração de relatório Excel.',
    tags:['Desktop','Processamento local','Excel'], link:'', image:'/assets/projects/conciliacnes/files-step.webp', icon:'/assets/projects/conciliacnes/icon.webp', tone:'teal', featured:false,
    gallery:[
      {src:'/assets/projects/conciliacnes/files-step.webp', alt:'Tela inicial do ConciliaCNES na etapa para carregar os arquivos de entrada.', caption:'Etapa 1 · Carregar arquivos', width:1440, height:857},
      {src:'/assets/projects/conciliacnes/establishments-step.webp', alt:'Tela demonstrativa de seleção de estabelecimentos no ConciliaCNES.', caption:'Etapa 2 · Selecionar estabelecimentos', width:1439, height:861},
      {src:'/assets/projects/conciliacnes/excel-report-step.webp', alt:'Tela demonstrativa para gerar relatório Excel no ConciliaCNES.', caption:'Etapa 3 · Gerar relatório Excel', width:1438, height:858},
    ],
    caseStudy:{
      overview:'Aplicação desktop/local para comparar informações de um PDF do CNES e uma planilha RH, com seleção de estabelecimentos e proposta de relatório Excel de inconsistências.',
      problem:'A conferência entre as informações de RH e CNES pode exigir comparação manual e tornar mais difícil localizar divergências.',
      steps:['Carregar o PDF do CNES e a planilha RH.','Selecionar os estabelecimentos que serão conferidos.','Gerar um relatório Excel com as inconsistências identificadas.'],
      highlights:['Uso local e offline.','Foco na conferência de informações.','Relatório estruturado em Excel.','Apoio às rotinas operacionais.'],
      notice:'O processamento é local. Os arquivos selecionados não são enviados à nuvem.',
      validation:'Este estudo apresenta capturas das etapas. A execução ponta a ponta com arquivos reais não foi validada nesta vitrine.',
      ownershipDisclosure:'Aplicativo autoral e interface divulgados com autorização do proprietário. Sem vínculo ou endosso institucional do Ministério da Saúde, de Secretarias de Saúde, do CNES ou do e-SUS.',
    },
  },
  {
    id:'conversores-sus', name:'Conversores SUS', type:'Automação local • Desktop', year:'', category:'Automação',
    description:'Central desktop local demonstrativa que reúne quatro módulos de conversão apresentados nas capturas.',
    tags:['Desktop','Processamento local','Conversão de arquivos'], link:'', image:'/assets/projects/conversores-sus/home-portfolio.webp', icon:'/assets/projects/conversores-sus/icon.webp', tone:'orange', featured:false,
    gallery:[
      {src:'/assets/projects/conversores-sus/home-portfolio.webp', alt:'Tela inicial demonstrativa da central de módulos Conversores SUS com identificação visual adaptada.', caption:'Central de módulos · identificação visual adaptada', width:1440, height:856},
      {src:'/assets/projects/conversores-sus/apac-paciente-portfolio.webp', alt:'Formulário vazio da etapa de dados do paciente no módulo APAC Magnético; identificação visual adaptada.', caption:'APAC Magnético · Dados do paciente · identificação visual adaptada', width:1440, height:858},
      {src:'/assets/projects/conversores-sus/apac-procedimentos-portfolio.webp', alt:'Tela demonstrativa de procedimentos no módulo APAC Magnético; identificação visual adaptada.', caption:'APAC Magnético · Procedimentos · identificação visual adaptada', width:1440, height:846},
      {src:'/assets/projects/conversores-sus/biomega-bpac-portfolio.webp', alt:'Tela demonstrativa do conversor local Biomega PDF para BPA-C; identificação visual adaptada.', caption:'Biomega · Conversão PDF para BPA-C · identificação visual adaptada', width:1440, height:857},
      {src:'/assets/projects/conversores-sus/visa-bpac-portfolio.webp', alt:'Tela demonstrativa do conversor local VISA Word para BPA-C; identificação visual adaptada.', caption:'VISA · Conversão Word para BPA-C · identificação visual adaptada', width:1440, height:858},
      {src:'/assets/projects/conversores-sus/samu-bpac-portfolio.webp', alt:'Tela demonstrativa do conversor local SAMU Excel para BPA-C; identificação visual adaptada.', caption:'SAMU · Conversão Excel para BPA-C · identificação visual adaptada', width:1440, height:858},
    ],
    caseStudy:{
      overview:'Hub desktop local com quatro módulos apresentados para conversões de arquivos usadas em rotinas operacionais.',
      problem:'Rotinas de conversão em formatos distintos podem demandar etapas repetidas e ferramentas separadas.',
      modules:['APAC Magnético','Biomega PDF → BPA-C','VISA Word → BPA-C','SAMU Excel → BPA-C'],
      highlights:['Quatro módulos em uma central desktop.','Processamento local e offline.','Foco em produtividade operacional.','Apoio à padronização das rotinas.'],
      notice:'Ferramenta de uso local/offline; não depende de envio de arquivos à nuvem.',
      validation:'Este estudo apresenta capturas das interfaces. A execução dos módulos e as conversões com arquivos reais não foram validadas nesta vitrine. Nas cópias editoriais, somente o emblema gráfico do cabeçalho foi ocultado; formulários, textos, valores e resultados visíveis foram preservados.',
      ownershipDisclosure:'Aplicativo e capturas autorais divulgados com autorização do proprietário. Não é produto oficial do SUS, do Ministério da Saúde ou de Secretaria de Saúde e não possui endosso institucional.',
    },
  },
];

export function isDemoProject(project) {
  return DEMO_PROJECTS.some(sample => sample.id === project.id && sample.name === project.name);
}

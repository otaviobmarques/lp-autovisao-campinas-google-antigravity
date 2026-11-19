export interface CampinasUnit {
  id: string;
  num: string;
  name: string;
  shortName: string;
  neighborhood: string;
  detran: string;
  cnpj: string;
  address: string;
  reference: string;
  hoursWeek: string;
  hoursSat: string;
  satCloseHour: number;
  isSaturdayDuty?: boolean;
  phoneDisplay: string;
  phoneTel: string;
  whatsappDisplay: string;
  whatsappMsg: string;
  photo: string;
  mapsUrl: string;
  wazeUrl: string;
}

export interface VistoriaService {
  id: string;
  slug: string;
  aliases: string[];
  title: string;
  shortTitle: string;
  kicker: string;
  badge: string;
  badgeVariant?: 'red' | 'dark' | 'green';
  category: ('destaque' | 'comprar' | 'transferir' | 'avancada' | 'pesados' | 'empresas')[];
  featured?: boolean;
  isPJOnly?: boolean;
  heroTheme: 'red' | 'dark';
  icon: string;
  headlineLight: string;
  headlineBold: string;
  summary: string;
  salesCopy: string;
  idealFor: string;
  checklist: string[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
  timeEstimate: string;
  whatsappMsg: string;
}

export const WA_NUMBER = '5519992248383';
export const WA_DISPLAY = '(19) 99224-8383';
export const CENTRAL_DISPLAY = '(19) 3271-1700';
export const CENTRAL_TEL = '+551932711700';

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

export const CAMPINAS_UNITS: CampinasUnit[] = [
  {
    id: 'ponte-preta',
    num: 'Loja 3 · Plantão Sábado até 16h',
    name: 'Campinas · Ponte Preta (Abolição)',
    shortName: 'Ponte Preta / Abolição',
    neighborhood: 'Ponte Preta',
    detran: 'DETRAN-SP nº 9072',
    cnpj: '58.555.299/0001-20',
    address: 'Rua da Abolição, 2036 – Ponte Preta, Campinas/SP',
    reference: 'Em frente ao Extra Abolição.',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 16h (Unidade de Plantão)',
    satCloseHour: 16,
    isSaturdayDuty: true,
    phoneDisplay: '(19) 3271-1700',
    phoneTel: '+551932711700',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria na Unidade Ponte Preta / Abolição.',
    photo: '/assets/img/loja-campinas-ponte-preta.webp',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+da+Aboli%C3%A7%C3%A3o%2C+2036+%E2%80%93+Ponte+Preta%2C+Campinas%2FSP',
    wazeUrl:
      'https://waze.com/ul?q=Rua+da+Aboli%C3%A7%C3%A3o%2C+2036+%E2%80%93+Ponte+Preta%2C+Campinas%2FSP&navigate=yes',
  },
  {
    id: 'taquaral',
    num: 'Loja 1 · Taquaral',
    name: 'Campinas · Taquaral',
    shortName: 'Taquaral',
    neighborhood: 'Taquaral',
    detran: 'DETRAN-SP nº 9422',
    cnpj: '58.556.175/0001-60',
    address: 'Av. Imperatriz Leopoldina, 38 – Taquaral, Campinas/SP',
    reference:
      'Próximo ao Balão do Taquaral, subindo a Av. Imperatriz, logo após a Bono Pneus e Igreja N. Sra. das Graças.',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 12h',
    satCloseHour: 12,
    phoneDisplay: '(19) 3271-1700',
    phoneTel: '+551932711700',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria na Unidade Taquaral.',
    photo: '/assets/img/loja-campinas-taquaral.webp',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Av.+Imperatriz+Leopoldina%2C+38+%E2%80%93+Taquaral%2C+Campinas%2FSP',
    wazeUrl:
      'https://waze.com/ul?q=Av.+Imperatriz+Leopoldina%2C+38+%E2%80%93+Taquaral%2C+Campinas%2FSP&navigate=yes',
  },
  {
    id: 'centro',
    num: 'Loja 2 · Centro / Castelo',
    name: 'Campinas · Centro (Castelo)',
    shortName: 'Centro / Castelo',
    neighborhood: 'Centro',
    detran: 'DETRAN-SP nº 9078',
    cnpj: '58.544.979/0001-49',
    address: 'Av. Andrade Neves, 1160 – Centro, Campinas/SP',
    reference: 'Subindo o Castelo, em frente à Discamp (Atacado de Doces).',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 12h',
    satCloseHour: 12,
    phoneDisplay: '(19) 3271-1700',
    phoneTel: '+551932711700',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria na Unidade Centro (Av. Andrade Neves).',
    photo: '/assets/img/loja-campinas-centro.webp',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Av.+Andrade+Neves%2C+1160+%E2%80%93+Centro%2C+Campinas%2FSP',
    wazeUrl:
      'https://waze.com/ul?q=Av.+Andrade+Neves%2C+1160+%E2%80%93+Centro%2C+Campinas%2FSP&navigate=yes',
  },
  {
    id: 'campos-eliseos',
    num: 'Loja 4 · Campos Elíseos',
    name: 'Campinas · Campos Elíseos',
    shortName: 'Campos Elíseos',
    neighborhood: 'Jardim Novo Campos Elíseos',
    detran: 'DETRAN-SP nº 9417',
    cnpj: '58.546.595/0001-65',
    address: 'Rua Domício Pacheco e Silva, 318 – Jd. Novo Campos Elíseos, Campinas/SP',
    reference: 'Em frente à Loja TOP Mais Veículos.',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 12h',
    satCloseHour: 12,
    phoneDisplay: '(19) 3271-1700',
    phoneTel: '+551932711700',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria na Unidade Campos Elíseos.',
    photo: '/assets/img/loja-campinas-campos-eliseos.webp',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+Dom%C3%ADcio+Pacheco+e+Silva%2C+318+%E2%80%93+Jd.+Novo+Campos+El%C3%ADseos%2C+Campinas%2FSP',
    wazeUrl:
      'https://waze.com/ul?q=Rua+Dom%C3%ADcio+Pacheco+e+Silva%2C+318+%E2%80%93+Jd.+Novo+Campos+El%C3%ADseos%2C+Campinas%2FSP&navigate=yes',
  },
  {
    id: 'parque-industrial',
    num: 'Loja 5 · Parque Industrial',
    name: 'Campinas · Parque Industrial (Amoreiras)',
    shortName: 'Parque Industrial / Amoreiras',
    neighborhood: 'Parque Industrial',
    detran: 'DETRAN-SP nº 9420',
    cnpj: '58.545.529/0001-70',
    address: 'Av. das Amoreiras, 2210 – Parque Industrial, Campinas/SP',
    reference: 'Ao lado do Banco Bradesco.',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 12h',
    satCloseHour: 12,
    phoneDisplay: '(19) 3271-1700',
    phoneTel: '+551932711700',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar minha vistoria na Unidade Parque Industrial (Amoreiras).',
    photo: '/assets/img/loja-campinas-parque-industrial.webp',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Av.+das+Amoreiras%2C+2210+%E2%80%93+Parque+Industrial%2C+Campinas%2FSP',
    wazeUrl:
      'https://waze.com/ul?q=Av.+das+Amoreiras%2C+2210+%E2%80%93+Parque+Industrial%2C+Campinas%2FSP&navigate=yes',
  },
];

export const VISTORIA_SERVICES: VistoriaService[] = [
  {
    id: 'vistoria-detran',
    slug: 'vistoria-detran',
    aliases: ['vistoria-transferencia', 'transferencia', 'detran'],
    title: 'Vistoria do DETRAN (Transferência)',
    shortTitle: 'Vistoria do DETRAN',
    kicker: 'VISTORIA DO DETRAN EM CAMPINAS · ECV CREDENCIADA',
    badge: 'Destaque · Oficial DETRAN',
    badgeVariant: 'dark',
    category: ['destaque', 'transferir'],
    featured: true,
    heroTheme: 'red',
    icon: 'file',
    headlineLight: 'Precisa transferir o documento?',
    headlineBold: 'Saia com o laudo oficial do DETRAN-SP em 20 minutos.',
    summary:
      'Não perca horas em filas nem corra risco de reprovação por detalhe bobo: emitimos seu laudo oficial ECV integrado ao sistema e-CRVsp na hora.',
    salesCopy:
      'Comprou um veículo, mudou de cidade ou precisa emitir segunda via? Nossas 5 lojas em Campinas são Empresas Credenciadas de Vistoria (ECV) pelo DETRAN-SP. Fazemos a coleta óptica oficial de chassi, motor e placa Mercosul com rapidez, café quentinho e transmissão imediata para você transferir o documento sem dor de cabeça.',
    idealFor:
      'Quem comprou ou vendeu um veículo e quer resolver a exigência obrigatória do DETRAN-SP hoje mesmo, sem burocracia.',
    checklist: [
      'Conferência óptica homologada da numeração de chassi e motor',
      'Validação eletrônica da placa Mercosul (QR Code) ou lacre',
      'Verificação de vidros, etiquetas ETA e plaquetas originais',
      'Checagem prévia dos itens obrigatórios exigidos pelo CONTRAN',
      'Transmissão imediata para o sistema oficial e-CRVsp do DETRAN-SP',
    ],
    deliverables: [
      'Laudo Oficial ECV integrado ao sistema do DETRAN-SP na hora',
      'Registro fotográfico homologado pronto para Poupatempo, Despachante ou Transferência Digital',
    ],
    faqs: [
      {
        q: 'Qual o prazo de validade do Laudo de Vistoria de Transferência do DETRAN-SP?',
        a: 'O laudo emitido por uma ECV credenciada pelo DETRAN-SP entra imediatamente no sistema oficial e-CRVsp para você concluir a transferência no Poupatempo, Despachante ou aplicativo.',
      },
      {
        q: 'Preciso agendar ou posso ir direto a uma das 5 unidades de Campinas?',
        a: 'Atendemos na hora por ordem de chegada ou com prioridade total agendando pelo WhatsApp (19) 99224-8383.',
      },
    ],
    keywords: [
      'vistoria detran campinas',
      'vistoria de transferencia campinas',
      'laudo transferencia detran sp campinas',
      'ecv credenciada detran campinas',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero saber o valor e agendar uma Vistoria do DETRAN (Transferência).',
  },
  {
    id: 'vistoria-cautelar',
    slug: 'vistoria-cautelar',
    aliases: ['cautelar', 'laudo-cautelar'],
    title: 'Vistoria Cautelar Completa',
    shortTitle: 'Vistoria Cautelar',
    kicker: 'VISTORIA CAUTELAR EM CAMPINAS · PROTEJA O SEU DINHEIRO',
    badge: 'Mais Procurada',
    badgeVariant: 'red',
    category: ['destaque', 'comprar'],
    featured: true,
    heroTheme: 'red',
    icon: 'search',
    headlineLight: 'Não assine nem transfira o PIX',
    headlineBold: 'sem saber o passado real do veículo.',
    summary:
      'Evite um prejuízo de R$ 20 mil a R$ 50 mil: descubra na hora se o carro tem leilão oculto, sinistro grave, chassi adulterado ou estrutura condenada.',
    salesCopy:
      'Pintura brilhando e interior cheiroso enganam até quem entende de carro. A Vistoria Cautelar coloca o veículo na lupa: inspecionamos longarinas, colunas, assoalho, soldas originais, chassi, motor e cruzamos mais de 40 bancos de dados nacionais de leilão, sinistro, roubo/furto e bloqueios judiciais. É a sua paz de espírito antes de fechar negócio.',
    idealFor:
      'Quem está comprando um usado/seminovo e não aceita correr o risco de levar uma "bomba" maquiada para a garagem da família.',
    checklist: [
      'Raio-X estrutural: longarinas dianteiras/traseiras, colunas A/B/C, caixas de ar, teto e painel corta-fogo',
      'Perícia de autenticidade: numeração de chassi, motor, câmbio, vidros e etiquetas originais (ETA)',
      'Rastreamento de passado: leilão (financeira, seguradora, frota) e indício de sinistro',
      'Varredura jurídica: histórico de roubo/furto, bloqueios Renajud, gravame ativo, multas e débitos',
      'Detecção de cortes estruturais ("carro cabrito"), emendas de solda e desalinhamento de monobloco',
    ],
    deliverables: [
      'Laudo Cautelar Impresso e Digital em PDF com fotos de alta resolução',
      'Dossiê de Pesquisa Veicular Completa + Explicação olho no olho do vistoriador',
    ],
    faqs: [
      {
        q: 'A Vistoria Cautelar descobre se o carro já foi batido ou se é de leilão?',
        a: 'Sim! Nossos peritos inspecionam fisicamente longarinas, colunas, caixas de roda, pontos de solda originais e selantes de fábrica, além de consultar as bases nacionais de leilão e sinistro.',
      },
      {
        q: 'Posso fazer a Vistoria Cautelar e a do DETRAN juntas?',
        a: 'Sim! Peça o nosso Combo Cautelar + Transferência DETRAN e resolva a segurança da compra e a documentação oficial em uma única visita.',
      },
    ],
    keywords: [
      'vistoria cautelar campinas',
      'laudo cautelar campinas',
      'pericia cautelar veicular campinas',
      'onde fazer vistoria cautelar em campinas',
    ],
    timeEstimate: '35 a 45 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero saber o valor e agendar uma Vistoria Cautelar.',
  },
  {
    id: 'vistoria-360',
    slug: 'vistoria-360',
    aliases: ['360', 'vistoria-360-plus', 'vistoria-360-max'],
    title: 'Nossa Vistoria 360º® (360º®, Plus e Max)',
    shortTitle: 'Nossa Vistoria 360º®',
    kicker: 'EXCLUSIVA AUTO VISÃO EM CAMPINAS · +180 ITENS AVALIADOS',
    badge: 'Exclusiva Auto Visão®',
    badgeVariant: 'red',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    heroTheme: 'dark',
    icon: 'orbit',
    headlineLight: 'A blindagem definitiva na compra:',
    headlineBold: 'mais de 180 itens auditados no mesmo laudo.',
    summary:
      'A evolução da vistoria cautelar que só a Auto Visão tem: Estrutura + Histórico + Pintura peça a peça (µm) + Vídeo no WhatsApp (Plus) + Scanner de KM e Certificado (Max).',
    salesCopy:
      'Para quem quer certeza absoluta ou está comprando/vendendo um carro de maior valor. A Nossa Vistoria 360º® passa um pente-fino em mais de 180 itens do veículo, incluindo medição micrométrica da pintura peça a peça. Na versão Plus, você recebe no WhatsApp o vídeo do carro funcionando; na versão Max, incluímos scanner eletrônico de todos os módulos e o Certificado Oficial do Carro.',
    idealFor:
      'Quem exige a análise mais completa de Campinas para comprar sem nenhuma dúvida ou para valorizar o seu seminovo na hora da venda.',
    checklist: [
      'Tudo da Vistoria Cautelar (Estrutura + Chassi/Motor/Vidros + Histórico de Leilão e Sinistro)',
      'Medição digital da pintura peça a peça em micrômetros (revela retoques, repintura e massa)',
      'Mais de 180 itens de carroceria, acabamento, iluminação, pneus e conservação auditados',
      'Versão 360º® Plus: Vídeo completo do veículo funcionando enviado direto no seu WhatsApp',
      'Versão 360º® Max: Scanner OBD-II dos módulos eletrônicos + Auditoria de KM + Certificado do Carro',
    ],
    deliverables: [
      'Laudo 360º® Completo (+180 itens) + Mapa de Pintura Peça a Peça',
      'Vídeo HD no WhatsApp (Plus/Max) + Relatório de Scanner de Módulos e Certificado Oficial (Max)',
    ],
    faqs: [
      {
        q: 'Qual a diferença entre a Vistoria 360º®, 360º® Plus e 360º® Max?',
        a: 'A 360º® avalia estrutura, histórico e pintura peça a peça (+180 itens). A 360º® Plus adiciona o vídeo completo de funcionamento enviado no seu WhatsApp. A 360º® Max adiciona o diagnóstico eletrônico por scanner (módulos e KM) e o Certificado Oficial do Carro.',
      },
    ],
    keywords: [
      'vistoria 360 campinas',
      'vistoria 360 auto visao',
      'vistoria completa 180 itens campinas',
    ],
    timeEstimate: '45 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero saber o valor e agendar a Nossa Vistoria 360º®.',
  },
  {
    id: 'vistoria-pintura',
    slug: 'vistoria-pintura',
    aliases: ['laudo-pintura', 'pintura'],
    title: 'Vistoria de Pintura Peça a Peça',
    shortTitle: 'Vistoria de Pintura',
    kicker: 'VISTORIA DE PINTURA EM CAMPINAS · MEDIÇÃO MICROMÉTRICA',
    badge: 'Mapa em µm',
    badgeVariant: 'red',
    category: ['comprar', 'avancada'],
    heroTheme: 'red',
    icon: 'paint',
    headlineLight: 'Polimento esconde no olho,',
    headlineBold: 'mas não engana o nosso medidor digital.',
    summary:
      'Medição micrométrica (µm) painel por painel para descobrir portas batidas, retoques de funilaria e camadas de massa plástica.',
    salesCopy:
      'Um carro pode não ter afetado a longarina numa batida lateral, mas estar com duas portas e a lateral traseira cheias de massa plástica que vai trincar e derrubar o valor de revenda. Medimos a espessura da tinta em cada peça com equipamento digital de precisão e entregamos o mapa completo da lataria.',
    idealFor:
      'Quem quer ter certeza da originalidade estética do veículo e fugir de carros com funilaria malfeita ou massa plástica.',
    checklist: [
      'Medição digital em micrômetros (µm) no capô, teto, tampa traseira, portas, laterais e para-lamas',
      'Diferenciação exata: Pintura Original (~90–140 µm) vs. Repintura (>180 µm) vs. Massa Plástica (>300 µm)',
      'Inspeção de diferença de tonalidade, textura de verniz ("casca de laranja") e marcas de fita',
      'Verificação dos parafusos de fixação de portas, capô e porta-malas (sinais de troca de peça)',
    ],
    deliverables: [
      'Mapa gráfico peça a peça com a espessura exata medida em cada painel do carro',
    ],
    faqs: [
      {
        q: 'O aparelho de medição de pintura risca o carro?',
        a: 'De forma alguma! Utilizamos medidores digitais com ponteira macia calibrada que apenas encosta suavemente no verniz.',
      },
    ],
    keywords: [
      'vistoria de pintura campinas',
      'laudo de pintura automotiva campinas',
      'medicao espessura tinta carro campinas',
    ],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero saber o valor e agendar uma Vistoria de Pintura.',
  },
  {
    id: 'vistoria-km-scanner',
    slug: 'vistoria-km-scanner',
    aliases: ['laudo-scanner', 'vistoria-km', 'scanner-modulo'],
    title: 'Vistoria de KM com Scanner de Módulo',
    shortTitle: 'KM com Scanner de Módulo',
    kicker: 'SCANNER DE MÓDULO E KM EM CAMPINAS · ANTI-FRAUDE OBD-II',
    badge: 'Auditoria de KM',
    badgeVariant: 'dark',
    category: ['comprar', 'avancada'],
    heroTheme: 'dark',
    icon: 'gauge',
    headlineLight: 'Desconfia da quilometragem do painel?',
    headlineBold: 'Nosso scanner lê a memória oculta dos módulos.',
    summary:
      'Conecta direto na central eletrônica (OBD-II) para auditar o KM real no motor, câmbio, ABS e airbag e revelar falhas apagadas.',
    salesCopy:
      'Voltar o KM do painel leva poucos minutos para um fraudador — mas apagar o histórico interno dos módulos de injeção (ECU), câmbio automático (TCU), freios ABS e airbag é outra história. Além de auditar a quilometragem eletrônica, nosso scanner detecta códigos de falha (DTC) de motor e câmbio que foram apagados só para o test-drive.',
    idealFor:
      'Qualquer comprador de seminovo que quer evitar comprar um carro de 160.000 km achando que tem 55.000 km.',
    checklist: [
      'Auditoria cruzada do KM gravado nos módulos de Motor (ECU), Câmbio (TCU), ABS, Airbag e Painel',
      'Leitura completa de códigos de falha (DTC) ativos e na memória histórica da injeção e câmbio',
      'Verificação eletrônica dos sistemas de segurança (sensores de ABS, estabilidade e airbags)',
      'Identificação de alertas recém-apagados via scanner antes da venda',
    ],
    deliverables: [
      'Relatório de Diagnóstico Eletrônico com status de cada módulo + Comparativo KM Painel x Módulos',
    ],
    faqs: [
      {
        q: 'Como o scanner descobre se a quilometragem foi adulterada?',
        a: 'Mesmo quando alteram o número do painel, outros módulos (como câmbio automático, freios ABS, injeção ou chave) mantêm o registro interno de quilometragem ou horas de uso, revelando a fraude.',
      },
    ],
    keywords: [
      'vistoria de km campinas',
      'scanner automotivo quilometragem real campinas',
      'descobrir km adulterado campinas',
    ],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de KM com Scanner de Módulo.',
  },
  {
    id: 'vistoria-bateria-eletricos',
    slug: 'vistoria-bateria-eletricos',
    aliases: ['vistoria-eletricos-hibridos', 'carros-eletricos', 'aviloo'],
    title: 'Vistoria de Bateria para Elétricos e Híbridos',
    shortTitle: 'Bateria Elétricos e Híbridos',
    kicker: 'ELÉTRICOS E HÍBRIDOS EM CAMPINAS · CERTIFICADO AVILOO',
    badge: 'Certificado AVILOO',
    badgeVariant: 'green',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    heroTheme: 'dark',
    icon: 'battery',
    headlineLight: 'A bateria vale metade do carro elétrico:',
    headlineBold: 'exija o Certificado de Saúde AVILOO.',
    summary:
      'Diagnóstico independente internacional da saúde real da bateria de alta tensão (SoH), proteção inferior, módulos e estrutura.',
    salesCopy:
      'Trocar uma bateria de alta tensão fora da garantia pode custar mais de R$ 80 mil. Na Auto Visão Campinas, usamos a certificação independente austríaca AVILOO para medir o Estado de Saúde (SoH) real das células, temperatura, balanceamento de tensão e ainda inspecionamos o cofre inferior contra pancadas de solo.',
    idealFor:
      'Quem vai comprar ou vender um elétrico ou híbrido (BYD, GWM, Volvo, Toyota Hybrid, BMW, Porsche, Caoa Chery) com segurança total.',
    checklist: [
      'Medição certificada do Estado de Saúde (SoH) da bateria de tração com selo internacional AVILOO',
      'Análise de equilíbrio de tensão entre células, temperatura e histórico de degradação',
      'Inspeção física inferior do pack de baterias contra raspadas, amassados e infiltrações',
      'Varredura via scanner dos inversores, motores elétricos e sistema regenerativo',
      'Vistoria Cautelar completa de estrutura, chassi e histórico (leilão e sinistro)',
    ],
    deliverables: [
      'Certificado Independente AVILOO da Bateria + Laudo Estrutural, Histórico e Eletrônico Completo',
    ],
    faqs: [
      {
        q: 'Quais marcas de carros elétricos e híbridos vocês atendem em Campinas?',
        a: 'Atendemos todas as marcas: BYD (Dolphin, Song Plus, Seal, Yuan), GWM (Haval H6, Ora 03), Volvo, Toyota (Corolla e RAV4 Hybrid), Caoa Chery, BMW, Audi, Porsche, Mini e Renault.',
      },
      {
        q: 'Onde é feito o laudo de bateria?',
        a: 'O laudo de bateria é feito em qualquer uma das 5 lojas ou no seu endereço.',
      },
    ],
    keywords: [
      'vistoria carros eletricos campinas',
      'vistoria hibridos campinas',
      'teste bateria carro eletrico aviloo campinas',
    ],
    timeEstimate: '45 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Bateria para Elétrico / Híbrido.',
  },
  {
    id: 'vistoria-premium',
    slug: 'vistoria-premium',
    aliases: ['premium', 'vistoria-exclusive'],
    title: 'Vistoria Premium (Veículos Acima de R$ 200 mil)',
    shortTitle: 'Vistoria Premium',
    kicker: 'VISTORIA PREMIUM EM CAMPINAS · ALTO PADRÃO E SUPERESPORTIVOS',
    badge: 'Acima de R$ 200 mil',
    badgeVariant: 'red',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    heroTheme: 'dark',
    icon: 'star',
    headlineLight: 'Investimento acima de R$ 200 mil exige',
    headlineBold: 'perícia cirúrgica do motor à estrutura.',
    summary:
      'A inspeção mais rigorosa de Campinas: une Cautelar + Pintura em µm + Scanner de Módulos + Avaliação Mecânica Completa.',
    salesCopy:
      'Em um veículo premium, importado, blindado ou esportivo, qualquer falha oculta de câmbio, turbina, suspensão pneumática ou módulo eletrônico custa o preço de um carro popular. A Vistoria Premium une perícia estrutural, pintura peça a peça, leitura eletrônica completa por scanner e avaliação mecânica detalhada.',
    idealFor:
      'Compradores e vendedores de veículos acima de R$ 200 mil (e modalidade Exclusive in loco para superesportivos acima de R$ 400 mil).',
    checklist: [
      'Avaliação Mecânica Completa: motor, câmbio, arrefecimento, freios, direção e conjunto de suspensão',
      'Leitura eletrônica profunda via Scanner em todas as centrais e auditoria de KM real',
      'Medição micrométrica de pintura peça a peça (detecção de retoques estéticos e desmontagens)',
      'Análise estrutural minuciosa (longarinas, colunas, soldas especiais e blindagem)',
      'Pesquisa Veicular Completa em bases nacionais + Dossiê fotográfico de alta resolução',
    ],
    deliverables: [
      'Dossiê Executivo Vistoria Premium (Estrutura + Pintura + Scanner + Laudo Mecânico + Histórico)',
    ],
    faqs: [
      {
        q: 'Qual a diferença entre a Vistoria Premium e a Vistoria Exclusive?',
        a: 'A Vistoria Premium atende veículos acima de R$ 200 mil com análise mecânica, estrutural, pintura e scanner. A Exclusive atende veículos de nicho acima de R$ 400 mil com atendimento in loco.',
      },
    ],
    keywords: [
      'vistoria premium campinas',
      'vistoria carros de luxo campinas',
      'pre compra carros importados campinas',
    ],
    timeEstimate: '60 a 90 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Premium (veículo acima de R$ 200 mil).',
  },
  {
    id: 'vistoria-pesados',
    slug: 'vistoria-pesados',
    aliases: ['vistoria-veiculos-pesados', 'caminhoes', 'onibus'],
    title: 'Vistoria em Veículos Pesados',
    shortTitle: 'Veículos Pesados',
    kicker: 'VISTORIA EM VEÍCULOS PESADOS EM CAMPINAS · CAMINHÕES E ÔNIBUS',
    badge: 'Frotas & Pesados',
    badgeVariant: 'dark',
    category: ['pesados', 'transferir', 'empresas'],
    heroTheme: 'red',
    icon: 'truck',
    headlineLight: 'Caminhões, ônibus, carretas e vans:',
    headlineBold: 'segurança para quem não pode parar na estrada.',
    summary:
      'Vistoria DETRAN, Cautelar e de Frota para caminhões, cavalos mecânicos, carretas, ônibus e utilitários pesados em Campinas.',
    salesCopy:
      'Comprar um caminhão com chassi trincado, motor remarcado ou restrição de leilão trava a sua operação e gera prejuízo diário. Nossas equipes em Campinas são especialistas em longarinas de pesados, plaquetas de cabine, motor diesel, eixos e implementos rodoviários.',
    idealFor:
      'Transportadoras, caminhoneiros autônomos, frotistas e empresas de ônibus/fretamento em Campinas e região.',
    checklist: [
      'Identificação pericial de chassi em longarina, cabine, motor diesel, caixa de câmbio e eixos',
      'Verificação de implementos rodoviários, baús, carrocerias, quinta roda e semirreboques',
      'Análise estrutural de longarinas do chassi (trincas, soldas, empenamentos e alongamentos)',
      'Conferência dos itens obrigatórios exigidos pelo CONTRAN/DETRAN-SP',
    ],
    deliverables: [
      'Laudo Oficial DETRAN-SP (Transferência/Regularização) ou Laudo Cautelar Pesados',
    ],
    faqs: [
      {
        q: 'Vocês atendem caminhões e frotas no pátio da nossa empresa em Campinas?',
        a: 'Sim! Além das unidades compatíveis com pesados, realizamos atendimento corporativo in loco para frotas em Campinas e região. Chame no WhatsApp (19) 99224-8383.',
      },
    ],
    keywords: [
      'vistoria caminhao campinas',
      'vistoria veiculos pesados campinas',
      'vistoria cautelar caminhao campinas',
    ],
    timeEstimate: '40 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar Vistoria em Veículo Pesado (Caminhão / Ônibus / Van).',
  },
  {
    id: 'vistoria-infracao-transito',
    slug: 'vistoria-infracao-transito',
    aliases: ['vistoria-infracao', 'infracao-transito', 'regularizacao-detran'],
    title: 'Vistoria de Infração de Trânsito',
    shortTitle: 'Infração de Trânsito',
    kicker: 'VISTORIA DE INFRAÇÃO DE TRÂNSITO EM CAMPINAS · DETRAN-SP',
    badge: 'Regularização Oficial',
    badgeVariant: 'dark',
    category: ['transferir'],
    heroTheme: 'red',
    icon: 'shield',
    headlineLight: 'Documento bloqueado por multa ou retenção?',
    headlineBold: 'Libere e regularize seu veículo hoje mesmo.',
    summary:
      'Laudo oficial ECV exigido pelo DETRAN-SP para dar baixa em bloqueio administrativo, recibo vencido ou infração de equipamento.',
    salesCopy:
      'Teve o documento retido por pneu gasto, iluminação, insulfilm, suspensão ou recibo vencido? Assim que corrigir o item apontado, passe em uma de nossas 5 lojas em Campinas. Emitimos o laudo oficial ECV direto no sistema do DETRAN-SP para desbloquear seu veículo sem demora.',
    idealFor:
      'Motoristas que precisam dar baixa rápida em bloqueio administrativo ou retenção por infração no DETRAN-SP.',
    checklist: [
      'Conferência técnica do item regularizado (pneus, iluminação, películas, escapamento, suspensão, cor)',
      'Inspeção completa de todos os equipamentos obrigatórios do CONTRAN',
      'Validação oficial de chassi, motor e placas no sistema e-CRVsp do DETRAN-SP',
      'Orientação passo a passo para concluir a baixa do bloqueio administrativo',
    ],
    deliverables: [
      'Laudo Oficial ECV de Regularização transmitido eletronicamente ao DETRAN-SP',
    ],
    faqs: [],
    keywords: [
      'vistoria de infracao de transito campinas',
      'vistoria desbloqueio documento retido detran campinas',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Infração de Trânsito / Regularização.',
  },
  {
    id: 'vistoria-patio-publico',
    slug: 'vistoria-patio-publico',
    aliases: ['patio-publico', 'liberacao-patio'],
    title: 'Vistoria em Pátio Público',
    shortTitle: 'Vistoria em Pátio Público',
    kicker: 'VISTORIA EM PÁTIO PÚBLICO EM CAMPINAS · LIBERAÇÃO RÁPIDA',
    badge: 'Atendimento em Pátio',
    badgeVariant: 'dark',
    category: ['transferir', 'empresas'],
    heroTheme: 'dark',
    icon: 'pin',
    headlineLight: 'Veículo apreendido em pátio público?',
    headlineBold: 'Evite diárias extras: agende o laudo de liberação.',
    summary:
      'Realização de vistoria técnica ECV para liberação e desbloqueio de veículos recolhidos em pátios (EMDEC, DER, DETRAN).',
    salesCopy:
      'Cada dia parado no pátio público significa mais taxas de estadia acumuladas. Orientamos exatamente a documentação necessária e realizamos a vistoria ECV credenciada pelo DETRAN-SP para acelerar o desbloqueio e a retirada do seu veículo em Campinas.',
    idealFor:
      'Proprietários, despachantes, advogados e empresas que precisam liberar veículos recolhidos em pátios públicos de Campinas.',
    checklist: [
      'Orientação completa sobre ofícios e requisitos exigidos pelo DETRAN-SP / órgão gestor do pátio',
      'Coleta e validação pericial de chassi, motor e placas segundo as normas vigentes',
      'Verificação dos itens apontados no termo de recolhimento/apreensão',
      'Emissão do laudo oficial ECV para protocolo de liberação administrativa',
    ],
    deliverables: [
      'Laudo Oficial ECV Credenciada DETRAN-SP válido para liberação de pátio e desbloqueio',
    ],
    faqs: [],
    keywords: [
      'vistoria em patio publico campinas',
      'vistoria liberacao veiculo apreendido campinas',
    ],
    timeEstimate: 'Conforme agendamento',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e preciso de orientação/agendamento para Vistoria em Pátio Público.',
  },
  // =========================================================================
  // SERVIÇOS CORPORATIVOS / PJ (AGRUPADOS NO CARD EMPRESAS PJ NA HOME)
  // =========================================================================
  {
    id: 'para-empresas',
    slug: 'para-empresas',
    aliases: ['empresas', 'pj', 'corporativo', 'frotas'],
    title: 'Vistorias para Empresas (PJ): Seguradora, Financeira e Proteção Veicular',
    shortTitle: 'Empresas (PJ): Seguradora, Financeira e Proteção',
    kicker: 'ATENDIMENTO CORPORATIVO E CONVÊNIOS PJ EM CAMPINAS',
    badge: 'Exclusivo Empresas / PJ',
    badgeVariant: 'dark',
    category: ['empresas'],
    heroTheme: 'dark',
    icon: 'building',
    headlineLight: 'Agilidade e padrão técnico para',
    headlineBold: 'Seguradoras, Financeiras, Associações e Frotas.',
    summary:
      'Soluções corporativas para PJs em Campinas: Vistoria Prévia para Seguradoras, Laudo para Financeiras/Consórcios, Proteção Automotiva e Frotas.',
    salesCopy:
      'Sua empresa precisa de rapidez na emissão de laudos para aprovar apólices, liberar contratos de financiamento/consórcio ou auditar adesões e frotas. Com 5 lojas estrategicamente posicionadas em Campinas e atendimento in loco sob demanda, a Auto Visão é a parceira técnica ideal para o seu negócio.',
    idealFor:
      'Seguradoras, corretoras, bancos, financeiras, administradoras de consórcio, associações de proteção veicular, locadoras e concessionárias.',
    checklist: [
      'Vistoria para Seguradora (Vistoria Prévia): inspeção ágil para contratação ou endosso de apólice',
      'Vistoria para Financeira e Consórcio: laudo de avaliação e identificação para liberação de crédito',
      'Vistoria para Proteção Automotiva: laudo de entrada e constatação com fotos auditáveis para associações',
      'Gestão e Desmobilização de Frotas: inventário, avaliação e vistoria por placa para empresas',
    ],
    deliverables: [
      'Laudos técnicos padronizados com emissão rápida e condições corporativas para PJ',
    ],
    faqs: [],
    keywords: [
      'vistoria para empresas campinas',
      'vistoria financeira seguradora protecao veicular campinas',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero atendimento corporativo (PJ) para Seguradora / Financeira / Proteção Veicular / Frota.',
  },
  {
    id: 'vistoria-financeira',
    slug: 'vistoria-financeira',
    aliases: ['vistoria-consorcios', 'financeira', 'consorcio'],
    title: 'Vistoria para Financeira e Consórcio',
    shortTitle: 'Vistoria para Financeira',
    kicker: 'SERVIÇO CORPORATIVO PJ · CRÉDITO E CONSÓRCIOS',
    badge: 'Empresas / PJ',
    badgeVariant: 'dark',
    category: ['empresas'],
    isPJOnly: true,
    heroTheme: 'dark',
    icon: 'building',
    headlineLight: 'Financiamento, consórcio ou refinanciamento:',
    headlineBold: 'laudo ágil para destravar o pagamento.',
    summary:
      'Laudo técnico exigido por bancos, financeiras e consórcios para comprovar a regularidade do veículo dado em garantia.',
    salesCopy:
      'Atendemos bancos, financeiras, cooperativas de crédito e administradoras de consórcio em Campinas com emissão na hora do laudo de identificação, conservação e avaliação de mercado para acelerar a liberação do crédito.',
    idealFor:
      'Instituições financeiras, administradoras de consórcio, cooperativas de crédito, lojistas e contemplados em consórcio.',
    checklist: [
      'Autenticidade de chassi, motor e vidros conforme exigência do banco/consórcio',
      'Avaliação do estado geral de conservação interna, externa e pneus',
      'Verificação estrutural e pesquisa de histórico (leilão, sinistro, roubo/furto)',
      'Registro fotográfico padronizado exigido pelas mesas de crédito e administradoras',
    ],
    deliverables: [
      'Laudo de Avaliação / Constatação homologado pronto para envio ao banco, financeira ou consórcio',
    ],
    faqs: [],
    keywords: ['vistoria para consorcio campinas', 'vistoria para financeira campinas'],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e preciso de Vistoria para Financeira / Consórcio.',
  },
  {
    id: 'vistoria-seguradora',
    slug: 'vistoria-seguradora',
    aliases: ['vistoria-previa', 'seguradora', 'seguro'],
    title: 'Vistoria para Seguradora (Vistoria Prévia)',
    shortTitle: 'Vistoria para Seguradora',
    kicker: 'SERVIÇO CORPORATIVO PJ · VISTORIA PRÉVIA DE SEGURO',
    badge: 'Empresas / PJ',
    badgeVariant: 'dark',
    category: ['empresas'],
    isPJOnly: true,
    heroTheme: 'red',
    icon: 'shield',
    headlineLight: 'Contratação ou endosso de apólice:',
    headlineBold: 'vistoria prévia rápida para seguradoras.',
    summary:
      'Inspeção prévia para seguradoras e corretoras registrando chassi, conservação, acessórios e avarias pré-existentes.',
    salesCopy:
      'Registramos com precisão chassi, motor, quilometragem, estado da lataria, vidros, faróis, pneus e acessórios instalados, documentando o veículo com fotos padronizadas para seguradoras e corretoras parceiras.',
    idealFor: 'Companhias seguradoras, corretoras de seguros e frotas corporativas em Campinas.',
    checklist: [
      'Conferência de chassi, motor, placa e numeração dos vidros',
      'Mapeamento de estado da carroceria, pintura, para-choques, faróis e lanternas',
      'Registro de quilometragem, pneus e acessórios instalados',
      'Fotos padronizadas de alta definição conforme protocolo das seguradoras',
    ],
    deliverables: [
      'Relatório de Vistoria Prévia com dossiê fotográfico completo para a seguradora/corretor',
    ],
    faqs: [],
    keywords: ['vistoria previa seguro campinas', 'vistoria para seguradora campinas'],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Prévia para Seguradora.',
  },
  {
    id: 'vistoria-protecao-automotiva',
    slug: 'vistoria-protecao-automotiva',
    aliases: ['vistoria-protecao-veicular', 'protecao-veicular', 'protecao-automotiva'],
    title: 'Vistoria para Proteção Automotiva',
    shortTitle: 'Proteção Automotiva',
    kicker: 'SERVIÇO CORPORATIVO PJ · ASSOCIAÇÕES E COOPERATIVAS',
    badge: 'Empresas / PJ',
    badgeVariant: 'red',
    category: ['empresas'],
    isPJOnly: true,
    heroTheme: 'dark',
    icon: 'shield',
    headlineLight: 'Adesão segura e auditável para',
    headlineBold: 'associações de proteção veicular.',
    summary:
      'Laudo técnico de entrada e constatação para associações de proteção automotiva, clubes de benefícios e cooperativas.',
    salesCopy:
      'Evite fraudes de sinistro pré-existente e proteja a saúde financeira da associação. Realizamos a vistoria completa de adesão com fotos datadas, conferência de chassi/motor, estado de pneus, vidros e registro de avarias anteriores.',
    idealFor: 'Associações de proteção veicular, cooperativas e gestores de benefícios automotivos.',
    checklist: [
      'Identificação completa do veículo (chassi, motor, placa Mercosul, CRLV e hodômetro)',
      'Registro fotográfico auditável em 360º com data e hora',
      'Inspeção de avarias pré-existentes em lataria, vidros, lanternas, faróis e interior',
      'Verificação do estado de conservação dos pneus e equipamentos obrigatórios',
    ],
    deliverables: [
      'Laudo de Adesão / Proteção Veicular em PDF + Galeria Fotográfica Auditável',
    ],
    faqs: [],
    keywords: ['vistoria protecao veicular campinas', 'vistoria protecao automotiva campinas'],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero atendimento de Vistoria para Proteção Automotiva.',
  },
];

export const PUBLIC_MAIN_SERVICES = VISTORIA_SERVICES.filter((s) => !s.isPJOnly);

export const findServiceBySlug = (rawSlug: string | null | undefined): VistoriaService | null => {
  if (!rawSlug) return null;
  const clean = rawSlug
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()
    .trim();
  if (!clean) return null;
  return (
    VISTORIA_SERVICES.find(
      (s) => s.slug === clean || s.id === clean || s.aliases.includes(clean)
    ) || null
  );
};

export const FAQ_ITEMS = [
  {
    q: 'Onde ficam as 5 lojas da Auto Visão em Campinas e qual é a mais próxima de mim?',
    a: 'Temos 5 unidades credenciadas pelo DETRAN-SP em Campinas: 1) Taquaral (Av. Imperatriz Leopoldina, 38), 2) Centro / Castelo (Av. Andrade Neves, 1160), 3) Ponte Preta / Abolição (Rua da Abolição, 2036 — Plantão aos sábados até 16h), 4) Campos Elíseos (Rua Domício Pacheco e Silva, 318) e 5) Parque Industrial / Amoreiras (Av. das Amoreiras, 2210). Agende pelo WhatsApp (19) 99224-8383 ou telefone fixo (19) 3271-1700.',
  },
  {
    q: 'Qual loja da Auto Visão em Campinas abre aos sábados à tarde (Plantão)?',
    a: 'A nossa Unidade 3 — Ponte Preta / Abolição (Rua da Abolição, 2036, em frente ao Extra Abolição) é a Unidade de Plantão em Campinas e atende aos sábados das 08h às 16h! As outras 4 unidades funcionam aos sábados das 08h às 12h.',
  },
  {
    q: 'Qual a diferença entre Vistoria do DETRAN (Transferência), Vistoria Cautelar e Nossa Vistoria 360º®?',
    a: 'A Vistoria do DETRAN (Transferência) é o laudo oficial exigido por lei para passar o documento do veículo para o seu nome. A Vistoria Cautelar analisa longarinas, colunas, chassi, motor e pesquisa se o carro tem leilão, sinistro, roubo/furto ou débitos antes da compra. Já a Nossa Vistoria 360º® avalia +180 itens, unindo Cautelar + medição de pintura peça a peça + vídeo no WhatsApp (Plus) + scanner de módulos e Certificado do Carro (Max).',
  },
  {
    q: 'Quais documentos preciso levar para fazer a vistoria em Campinas?',
    a: 'Basta levar o documento do veículo (CRLV-e digital ou impresso / CRV) e um documento oficial com foto de quem estiver conduzindo o veículo (CNH ou RG).',
  },
  {
    q: 'A Auto Visão atende empresas (PJ), seguradoras, financeiras, proteção veicular e caminhões?',
    a: 'Sim! Contamos com atendimento dedicado para PJs (Seguradoras, Financeiras, Consórcios, Associações de Proteção Automotiva e Frotas), além de Vistoria em Veículos Pesados (caminhões, ônibus, carretas e vans) e Pátio Público.',
  },
];

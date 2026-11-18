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
  title: string;
  shortTitle: string;
  kicker: string;
  badge: string;
  badgeVariant?: 'red' | 'dark' | 'green';
  category: ('destaque' | 'comprar' | 'transferir' | 'avancada' | 'pesados' | 'empresas')[];
  featured?: boolean;
  icon: string;
  headlineLight: string;
  headlineBold: string;
  summary: string;
  salesCopy: string;
  idealFor: string;
  checklist: string[];
  deliverables: string[];
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
      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria na Unidade Ponte Preta / Abolição.',
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
    reference: 'Próximo ao Balão do Taquaral, subindo a Av. Imperatriz, logo após a Bono Pneus e Igreja N. Sra. das Graças.',
    hoursWeek: 'Seg. a sex.: 08h às 18h',
    hoursSat: 'Sábado: 08h às 12h',
    satCloseHour: 12,
    phoneDisplay: '(19) 3234-3929',
    phoneTel: '+551932343929',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria na Unidade Taquaral.',
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
    phoneDisplay: '(19) 3234-3929',
    phoneTel: '+551932343929',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria na Unidade Centro (Av. Andrade Neves).',
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
      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria na Unidade Campos Elíseos.',
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
    phoneDisplay: '(19) 3368-4142',
    phoneTel: '+551933684142',
    whatsappDisplay: '(19) 99224-8383',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e gostaria de agendar uma vistoria na Unidade Parque Industrial (Amoreiras).',
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
    title: 'Vistoria do DETRAN (Transferência)',
    shortTitle: 'Vistoria do DETRAN',
    kicker: 'DESTAQUE OFICIAL · ECV CREDENCIADA DETRAN-SP',
    badge: 'Destaque · Oficial DETRAN',
    badgeVariant: 'dark',
    category: ['destaque', 'transferir'],
    featured: true,
    icon: 'file',
    headlineLight: 'Vai transferir o veículo?',
    headlineBold: 'Laudo oficial do DETRAN-SP na hora.',
    summary:
      'Etapa obrigatória exigida pelo DETRAN-SP para transferência de propriedade, mudança de município, segunda via de CRV ou alteração de características.',
    salesCopy:
      'Nossas 5 lojas em Campinas são Empresas Credenciadas de Vistoria (ECV) pelo DETRAN-SP. Realizamos a coleta óptica oficial de chassi, motor, câmbio, lacre/QR Code da placa Mercosul e itens obrigatórios de segurança com integração direta ao sistema e-CRVsp.',
    idealFor: 'Quem comprou ou vendeu um veículo e precisa transferir o documento no DETRAN-SP sem filas e sem retrabalho.',
    checklist: [
      'Conferência óptica e pericial da numeração de chassi e motor',
      'Validação da placa Mercosul (QR Code) ou tarjeta e lacre',
      'Verificação de vidros, etiquetas ETA e plaquetas do fabricante',
      'Inspeção dos equipamentos obrigatórios (pneus, iluminação, cintos, buzina, limpadores)',
      'Transmissão eletrônica imediata para a base oficial do DETRAN-SP',
    ],
    deliverables: [
      'Laudo Oficial ECV integrado ao sistema do DETRAN-SP na hora',
      'Registro fotográfico homologado de chassi, motor e veículo',
      'Orientação completa para concluir a transferência digital ou no Poupatempo/Despachante',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria do DETRAN (Transferência).',
  },
  {
    id: 'vistoria-cautelar',
    title: 'Vistoria Cautelar Completa',
    shortTitle: 'Vistoria Cautelar',
    kicker: 'DESTAQUE · COMPRA E VENDA SEGURA',
    badge: 'Mais Procurada',
    badgeVariant: 'red',
    category: ['destaque', 'comprar'],
    featured: true,
    icon: 'search',
    headlineLight: 'Quem você ama merece',
    headlineBold: 'um carro vistoriado antes da compra.',
    summary:
      'Descubra se o veículo tem passagem por leilão, sinistro, batida estrutural, chassi adulterado ou restrições judiciais antes de fechar negócio.',
    salesCopy:
      'O test-drive mostra como o carro anda hoje; a Vistoria Cautelar revela o que ele já viveu. Analisamos a integridade estrutural (longarinas, colunas, painel frontal/traseiro, assoalho), autenticidade de chassi/motor/câmbio/vidros e cruzamos mais de 40 bases nacionais de leilão, sinistro, roubo/furto e gravames.',
    idealFor: 'Compradores de carros usados/seminovos, vendedores particulares que querem valorizar o carro e lojistas na avaliação de troca.',
    checklist: [
      'Estrutura completa: longarinas dianteiras e traseiras, colunas A/B/C, caixas de ar e teto',
      'Identificação pericial: chassi, motor, câmbio, gravação dos vidros e etiquetas originais (ETA)',
      'Histórico completo: passagem por leilão (financeira, seguradora, frota) e indício de sinistro',
      'Pesquisa de roubo e furto, restrições judiciais (Renajud), bloqueios, multas e gravame ativo',
      'Detecção de cortes estruturais ("cabrito"), emendas de solda não originais e desalinhamentos',
    ],
    deliverables: [
      'Laudo Cautelar Impresso e Digital em PDF com fotos de alta resolução',
      'Dossiê de Pesquisa Veicular Completa (Leilão, Sinistro, Débitos e Restrições)',
      'Parecer técnico claro e imparcial explicado pelo vistoriador',
    ],
    timeEstimate: '35 a 45 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Cautelar.',
  },
  {
    id: 'vistoria-360',
    title: 'Nossa Vistoria 360º® (360º®, Plus e Max)',
    shortTitle: 'Nossa Vistoria 360º®',
    kicker: 'EXCLUSIVA AUTO VISÃO · +180 ITENS AVALIADOS',
    badge: 'Exclusiva Auto Visão®',
    badgeVariant: 'red',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    icon: 'orbit',
    headlineLight: 'O carro visto por inteiro:',
    headlineBold: 'mais de 180 itens no mesmo laudo.',
    summary:
      'A evolução da vistoria cautelar que só a Rede Auto Visão oferece: Estrutura + Histórico + Pintura peça a peça + Vídeo de Funcionamento (Plus) + Scanner de Módulos e Certificado do Carro (Max).',
    salesCopy:
      'Por que contratar análises separadas quando você pode ter um raio-x de 360 graus? A Nossa Vistoria 360º® avalia mais de 180 pontos do veículo. Na versão Plus, você recebe no WhatsApp o vídeo do carro funcionando; na versão Max, incluímos leitura eletrônica por scanner de todos os módulos e o exclusivo Certificado do Carro Auto Visão.',
    idealFor: 'Quem quer máxima segurança na compra de um seminovo, quem compra à distância ou quem deseja vender mais rápido pelo valor justo.',
    checklist: [
      'Tudo da Vistoria Cautelar (Estrutura + Chassi/Motor/Vidros + Histórico de Leilão e Sinistro)',
      'Medição micrométrica de pintura peça a peça (mapa visual de retoques, repintura e massa)',
      'Mais de 180 itens de acabamento, carroceria, iluminação, pneus e conservação verificados',
      'Versão 360º® Plus: Vídeo completo de funcionamento (motor, ar-condicionado, painel) enviado no WhatsApp',
      'Versão 360º® Max: Scanner eletrônico OBD-II dos módulos + Auditoria de KM + Certificado do Carro',
    ],
    deliverables: [
      'Laudo 360º® Completo (+180 itens) + Mapa de Pintura Peça a Peça',
      'Vídeo HD no WhatsApp (Plus/Max) + Relatório de Scanner de Módulos (Max)',
      'Selo e Certificado Oficial do Carro Auto Visão 360º®',
    ],
    timeEstimate: '45 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar a Nossa Vistoria 360º®.',
  },
  {
    id: 'vistoria-pintura',
    title: 'Vistoria de Pintura Peça a Peça',
    shortTitle: 'Vistoria de Pintura',
    kicker: 'MEDIÇÃO MICROMÉTRICA · ESTÉTICA E FUNILARIA',
    badge: 'Mapa em µm',
    badgeVariant: 'red',
    category: ['comprar', 'avancada'],
    icon: 'paint',
    headlineLight: 'Olhar treinado e medidor digital:',
    headlineBold: 'descubra repinturas e massa plástica.',
    summary:
      'Medição eletrônica da espessura da camada de tinta (em micrômetros - µm) em cada painel externo para revelar retoques, segunda mão de verniz ou reparos com massa.',
    salesCopy:
      'Muitas vezes uma colisão leve ou média não atinge a longarina, mas deixa portas, para-lamas, capô ou tampa traseira cheios de massa plástica que trinca com o tempo e desvaloriza o veículo na revenda. Medimos peça por peça com equipamento digital calibrado e entregamos o mapa colorido da pintura.',
    idealFor: 'Compradores exigentes com estética e originalidade de fábrica, carros seminovos na garantia e avaliação de revenda.',
    checklist: [
      'Medição digital em micrômetros (µm) no capô, teto, tampa do porta-malas, portas, laterais e para-lamas',
      'Identificação de pintura original de fábrica (~90 a 140 µm) vs. repintura (>180 µm) vs. massa plástica (>300 µm)',
      'Análise visual de diferença de tonalidade, textura "casca de laranja", pulverização e marcas de fita',
      'Verificação dos parafusos de fixação de portas, capô e tampa traseira (sinais de remoção/troca de peça)',
    ],
    deliverables: [
      'Mapa gráfico peça a peça com a espessura medida em cada painel',
      'Classificação clara: Pintura Original, Repintura Estética ou Reparo com Massa/Funilaria',
    ],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Pintura.',
  },
  {
    id: 'vistoria-km-scanner',
    title: 'Vistoria de KM com Scanner de Módulo',
    shortTitle: 'KM com Scanner de Módulo',
    kicker: 'DIAGNÓSTICO ELETRÔNICO OBD-II · ANTI-FRAUDE DE KM',
    badge: 'Auditoria de KM',
    badgeVariant: 'dark',
    category: ['comprar', 'avancada'],
    icon: 'gauge',
    headlineLight: 'A quilometragem do painel é real?',
    headlineBold: 'O scanner lê a memória dos módulos.',
    summary:
      'Leitura eletrônica profunda via porta OBD-II de todos os módulos do veículo para auditar a quilometragem real gravada nas centrais e detectar códigos de falha (DTC) apagados no painel.',
    salesCopy:
      'Adulterar o hodômetro do painel é uma das fraudes mais comuns no mercado de usados, mas a quilometragem real costuma ficar gravada nos módulos de injeção (ECU), câmbio automático (TCU), freios ABS, airbag e chave/BCM. Nosso scanner automotivo compara todos os módulos eletrônicos e revela avarias ocultas antes que elas virem um prejuízo de milhares de reais.',
    idealFor: 'Qualquer compra de veículo seminovo ou usado, especialmente carros modernos, turbo, automáticos ou diesel.',
    checklist: [
      'Cruzamento da quilometragem gravada nos módulos de Motor (ECU), Câmbio (TCU), ABS, Airbag e Painel (IPC)',
      'Varredura de códigos de falha (DTC) presentes e históricos na injeção eletrônica e transmissão',
      'Verificação do funcionamento eletrônico de sensores de ABS, controle de estabilidade e airbags',
      'Detecção de luzes de alerta suprimidas ou recém-apagadas para mascarar defeitos na venda',
    ],
    deliverables: [
      'Relatório de Diagnóstico Eletrônico com status de cada módulo (Motor, Câmbio, ABS, Airbag)',
      'Comparativo técnico de Quilometragem Painel x Módulos Eletrônicos',
    ],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de KM com Scanner de Módulo.',
  },
  {
    id: 'vistoria-bateria-eletricos',
    title: 'Vistoria de Bateria para Elétricos e Híbridos',
    shortTitle: 'Bateria Elétricos e Híbridos',
    kicker: 'NOVA GERAÇÃO · CERTIFICAÇÃO INDEPENDENTE AVILOO',
    badge: 'Certificado AVILOO',
    badgeVariant: 'green',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    icon: 'battery',
    headlineLight: 'Vai comprar um elétrico ou híbrido?',
    headlineBold: 'Teste a saúde real da bateria de tração.',
    summary:
      'Vistoria especializada para veículos elétricos (BEV) e híbridos (HEV/PHEV): mede o Estado de Saúde (SoH) da bateria de alta tensão com certificado independente AVILOO, além de módulos e estrutura.',
    salesCopy:
      'A bateria de tração representa até 50% do valor de um carro elétrico ou híbrido. Na Auto Visão Campinas, utilizamos tecnologia homologada internacionalmente (AVILOO) para auditar a saúde real das células, histórico de recargas rápidas, equilíbrio térmico de tensão e integridade do cofre inferior da bateria contra impactos de solo.',
    idealFor: 'Compradores, vendedores e lojistas de veículos elétricos e híbridos (BYD, GWM, Volvo, Toyota Corolla/RAV4 Hybrid, Porsche, BMW, Tesla, Caoa Chery).',
    checklist: [
      'Diagnóstico do Estado de Saúde (SoH - State of Health) da bateria de alta tensão com certificação AVILOO',
      'Leitura de balanceamento de tensão das células, temperatura interna e histórico de degradação',
      'Inspeção estrutural inferior do pack de baterias (proteção contra raspadas, amassados e infiltrações)',
      'Leitura via scanner dos inversores, motores elétricos, sistema regenerativo e carregador de bordo (OBC)',
      'Análise cautelar completa de chassi, estrutura e histórico veicular (leilão e sinistro)',
    ],
    deliverables: [
      'Certificado Independente de Saúde da Bateria (AVILOO Battery Certificate)',
      'Laudo Estrutural, Histórico e Eletrônico específico para Elétricos e Híbridos',
    ],
    timeEstimate: '45 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria de Bateria para Veículo Elétrico / Híbrido.',
  },
  {
    id: 'vistoria-pesados',
    title: 'Vistoria em Veículos Pesados',
    shortTitle: 'Veículos Pesados',
    kicker: 'CAMINHÕES, ÔNIBUS, CARRETAS E VANS · LINHA PESADA',
    badge: 'Frotas & Pesados',
    badgeVariant: 'dark',
    category: ['pesados', 'transferir', 'empresas'],
    icon: 'truck',
    headlineLight: 'Caminhões, ônibus, carretas e vans:',
    headlineBold: 'rigor técnico para quem move cargas.',
    summary:
      'Vistoria de Transferência (DETRAN-SP), Cautelar e de Frota para caminhões, cavalos mecânicos, semirreboques, carretas, ônibus, micro-ônibus e utilitários pesados.',
    salesCopy:
      'Um veículo pesado parado ou com problema de numeração de chassi/motor/eixo gera prejuízo diário altíssimo. Nossas equipes em Campinas são especializadas na identificação de longarinas de caminhões, plaquetas de cabine, numeração de bloco de motor diesel, implementos rodoviários (ANTT/inmetro), além de pesquisa completa de leilão, sinistro e gravames.',
    idealFor: 'Transportadoras, caminhoneiros autônomos, frotistas, concessionárias de pesados e empresas de ônibus/fretamento.',
    checklist: [
      'Identificação pericial de chassi em longarina, cabine, motor diesel, caixa de câmbio e eixos',
      'Verificação de implementos rodoviários, baús, carrocerias, quinta roda e semirreboques',
      'Análise estrutural de longarinas do chassi (trincas, soldas, empenamentos e alongamentos)',
      'Conferência de itens obrigatórios do CONTRAN/DETRAN (faixas refletivas, tacógrafo, para-choque homologado)',
      'Disponibilidade de atendimento nas unidades preparadas ou in loco para frotas em Campinas e região',
    ],
    deliverables: [
      'Laudo Oficial DETRAN-SP (Transferência/Regularização) ou Laudo Cautelar Pesados',
      'Relatório fotográfico completo de chassi, motor, plaquetas, pneus e implemento',
    ],
    timeEstimate: '40 a 60 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria em Veículo Pesado (Caminhão / Ônibus / Van).',
  },
  {
    id: 'vistoria-financeira',
    title: 'Vistoria para Financeira e Consórcio',
    shortTitle: 'Vistoria para Financeira',
    kicker: 'CRÉDITO AUTOMOTIVO · ALIENAÇÃO E CONSÓRCIOS',
    badge: 'Liberação Rápida',
    badgeVariant: 'dark',
    category: ['empresas', 'comprar'],
    icon: 'building',
    headlineLight: 'Financiamento, consórcio ou refinanciamento:',
    headlineBold: 'laudo ágil para liberar o seu crédito.',
    summary:
      'Vistoria técnica exigida por bancos, financeiras, cooperativas de crédito e administradoras de consórcio para comprovar a existência, conservação e regularidade do bem dado em garantia.',
    salesCopy:
      'Quando você contempla uma carta de consórcio, financia um usado ou faz refinanciamento (crédito com garantia de veículo), a instituição financeira exige um laudo credenciado que ateste o valor de mercado, autenticidade de chassi/motor e ausência de sinistro grave. Emitimos o laudo padronizado com agilidade para destravar o pagamento ao vendedor.',
    idealFor: 'Contemplados em consórcios (todos os bancos e administradoras), compradores via financiamento bancário, cooperativas (Sicoob, Sicredi) e lojas multimarcas.',
    checklist: [
      'Autenticidade de chassi, motor e vidros conforme exigência do banco/consórcio',
      'Avaliação do estado geral de conservação interna, externa e pneus',
      'Verificação estrutural e pesquisa de histórico (leilão, sinistro, roubo/furto)',
      'Registro fotográfico padronizado exigido pelas mesas de crédito e administradoras',
    ],
    deliverables: [
      'Laudo de Avaliação / Constatação homologado para envio imediato ao banco, financeira ou consórcio',
    ],
    timeEstimate: '25 a 35 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e preciso fazer uma Vistoria para Financeira / Consórcio.',
  },
  {
    id: 'vistoria-seguradora',
    title: 'Vistoria para Seguradora (Vistoria Prévia)',
    shortTitle: 'Vistoria para Seguradora',
    kicker: 'SEGURO AUTO · CONTRATAÇÃO E ENDOSSO DE APÓLICE',
    badge: 'Vistoria Prévia',
    badgeVariant: 'dark',
    category: ['empresas', 'comprar'],
    icon: 'shield',
    headlineLight: 'Vai contratar ou renovar o seguro?',
    headlineBold: 'Vistoria prévia rápida e sem burocracia.',
    summary:
      'Inspeção prévia solicitada por seguradoras e corretores para aceitação de risco, contratação de seguro novo, troca de veículo (endosso) ou inclusão de coberturas.',
    salesCopy:
      'Garanta a aprovação da sua apólice sem atrasos. Registramos com precisão chassi, motor, quilometragem, estado da lataria, vidros, faróis, pneus e acessórios instalados (multimídia, rodas, blindagem, kit gás), documentando eventuais avarias pré-existentes com transparência técnica.',
    idealFor: 'Segurados, corretores de seguros em Campinas e frotas empresariais em processo de cotação ou renovação.',
    checklist: [
      'Conferência de chassi, motor, placa e numeração dos vidros (para cobertura de vidros)',
      'Mapeamento de estado da carroceria, pintura, para-choques, faróis, lanternas e retrovisores',
      'Registro de quilometragem, pneus (estepe incluso) e acessórios de fábrica ou instalados',
      'Fotos padronizadas de alta definição conforme protocolo das companhias seguradoras',
    ],
    deliverables: [
      'Relatório de Vistoria Prévia com dossiê fotográfico completo para a seguradora/corretor',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Prévia para Seguradora.',
  },
  {
    id: 'vistoria-protecao-automotiva',
    title: 'Vistoria para Proteção Automotiva',
    shortTitle: 'Proteção Automotiva',
    kicker: 'ASSOCIAÇÕES, COOPERATIVAS E BENEFÍCIOS VEICULARES',
    badge: 'Adesão & Entrada',
    badgeVariant: 'red',
    category: ['empresas'],
    icon: 'shield',
    headlineLight: 'Adesão segura e auditável para',
    headlineBold: 'associações de proteção veicular.',
    summary:
      'Laudo técnico de entrada, constatação e reativação para associações de proteção automotiva, clubes de benefícios e cooperativas em Campinas e região.',
    salesCopy:
      'Evite fraudes de sinistro pré-existente e proteja a saúde financeira da associação e do associado. Realizamos a vistoria completa de entrada com fotos datadas e geolocalizadas, conferência de chassi/motor, estado de pneus, vidros, funcionamento básico e registro de avarias anteriores à adesão.',
    idealFor: 'Associações de proteção veicular, consultores regionais e motoristas de aplicativo/particulares aderindo à proteção automotiva.',
    checklist: [
      'Identificação completa do veículo (chassi, motor, placa Mercosul, CRLV e hodômetro)',
      'Registro fotográfico auditável em 360º com data, hora e identificação da unidade',
      'Inspeção de avarias pré-existentes em lataria, vidros, lanternas, faróis e interior',
      'Verificação do estado de conservação dos pneus e equipamentos obrigatórios',
    ],
    deliverables: [
      'Laudo de Adesão / Proteção Veicular em PDF + Galeria Fotográfica Auditável',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria para Proteção Automotiva.',
  },
  {
    id: 'vistoria-patio-publico',
    title: 'Vistoria em Pátio Público',
    shortTitle: 'Vistoria em Pátio Público',
    kicker: 'LIBERAÇÃO ADMINISTRATIVA · PERÍCIA EXTERNA E PÁTIOS',
    badge: 'Atendimento em Pátio',
    badgeVariant: 'dark',
    category: ['transferir', 'empresas'],
    icon: 'pin',
    headlineLight: 'Veículo recolhido em pátio público?',
    headlineBold: 'Vistoria técnica para liberação e regularização.',
    summary:
      'Realização de vistoria técnica oficial para veículos apreendidos ou recolhidos em pátios públicos (EMDEC, DER, DETRAN, PRF/PM) que exigem laudo ECV para desbloqueio ou liberação.',
    salesCopy:
      'Quando um veículo é recolhido ao pátio por pendência documental, infração ou bloqueio administrativo, o órgão de trânsito frequentemente exige uma vistoria ECV credenciada para atestar a regularidade de chassi, motor e itens de segurança antes da liberação ou baixa de bloqueio. Nossa equipe orienta todo o trâmite em Campinas para você retirar o veículo com rapidez.',
    idealFor: 'Proprietários, despachantes, advogados, seguradoras e financeiras com veículos retidos em pátios públicos de Campinas e região.',
    checklist: [
      'Orientação prévia sobre ofícios, taxas e requisitos exigidos pelo DETRAN-SP / órgão gestor do pátio',
      'Coleta e validação de chassi, motor, agregados e placas segundo as normas vigentes',
      'Verificação dos itens apontados no auto de recolhimento ou termo de apreensão',
      'Emissão do laudo credenciado para protocolo de desbloqueio e liberação administrativa',
    ],
    deliverables: [
      'Laudo Oficial ECV Credenciada DETRAN-SP válido para processos de liberação de pátio e desbloqueio',
    ],
    timeEstimate: 'Conforme agendamento',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e preciso de informações/agendamento para Vistoria em Pátio Público.',
  },
  {
    id: 'vistoria-infracao-transito',
    title: 'Vistoria de Infração de Trânsito',
    shortTitle: 'Infração de Trânsito',
    kicker: 'REGULARIZAÇÃO DETRAN-SP · BAIXA DE BLOQUEIO E RETENÇÃO',
    badge: 'Regularização Oficial',
    badgeVariant: 'dark',
    category: ['transferir'],
    icon: 'shield',
    headlineLight: 'Documento retido ou bloqueio por infração?',
    headlineBold: 'Regularize o veículo junto ao DETRAN-SP.',
    summary:
      'Vistoria oficial exigida pelo DETRAN-SP quando o veículo sofre autuação com retenção para regularização (pneus gastos, iluminação, película insulfilm, escapamento, suspensão, recibo vencido ou sinistro).',
    salesCopy:
      'Recebeu uma autuação ou teve o licenciamento bloqueado até sanar uma irregularidade? Após corrigir o item apontado na infração, traga o veículo a qualquer uma das nossas 5 unidades em Campinas. Emitimos o laudo ECV homologado diretamente no sistema do DETRAN-SP para dar baixa na restrição e liberar o documento do seu veículo.',
    idealFor: 'Motoristas que precisam dar baixa em bloqueio administrativo, infração de equipamento obrigatório, caracterização ou recibo vencido.',
    checklist: [
      'Conferência do item específico que gerou a autuação (iluminação, pneus, vidros/películas, escapamento, suspensão, cor)',
      'Inspeção completa de todos os equipamentos obrigatórios de segurança exigidos pelo CONTRAN',
      'Validação de chassi, motor e placas no sistema oficial e-CRVsp do DETRAN-SP',
      'Orientação passo a passo para protocolo da baixa do bloqueio após a aprovação do laudo',
    ],
    deliverables: [
      'Laudo Oficial ECV de Regularização transmitido eletronicamente ao DETRAN-SP',
    ],
    timeEstimate: '20 a 30 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e preciso fazer uma Vistoria de Infração de Trânsito / Regularização.',
  },
  {
    id: 'vistoria-premium',
    title: 'Vistoria Premium (Veículos Acima de R$ 200 mil)',
    shortTitle: 'Vistoria Premium',
    kicker: 'ALTO PADRÃO, LUXO E SUPERESPORTIVOS · ANÁLISE COMPLETA',
    badge: 'Acima de R$ 200 mil',
    badgeVariant: 'red',
    category: ['destaque', 'comprar', 'avancada'],
    featured: true,
    icon: 'star',
    headlineLight: 'Carro de alto valor pede',
    headlineBold: 'olhar cirúrgico do motor à estrutura.',
    summary:
      'A inspeção mais rigorosa do mercado para veículos premium (acima de R$ 200 mil) e de nicho/coleção (Exclusive acima de R$ 400 mil): une Cautelar + Pintura + Scanner de Módulos + Avaliação Mecânica Completa.',
    salesCopy:
      'Em veículos de luxo, blindados, importados ou esportivos, qualquer reparo oculto em motor, câmbio automatizado, suspensão pneumática, módulos eletrônicos ou pintura especial custa dezenas de milhares de reais. A Vistoria Premium entrega um dossiê completo: análise estrutural, pintura peça a peça em µm, leitura profunda por scanner, avaliação mecânica detalhada e histórico completo.',
    idealFor: 'Compradores e vendedores de veículos premium, importados, SUVs de luxo, blindados e esportivos acima de R$ 200 mil (e modalidade Exclusive in loco para veículos acima de R$ 400 mil).',
    checklist: [
      'Avaliação Mecânica Completa: motor, câmbio, arrefecimento, freios, direção e conjunto de suspensão',
      'Leitura eletrônica completa via Scanner de alta precisão em todas as centrais e auditoria de KM real',
      'Medição micrométrica de pintura peça a peça (detecção de retoques estéticos e desmontagens)',
      'Análise estrutural minuciosa (longarinas, colunas, pontos de solda laser/alumínio e blindagem)',
      'Pesquisa Veicular Completa em bases nacionais + Dossiê fotográfico de alta resolução',
    ],
    deliverables: [
      'Dossiê Executivo Vistoria Premium (Estrutura + Pintura + Scanner + Laudo Mecânico + Histórico)',
      'Atendimento prioritário nas unidades de Campinas ou modalidade Exclusive in loco (sob consulta)',
    ],
    timeEstimate: '60 a 90 minutos',
    whatsappMsg:
      'Olá! Vim pelo site da Auto Visão Campinas e quero agendar uma Vistoria Premium (veículo acima de R$ 200 mil).',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Onde ficam as 5 lojas da Auto Visão em Campinas e qual é a mais próxima de mim?',
    a: 'Temos 5 unidades credenciadas pelo DETRAN-SP cobrindo todas as regiões de Campinas: 1) Taquaral (Av. Imperatriz Leopoldina, 38 — próximo ao Balão do Taquaral), 2) Centro / Castelo (Av. Andrade Neves, 1160 — em frente à Discamp), 3) Ponte Preta / Abolição (Rua da Abolição, 2036 — em frente ao Extra Abolição), 4) Campos Elíseos (Rua Domício Pacheco e Silva, 318 — em frente à TOP Mais Veículos) e 5) Parque Industrial / Amoreiras (Av. das Amoreiras, 2210 — ao lado do Bradesco). Você pode clicar em Maps ou Waze em qualquer loja acima ou chamar no WhatsApp (19) 99224-8383.',
  },
  {
    q: 'Qual loja da Auto Visão em Campinas abre aos sábados à tarde (Plantão)?',
    a: 'A nossa Unidade 3 — Ponte Preta / Abolição (Rua da Abolição, 2036, em frente ao Extra Abolição) é a Unidade de Plantão em Campinas e atende aos sábados das 08h às 16h sem fechar para almoço! As outras 4 unidades (Taquaral, Centro, Campos Elíseos e Parque Industrial) funcionam aos sábados das 08h às 12h.',
  },
  {
    q: 'Qual a diferença entre Vistoria do DETRAN (Transferência), Vistoria Cautelar e Nossa Vistoria 360º®?',
    a: 'A Vistoria do DETRAN (Transferência) é o laudo oficial exigido por lei para passar o documento do veículo para o seu nome ou mudar de município. A Vistoria Cautelar é uma perícia preventiva antes de comprar ou vender um usado: analisa longarinas, colunas, chassi, motor e pesquisa se o carro tem leilão, sinistro, roubo/furto ou débitos. Já a Nossa Vistoria 360º® é exclusiva da Auto Visão e avalia +180 itens, unindo tudo da Cautelar + medição de pintura peça a peça + vídeo de funcionamento no WhatsApp (Plus) + leitura eletrônica de KM e módulos por scanner e Certificado do Carro (Max).',
  },
  {
    q: 'Posso fazer a Vistoria Cautelar e a Vistoria de Transferência (DETRAN) no mesmo atendimento?',
    a: 'Sim! Com o nosso Combo Cautelar + Transferência, você avalia toda a estrutura e o histórico do veículo para comprar com segurança e já sai com o laudo oficial do DETRAN-SP pronto para transferir o documento — tudo em uma única visita e com condição especial.',
  },
  {
    q: 'Como funciona a Vistoria de KM com Scanner de Módulo? Ela descobre KM voltado?',
    a: 'Sim! Conectamos um scanner automotivo profissional na porta OBD-II do veículo para ler diretamente a memória das centrais eletrônicas (módulo de injeção/motor, câmbio automático, freios ABS, airbag e carroceria). Comparamos a quilometragem registrada internamente nos módulos com a exibida no hodômetro do painel, além de identificar falhas eletrônicas ocultas.',
  },
  {
    q: 'Vocês fazem vistoria em carros elétricos e híbridos (BYD, GWM, Volvo, Toyota, etc.)?',
    a: 'Sim! Somos pioneiros na Vistoria de Bateria para Veículos Elétricos e Híbridos com certificação independente internacional AVILOO. Avaliamos o Estado de Saúde (SoH) real da bateria de alta tensão, equilíbrio das células, módulos eletrônicos, proteção inferior do pack de baterias e toda a parte estrutural e de histórico.',
  },
  {
    q: 'Quais documentos preciso levar para fazer a vistoria em Campinas?',
    a: 'Basta levar o documento do veículo (CRLV-e digital no aplicativo Carteira Digital de Trânsito ou impresso / CRV) e um documento oficial com foto de quem estiver conduzindo o veículo (CNH ou RG). Para serviços específicos como Pátio Público ou Infração de Trânsito, nossa central no WhatsApp (19) 99224-8383 orienta se houver algum guia adicional.',
  },
  {
    q: 'A Auto Visão atende empresas, frotas, caminhões, financeiras, seguradoras e proteção veicular?',
    a: 'Sim! Atendemos tanto pessoas físicas quanto empresas: fazemos Vistoria em Veículos Pesados (caminhões, ônibus, carretas e vans), Vistoria para Financeira e Consórcios, Vistoria Prévia para Seguradoras, Vistoria para Associações de Proteção Automotiva, Desmobilização/Inventário de Frota e Vistoria em Pátio Público.',
  },
];

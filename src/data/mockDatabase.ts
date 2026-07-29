import {
  CompanyInfo,
  Invoice,
  LeadCustomer,
  EnterpriseDocument,
  Employee,
  InventoryItem,
  SensorTelemetry,
  AgentInfo,
  AutopilotLog,
  BiMetrics
} from '../types';

export const initialCompany: CompanyInfo = {
  id: 'comp_001',
  name: 'VITRONIS TECHNOLOGIES GROUP S.A.',
  taxId: 'AO509876543',
  email: 'geral@vitronis.com',
  phone: '+244 923 000 111',
  address: 'Avenida 4 de Fevereiro, nº 180, Edifício Vitronis Tower, Luanda, Angola',
  currency: 'AOA (Kz)',
  sector: 'Sistemas Autónomos, Robótica & Inteligência Artificial Empresarial'
};

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_101',
    number: 'FT 2026/00142',
    clientName: 'Sonangol Logística & Tecnologias',
    clientTaxId: 'AO501234567',
    date: '2026-07-20',
    dueDate: '2026-08-19',
    items: [
      { description: 'Licença Vitronis Nexus OS Enterprise (Trimestral)', quantity: 1, unitPrice: 12500000, taxRate: 14, total: 12500000 },
      { description: 'Serviço de Integração Autopilot & Agentes IA', quantity: 1, unitPrice: 3500000, taxRate: 14, total: 3500000 }
    ],
    subtotal: 16000000,
    taxTotal: 2240000,
    total: 18240000,
    status: 'issued',
    category: 'Venda de Software & Serviços',
    digitalSignatureHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'inv_102',
    number: 'FT 2026/00143',
    clientName: 'Empresa Nacional de Iluminação & Telecomunicação',
    clientTaxId: 'AO508765432',
    date: '2026-07-22',
    dueDate: '2026-08-21',
    items: [
      { description: 'Módulo IoT Engenharia + Módulo de Manutenção Preditiva', quantity: 2, unitPrice: 8900000, taxRate: 14, total: 17800000 }
    ],
    subtotal: 17800000,
    taxTotal: 2492000,
    total: 20292000,
    status: 'paid',
    category: 'Engenharia & IoT',
    digitalSignatureHash: 'sha256_8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'inv_103',
    number: 'FT 2026/00144',
    clientName: 'Banco de Comércio & Indústria',
    clientTaxId: 'AO509112233',
    date: '2026-06-15',
    dueDate: '2026-07-15',
    items: [
      { description: 'Consultoria de Automação RAG & Módulo Financeiro', quantity: 1, unitPrice: 7200000, taxRate: 14, total: 7200000 }
    ],
    subtotal: 7200000,
    taxTotal: 1008000,
    total: 8208000,
    status: 'overdue',
    category: 'Consultoria IA',
    digitalSignatureHash: 'sha256_11a8c04e2239328221c56ed0064560416dfb7a9ef3875323a6771092eb9156ef'
  }
];

export const initialLeads: LeadCustomer[] = [
  {
    id: 'lead_01',
    name: 'Carlos Mendonça',
    company: 'Sintra Pharmaceuticals',
    email: 'carlos.m@sintrapharma.com',
    phone: '+351 912 345 678',
    value: 45000,
    stage: 'proposal',
    score: 92,
    aiInsight: 'Apresenta elevada probabilidade de fecho devido a imperativos de conformidade sanitária e automação documental.',
    lastContact: '2026-07-28'
  },
  {
    id: 'lead_02',
    name: 'Ana Sofia Rocha',
    company: 'Porto Maritime Logistics',
    email: 'as.rocha@portomaritime.pt',
    phone: '+351 933 888 777',
    value: 78000,
    stage: 'negotiation',
    score: 88,
    aiInsight: 'Interessada no rastreio IoT de sensores de carga e faturação automática via WhatsApp.',
    lastContact: '2026-07-27'
  },
  {
    id: 'lead_03',
    name: 'Roberto Valente',
    company: 'Energy Grid Systems',
    email: 'r.valente@energygrid.com',
    phone: '+351 961 112 233',
    value: 120000,
    stage: 'lead',
    score: 65,
    aiInsight: 'Lead em fase inicial. Agente Comercial recomendou envio do Whitepaper de Manutenção Preditiva com IA.',
    lastContact: '2026-07-25'
  }
];

export const initialDocuments: EnterpriseDocument[] = [
  {
    id: 'doc_pnap_01',
    title: 'Ofício PNAP-AO – Disponibilização para Avaliação Institucional',
    type: 'oficio_estatal',
    subject: 'PNAP-AO – Disponibilização para Avaliação Institucional',
    refNumber: 'VIT/OF/2026/0204',
    recipientEntity: 'Serviço Penitenciário de Angola',
    recipientDepartment: 'Direcção Nacional das Telecomunicações e Tecnologias de Informação',
    recipientTitle: 'Exmo. Director Nacional da TTI do SP/MININT-Angola',
    recipientSubTitle: '- Subcomissário Prisional Mauro Inácio Fragoso Almeida',
    recipientContact: 'Avenida 11 de Novembro, Rua Nginga Mbande, Viana. Luanda - Angola | (+244) 930 985 561 | gcii@sp.gov.ao | https://sp.gov.ao/quemsomos',
    author: 'Isabel Truman - Administradora Geral da Vitronis',
    signatoryName: 'Isabel Truman',
    signatoryRole: 'A Administradora-Geral',
    createdAt: '2026-08-03',
    version: '1.0',
    status: 'signed',
    content: `Exmo. Senhor Director,

Decorrido cerca de um ano desde a nossa última abordagem, vimos informar que, conforme então assumido, a VITRONIS – Robótica e Controlo, Lda. transferiu a sua sede para Luanda (Boa Vida) e a responsabilidade institucional do PNAP-AO passou da MSAEN para uma empresa dedicada exclusivamente à engenharia tecnológica e soluções de missão crítica.

Neste período, aproveitámos para incorporar IA para assistência preditiva, portal público para familiares e advogados, bem como módulo para a PGR junto dos estabelecimentos penitenciários, com funcionamento totalmente offline, desktop e móvel (PWA) e outras capacidades de elevada relevância a serem comprovadas em testes no Estabelecimento Penitenciário de Viana, como antes sugerimos.

Em caso de exiguidade financeira, o custo poderá ser suportado opcionalmente por financiamento externo, com base em contactos por nós já avançados, ficando a Direcção-Geral responsável apenas com os testes em período não superior a 1 semana e eventual implementação.

Solicitamos a gentileza de scanear o QR Code acima e testar livremente a plataforma, utilizando as credenciais persistidas na janela de login.`,
    hash: 'sha256_e8f90142b87a9091c45610d9842a1256fe9031cba09e123490fae10982736412',
    signers: [
      { name: 'Isabel Truman', role: 'A Administradora-Geral da Vitronis', email: 'isabel.truman@vitronis.com', signedAt: '2026-08-03 09:15', status: 'signed' }
    ]
  },
  {
    id: 'doc_01',
    title: 'Ofício de Solicitação de Licenciamento Tecnológico e Infraestrutura IoT',
    type: 'oficio_estatal',
    subject: 'Solicitação de Autorização para Implantação de Rede IoT e Telemetria Industrial',
    refNumber: 'VIT/OF/2026/0142',
    targetRefNumber: 'MTTICS/DN/089/2026',
    recipientEntity: 'Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MTTICS)',
    recipientDepartment: 'Direcção Nacional de Telecomunicações e Tecnologias de Informação',
    recipientTitle: 'Exmo.(a) Senhor(a) Director(a) Nacional',
    recipientContact: 'Avenida 4 de Fevereiro, Luanda, Angola • contacto@mttics.gov.ao',
    author: 'Isabel Truman - Administradora Geral da Vitronis',
    signatoryName: 'Isabel Truman',
    signatoryRole: 'Administradora Geral da Vitronis',
    createdAt: '2026-07-25',
    version: '1.0',
    status: 'signed',
    content: `VITRONIS TECHNOLOGIES GROUP S.A.
NIF: AO509876543 | Edifício Vitronis Tower, Luanda - Angola
Contactos: geral@vitronis.com | +244 923 000 111

N/Refª: VIT/OF/2026/0142
V/Refª: MTTICS/DN/089/2026
Data: 25 de Julho de 2026

À
Direcção Nacional de Telecomunicações e Tecnologias de Informação
MINISTÉRIO DAS TELECOMUNICAÇÕES, TECNOLOGIAS DE INFORMAÇÃO E COMUNICAÇÃO SOCIAL (MTTICS)
Luanda - República de Angola

ASSUNTO: Solicitação de Autorização de Operação para Módulos de Telemetria e Sensores IoT

Exmo.(a) Senhor(a) Director(a) Nacional,

1. Cumprimentando cordialmente V. Exa., serve o presente Ofício para expor e solicitar o seguinte:

2. A Vitronis Technologies Group S.A., sociedade comercial de direito angolano, encontra-se a concluir a implementação da sua plataforma nacional de telemetria preditiva com inteligência artificial para o sector industrial.

3. Para o efeito, vimos por este meio requerer formalmente a homologação da licença de operação para a frequência dos novos gateways de sensores IoT (Modelo VIT-IOT-MOD-01) na província de Luanda.

4. Anexam-se ao presente documento as especificações técnicas, garantias de segurança cibernética e plano de contingência operacional.

Cientes da atenção que o assunto merecerá da parte de V. Exa., apresentamos os nossos mais elevados protestos de auto estima e consideração.

Atenciosamente,

________________________________________________
ISABEL TRUMAN
Administradora Geral da Vitronis
Vitronis Technologies Group S.A.

[SELO DIGITAL & RASTREABILIDADE LEGAL QR CODE]
Hash SHA-256: sha256_7a3d90f231e544a0e980a319520b7842a22f3e8f80456c21e6462719c2980f74
Certificado Digital de Origem ID: AO-CERT-LEGAL-VIT-2026-908`,
    hash: 'sha256_7a3d90f231e544a0e980a319520b7842a22f3e8f80456c21e6462719c2980f74',
    signers: [
      { name: 'Isabel Truman', role: 'Administradora Geral da Vitronis', email: 'isabel.truman@vitronis.com', signedAt: '2026-07-25 14:32', status: 'signed' }
    ]
  },
  {
    id: 'doc_02',
    title: 'Contrato de Prestação de Serviços de IA Autónomos',
    type: 'contract',
    subject: 'Fornecimento de Licença Vitronis OS e Agentes C-Suite',
    refNumber: 'VIT/CT/2026/0088',
    recipientEntity: 'Sonangol Logística & Tecnologias',
    author: 'Isabel Truman - Administradora Geral da Vitronis',
    signatoryName: 'Isabel Truman',
    signatoryRole: 'Administradora Geral da Vitronis',
    createdAt: '2026-07-01',
    version: '1.0',
    status: 'signed',
    content: `CONTRATO DE LICENCIAMENTO E SERVIÇOS DE IA EXECUTIVA

Entre a VITRONIS TECHNOLOGIES GROUP S.A., representada pela Sra. Isabel Truman, Administradora Geral da Vitronis, e a Sonangol Logística & Tecnologias.

Valor do Contrato: Kz 18.240.000,00 (Dezoito Milhões e Duzentos e Quarenta Mil Kwanzas).

Cláusula 1ª: O licenciamento do Vitronis Nexus AI Enterprise OS inclui operação em modo Autopilot com suporte em moeda nacional Kwanza (AOA).
Cláusula 2ª: A assinatura digital abaixo pela Sra. Isabel Truman, Administradora Geral, garante a total validade legal do instrumento contratual.`,
    hash: 'sha256_b21374b901a1e45938f729e1c9533722e03299c852441c2c8f8778e228a02c9a',
    signers: [
      { name: 'Isabel Truman', role: 'Administradora Geral da Vitronis', email: 'isabel.truman@vitronis.com', signedAt: '2026-07-01 09:15', status: 'signed' }
    ]
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp_01',
    name: 'Dra. Beatriz Siqueira',
    role: 'Lead AI & Machine Learning Scientist',
    department: 'Engenharia & IA',
    email: 'b.siqueira@vitronis.com',
    salary: 2800000,
    contractType: 'Sem Termo',
    status: 'active',
    okrScore: 96,
    performanceNotes: 'Excelente desempenho no desenvolvimento do motor RAG e otimização de agentes serverless.'
  },
  {
    id: 'emp_02',
    name: 'Eng. Miguel Alcantara',
    role: 'Diretor de Operações Robóticas & IoT',
    department: 'Engenharia',
    email: 'm.alcantara@vitronis.com',
    salary: 2500000,
    contractType: 'Sem Termo',
    status: 'active',
    okrScore: 91,
    performanceNotes: 'Concluiu a integração dos sensores Modbus e protocolos ESP32 com sucesso.'
  },
  {
    id: 'emp_03',
    name: 'Inês Carvalhal',
    role: 'Gestora de Contas Enterprise (CRM)',
    department: 'Comercial',
    email: 'i.carvalhal@vitronis.com',
    salary: 1900000,
    contractType: 'Sem Termo',
    status: 'active',
    okrScore: 89,
    performanceNotes: 'Superou a meta de novos contratos enterprise em 22% no corrente trimestre.'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv_item_01',
    sku: 'VIT-IOT-MOD-01',
    name: 'Módulo Gateway IoT Industrial ESP32-WROOM',
    category: 'Hardware IoT',
    quantity: 142,
    minQuantity: 30,
    unitPrice: 185000,
    warehouseLocation: 'Armazém Principal - Aisle B4',
    status: 'optimal',
    qrCode: 'QR_VIT_IOT_MOD_01_PROD'
  },
  {
    id: 'inv_item_02',
    sku: 'VIT-SEN-TEMP-PRO',
    name: 'Sensor Digital de Temperatura & Vibração Preditiva',
    category: 'Sensores Industriais',
    quantity: 18,
    minQuantity: 25,
    unitPrice: 320000,
    warehouseLocation: 'Armazém Principal - Aisle C1',
    status: 'low_stock',
    qrCode: 'QR_VIT_SEN_TEMP_PRO_LOW'
  },
  {
    id: 'inv_item_03',
    sku: 'VIT-SRV-EDGE-AI',
    name: 'Servidor Edge AI Industrial (NVIDIA Jetson Embedded)',
    category: 'Servidores Edge',
    quantity: 8,
    minQuantity: 5,
    unitPrice: 2450000,
    warehouseLocation: 'Armazém Seguro - Safe Room 02',
    status: 'optimal',
    qrCode: 'QR_VIT_SRV_EDGE_AI_SAFE'
  }
];

export const initialSensors: SensorTelemetry[] = [
  {
    sensorId: 'SEN-IND-001',
    name: 'Linha de Montagem Robótica #1 - Vibração',
    location: 'Fábrica Luanda - Setor A',
    temperature: 42.5,
    pressure: 1.02,
    vibration: 0.18,
    status: 'normal',
    lastUpdated: 'Agora mesmo'
  },
  {
    sensorId: 'SEN-IND-002',
    name: 'Compressor Central de Ar Comprimido',
    location: 'Fábrica Luanda - Casa das Máquinas',
    temperature: 78.2,
    pressure: 6.85,
    vibration: 0.84,
    status: 'warning',
    lastUpdated: 'Há 1 min'
  },
  {
    sensorId: 'SEN-IND-003',
    name: 'Servidor Edge RAG & GPU Cluster',
    location: 'Data Center Luanda Tower',
    temperature: 31.0,
    pressure: 1.00,
    vibration: 0.02,
    status: 'normal',
    lastUpdated: 'Agora mesmo'
  }
];

export const initialAgents: AgentInfo[] = [
  { id: 'ag_01', name: 'Agente Executivo C-Suite', role: 'Visão Estratégica & Decisão', specialty: 'Análise Holística & KPI Central', status: 'idle', avatarIcon: 'Crown', tasksCompleted: 142 },
  { id: 'ag_02', name: 'Agente Financeiro ERP', role: 'Controladoria & Tesouraria', specialty: 'Fluxo de Caixa, Cobranças, DRE', status: 'idle', avatarIcon: 'DollarSign', tasksCompleted: 389 },
  { id: 'ag_03', name: 'Agente Jurídico & Compliance', role: 'Gestão Contratual & RGPD', specialty: 'Revisão Contratual, Assinatura, Regulamentos', status: 'idle', avatarIcon: 'Scale', tasksCompleted: 215 },
  { id: 'ag_04', name: 'Agente Comercial & CRM', role: 'Automação de Vendas & Inbound', specialty: 'Lead Scoring, Propostas, Pipeline', status: 'idle', avatarIcon: 'TrendingUp', tasksCompleted: 310 },
  { id: 'ag_05', name: 'Agente Documental & OCR', role: 'Processamento de Documentos', specialty: 'OCR, Geração de PDF, Selo QR', status: 'idle', avatarIcon: 'FileText', tasksCompleted: 540 },
  { id: 'ag_06', name: 'Agente Recursos Humanos', role: 'Gestão de Talentos & OKRs', specialty: 'Avaliador de Performance, Recrutamento', status: 'idle', avatarIcon: 'Users', tasksCompleted: 118 },
  { id: 'ag_07', name: 'Agente Estoque & Compras', role: 'Cadeia de Suprimentos', specialty: 'Reposição Automática, ABC, RFQ', status: 'idle', avatarIcon: 'Package', tasksCompleted: 276 },
  { id: 'ag_08', name: 'Agente Engenharia & IoT', role: 'Telemetria & Robótica', specialty: 'Manutenção Preditiva, Sensores PLC', status: 'idle', avatarIcon: 'Cpu', tasksCompleted: 420 },
  { id: 'ag_09', name: 'Agente BI Preditivo', role: 'Analytics & Forecasting', specialty: 'Projeção de Receitas, Monte Carlo', status: 'idle', avatarIcon: 'BarChart3', tasksCompleted: 195 },
  { id: 'ag_10', name: 'Agente RPA Automação', role: 'Workflows & Processos', specialty: 'BPM, Webhooks, Disparo de Tarefas', status: 'idle', avatarIcon: 'Zap', tasksCompleted: 612 }
];

export const initialAutopilotLogs: AutopilotLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-07-29 09:45:12',
    agentName: 'Agente Financeiro ERP',
    category: 'Finance',
    message: 'Identificada fatura overdue FT 2026/00144 (Kz 8.208.000,00). Enviado lembrete de cortesia com QR Code de pagamento via email.',
    severity: 'warning',
    automatedActionTaken: 'Notificação automática e emissão de segunda via enviada ao cliente.'
  },
  {
    id: 'log_002',
    timestamp: '2026-07-29 09:30:00',
    agentName: 'Agente Engenharia & IoT',
    category: 'Engineering',
    message: 'Sensor SEN-IND-002 reportou elevação de temperatura (78.2ºC) e vibração. Agendada inspeção preventiva.',
    severity: 'warning',
    automatedActionTaken: 'Ordem de serviço gerada no ERP para equipa de manutenção.'
  },
  {
    id: 'log_003',
    timestamp: '2026-07-29 09:00:05',
    agentName: 'Agente Comercial & CRM',
    category: 'Sales',
    message: 'Oportunidade Sonangol Logística atingiu Lead Score 92. Minuta de contrato assinada por Isabel Truman.',
    severity: 'success',
    automatedActionTaken: 'Oportunidade promovida para a fase de Proposta com sucesso.'
  },
  {
    id: 'log_004',
    timestamp: '2026-07-29 08:00:00',
    agentName: 'Agente Executivo C-Suite',
    category: 'Executive',
    message: 'Relatório Matinal Autônomo concluído. Previsão de caixa para os próximos 30 dias: +Kz 64.300.000,00.',
    severity: 'info',
    automatedActionTaken: 'Relatório consolidado publicado no painel BI.'
  }
];

export const initialBiMetrics: BiMetrics = {
  mrr: 42500000,
  arr: 510000000,
  netProfitMargin: 38.4,
  totalRevenueYtd: 312400000,
  monthlyExpenses: 26200000,
  cashFlowForecast30d: 64300000,
  openInvoicesTotal: 28536000,
  activeContractsCount: 18
};

export type ModuleType =
  | 'dashboard'
  | 'finance'
  | 'crm'
  | 'documents'
  | 'hr'
  | 'inventory'
  | 'engineering'
  | 'bi'
  | 'ai_agents';

export interface CompanyInfo {
  id: string;
  name: string;
  taxId: string; // NIF / CNPJ
  email: string;
  phone: string;
  address: string;
  currency: string;
  sector: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientTaxId: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number; taxRate: number; total: number }[];
  subtotal: number;
  taxTotal: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'canceled';
  digitalSignatureHash?: string;
  qrCodeUrl?: string;
  category: string;
}

export interface LeadCustomer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: number; // 0 to 100
  aiInsight?: string;
  lastContact: string;
}

export interface EnterpriseDocument {
  id: string;
  title: string;
  type: 'contract' | 'report' | 'invoice' | 'policy' | 'memo' | 'oficio_estatal' | 'carta_formal' | 'parecer' | 'proposta';
  subject?: string;
  refNumber?: string; // N/Refª da Vitronis (ex: VIT/OF/2026/0142)
  targetRefNumber?: string; // V/Refª (Sua Referência da Instituição)
  recipientEntity?: string; // Nome da Instituição Estatal ou Empresa
  recipientDepartment?: string; // Direcção / Departamento
  recipientTitle?: string; // Tratamento / Cargo (ex: Exmo. Director Nacional da TTI do SP/MININT-Angola)
  recipientSubTitle?: string; // Nome / Patente (ex: - Subcomissário Prisional Mauro Inácio Fragoso Almeida)
  recipientContact?: string; // Contactos, Endereço e Email do Destinatário
  author: string;
  signatoryName?: string; // Isabel Truman
  signatoryRole?: string; // Administradora Geral da Vitronis
  createdAt: string;
  version: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'archived';
  content: string;
  draftIdea?: string; // Rascunho / Ideia da mensagem
  hash: string;
  qrCodeData?: string;
  legalTraceabilityHash?: string;
  relatedDocId?: string; // ID de documento relacionado
  relatedDocTitle?: string;
  signers: { name: string; role: string; email: string; signedAt?: string; status: 'pending' | 'signed' }[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  salary: number;
  contractType: string;
  status: 'active' | 'vacation' | 'onboarding' | 'offboarding';
  okrScore: number;
  performanceNotes?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  warehouseLocation: string;
  status: 'optimal' | 'low_stock' | 'out_of_stock' | 'reordering';
  qrCode: string;
}

export interface SensorTelemetry {
  sensorId: string;
  name: string;
  location: string;
  temperature: number;
  pressure: number;
  vibration: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'idle' | 'analyzing' | 'executing' | 'completed';
  lastAction?: string;
  avatarIcon: string;
  tasksCompleted: number;
}

export interface AutopilotLog {
  id: string;
  timestamp: string;
  agentName: string;
  category: 'Finance' | 'Legal' | 'HR' | 'Sales' | 'Inventory' | 'Engineering' | 'Executive';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'action_required';
  automatedActionTaken?: string;
}

export interface BiMetrics {
  mrr: number;
  arr: number;
  netProfitMargin: number;
  totalRevenueYtd: number;
  monthlyExpenses: number;
  cashFlowForecast30d: number;
  openInvoicesTotal: number;
  activeContractsCount: number;
}

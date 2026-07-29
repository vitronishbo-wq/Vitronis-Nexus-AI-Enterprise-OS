import React, { useState, useEffect } from 'react';
import { ModuleType, Invoice, LeadCustomer, EnterpriseDocument, Employee, InventoryItem, SensorTelemetry, AgentInfo, AutopilotLog, BiMetrics, CompanyInfo } from './types';
import {
  initialCompany,
  initialInvoices,
  initialLeads,
  initialDocuments,
  initialEmployees,
  initialInventory,
  initialSensors,
  initialAgents,
  initialAutopilotLogs,
  initialBiMetrics
} from './data/mockDatabase';
import {
  seedInitialFirestoreData,
  subscribeCompany,
  subscribeInvoices,
  subscribeLeads,
  subscribeDocuments,
  subscribeEmployees,
  subscribeInventory,
  subscribeSensors,
  subscribeAgents,
  subscribeAutopilotLogs,
  subscribeBiMetrics,
  addInvoiceToFirestore,
  addLeadToFirestore,
  updateLeadStageInFirestore,
  addDocumentToFirestore,
  addEmployeeToFirestore,
  addInventoryItemToFirestore,
  addAutopilotLogToFirestore
} from './lib/firestoreService';

import { Navigation } from './components/Navigation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { FinanceModule } from './components/FinanceModule';
import { CRMModule } from './components/CRMModule';
import { DocumentModule } from './components/DocumentModule';
import { HRModule } from './components/HRModule';
import { InventoryModule } from './components/InventoryModule';
import { EngineeringModule } from './components/EngineeringModule';
import { BIModule } from './components/BIModule';
import { AIAgentsModule } from './components/AIAgentsModule';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [autopilotActive, setAutopilotActive] = useState<boolean>(true);
  const [isAutopilotRunning, setIsAutopilotRunning] = useState<boolean>(false);

  // State Collections
  const [company, setCompany] = useState<CompanyInfo>(initialCompany);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [leads, setLeads] = useState<LeadCustomer[]>(initialLeads);
  const [documents, setDocuments] = useState<EnterpriseDocument[]>(initialDocuments);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [sensors, setSensors] = useState<SensorTelemetry[]>(initialSensors);
  const [agents, setAgents] = useState<AgentInfo[]>(initialAgents);
  const [autopilotLogs, setAutopilotLogs] = useState<AutopilotLog[]>(initialAutopilotLogs);
  const [biMetrics, setBiMetrics] = useState<BiMetrics>(initialBiMetrics);
  const [latestAiDiagnosis, setLatestAiDiagnosis] = useState<any>(null);

  // Initialize and Subscribe to Firestore in Real-Time
  useEffect(() => {
    async function init() {
      await seedInitialFirestoreData();
    }
    init();

    const unsubCompany = subscribeCompany(data => data && setCompany(data));
    const unsubInvoices = subscribeInvoices(data => data.length > 0 && setInvoices(data));
    const unsubLeads = subscribeLeads(data => data.length > 0 && setLeads(data));
    const unsubDocs = subscribeDocuments(data => data.length > 0 && setDocuments(data));
    const unsubEmp = subscribeEmployees(data => data.length > 0 && setEmployees(data));
    const unsubInv = subscribeInventory(data => data.length > 0 && setInventory(data));
    const unsubSensors = subscribeSensors(data => data.length > 0 && setSensors(data));
    const unsubAgents = subscribeAgents(data => data.length > 0 && setAgents(data));
    const unsubLogs = subscribeAutopilotLogs(data => data.length > 0 && setAutopilotLogs(data));
    const unsubBi = subscribeBiMetrics(data => data && setBiMetrics(data));

    return () => {
      unsubCompany();
      unsubInvoices();
      unsubLeads();
      unsubDocs();
      unsubEmp();
      unsubInv();
      unsubSensors();
      unsubAgents();
      unsubLogs();
      unsubBi();
    };
  }, []);

  // QR Code Modal State
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; title: string; data: string; hash?: string }>({
    isOpen: false,
    title: '',
    data: '',
    hash: undefined
  });

  // Open QR Modal helper
  const handleOpenQrModal = (title: string, data: string, hash?: string) => {
    setQrModal({ isOpen: true, title, data, hash });
  };

  // Run Autopilot AI Route
  const handleRunAutopilot = async (manualPrompt?: string) => {
    setIsAutopilotRunning(true);
    try {
      const enterpriseState = {
        metrics: biMetrics,
        openInvoicesCount: invoices.filter(i => i.status === 'issued' || i.status === 'overdue').length,
        totalLeads: leads.length,
        totalDocuments: documents.length,
        inventoryAlerts: inventory.filter(i => i.quantity <= i.minQuantity).length,
        activeSensors: sensors.length
      };

      const res = await fetch('/api/ai/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterpriseState, manualPrompt })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setLatestAiDiagnosis(data.result);

        // Add autopilot logs to Firestore
        if (data.result.autopilotActions && data.result.autopilotActions.length > 0) {
          for (let idx = 0; idx < data.result.autopilotActions.length; idx++) {
            const act = data.result.autopilotActions[idx];
            const logItem: AutopilotLog = {
              id: `log_auto_${Date.now()}_${idx}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              agentName: act.agentName || 'Agente Executivo C-Suite',
              category: act.category || 'Executive',
              message: act.message,
              severity: act.severity || 'success',
              automatedActionTaken: act.automatedActionTaken
            };
            await addAutopilotLogToFirestore(logItem);
          }
        }
      }
    } catch (err) {
      console.error('Error triggering autopilot:', err);
    } finally {
      setIsAutopilotRunning(false);
    }
  };

  // Run Agent Task helper
  const handleRunAgentTask = async (agentRole: string, taskType: string, inputData: any) => {
    try {
      const res = await fetch('/api/ai/agent-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentRole, taskType, inputData })
      });
      const data = await res.json();

      // Log action to Firestore
      const newLog: AutopilotLog = {
        id: `log_task_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        agentName: agentRole,
        category: 'Executive',
        message: `Tarefa "${taskType}" executada via consola interativa do utilizador.`,
        severity: 'success',
        automatedActionTaken: 'Diagnóstico e recomendação gerados pelo Gemini.'
      };
      await addAutopilotLogToFirestore(newLog);

      return data;
    } catch (err) {
      console.error('Error running agent task:', err);
      throw err;
    }
  };

  // Mutators connecting to Firestore
  const handleAddInvoice = async (inv: Invoice) => {
    await addInvoiceToFirestore(inv);
  };

  const handleAddLead = async (lead: LeadCustomer) => {
    await addLeadToFirestore(lead);
  };

  const handleUpdateLeadStage = async (id: string, stage: LeadCustomer['stage']) => {
    await updateLeadStageInFirestore(id, stage);
  };

  const handleAddDocument = async (doc: EnterpriseDocument) => {
    await addDocumentToFirestore(doc);
  };

  const handleAddEmployee = async (emp: Employee) => {
    await addEmployeeToFirestore(emp);
  };

  const handleAddInventoryItem = async (item: InventoryItem) => {
    await addInventoryItemToFirestore(item);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header & Navigation */}
      <Navigation
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        autopilotActive={autopilotActive}
        setAutopilotActive={setAutopilotActive}
        onTriggerAutopilot={() => handleRunAutopilot()}
        isAutopilotRunning={isAutopilotRunning}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeModule === 'dashboard' && (
          <ExecutiveDashboard
            biMetrics={biMetrics}
            autopilotLogs={autopilotLogs}
            isAutopilotRunning={isAutopilotRunning}
            onRunAutopilot={handleRunAutopilot}
            onNavigate={setActiveModule}
            latestAiDiagnosis={latestAiDiagnosis}
          />
        )}

        {activeModule === 'finance' && (
          <FinanceModule
            invoices={invoices}
            company={company}
            onAddInvoice={handleAddInvoice}
            onOpenQrModal={handleOpenQrModal}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'crm' && (
          <CRMModule
            leads={leads}
            onAddLead={handleAddLead}
            onUpdateStage={handleUpdateLeadStage}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'documents' && (
          <DocumentModule
            documents={documents}
            onAddDocument={handleAddDocument}
            onOpenQrModal={handleOpenQrModal}
          />
        )}

        {activeModule === 'hr' && (
          <HRModule
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'inventory' && (
          <InventoryModule
            inventory={inventory}
            onAddItem={handleAddInventoryItem}
            onOpenQrModal={handleOpenQrModal}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'engineering' && (
          <EngineeringModule
            sensors={sensors}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'bi' && (
          <BIModule
            biMetrics={biMetrics}
            onRunAgentTask={handleRunAgentTask}
          />
        )}

        {activeModule === 'ai_agents' && (
          <AIAgentsModule
            agents={agents}
            onRunAgentTask={handleRunAgentTask}
          />
        )}
      </main>

      {/* QR Code Validation Modal */}
      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
        title={qrModal.title}
        data={qrModal.data}
        hash={qrModal.hash}
      />
    </div>
  );
}

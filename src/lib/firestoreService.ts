import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
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
} from '../data/mockDatabase';

// Collections names
export const COLLECTIONS = {
  COMPANY: 'company',
  INVOICES: 'invoices',
  LEADS: 'leads',
  DOCUMENTS: 'documents',
  EMPLOYEES: 'employees',
  INVENTORY: 'inventory',
  SENSORS: 'sensors',
  AGENTS: 'agents',
  AUTOPILOT_LOGS: 'autopilot_logs',
  BI_METRICS: 'bi_metrics'
};

/**
 * Ensures Firestore is populated with initial default data if empty.
 */
export async function seedInitialFirestoreData() {
  try {
    // 1. Company
    const companySnap = await getDocs(collection(db, COLLECTIONS.COMPANY));
    if (companySnap.empty) {
      await setDoc(doc(db, COLLECTIONS.COMPANY, initialCompany.id), initialCompany);
    }

    // 2. Invoices
    const invoicesSnap = await getDocs(collection(db, COLLECTIONS.INVOICES));
    if (invoicesSnap.empty) {
      for (const inv of initialInvoices) {
        await setDoc(doc(db, COLLECTIONS.INVOICES, inv.id), inv);
      }
    }

    // 3. Leads
    const leadsSnap = await getDocs(collection(db, COLLECTIONS.LEADS));
    if (leadsSnap.empty) {
      for (const lead of initialLeads) {
        await setDoc(doc(db, COLLECTIONS.LEADS, lead.id), lead);
      }
    }

    // 4. Documents
    const docsSnap = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
    if (docsSnap.empty) {
      for (const d of initialDocuments) {
        await setDoc(doc(db, COLLECTIONS.DOCUMENTS, d.id), d);
      }
    }

    // 5. Employees
    const empSnap = await getDocs(collection(db, COLLECTIONS.EMPLOYEES));
    if (empSnap.empty) {
      for (const emp of initialEmployees) {
        await setDoc(doc(db, COLLECTIONS.EMPLOYEES, emp.id), emp);
      }
    }

    // 6. Inventory
    const invSnap = await getDocs(collection(db, COLLECTIONS.INVENTORY));
    if (invSnap.empty) {
      for (const item of initialInventory) {
        await setDoc(doc(db, COLLECTIONS.INVENTORY, item.id), item);
      }
    }

    // 7. Sensors
    const senSnap = await getDocs(collection(db, COLLECTIONS.SENSORS));
    if (senSnap.empty) {
      for (const sen of initialSensors) {
        await setDoc(doc(db, COLLECTIONS.SENSORS, sen.sensorId), sen);
      }
    }

    // 8. Agents
    const agentsSnap = await getDocs(collection(db, COLLECTIONS.AGENTS));
    if (agentsSnap.empty) {
      for (const ag of initialAgents) {
        await setDoc(doc(db, COLLECTIONS.AGENTS, ag.id), ag);
      }
    }

    // 9. Autopilot Logs
    const logsSnap = await getDocs(collection(db, COLLECTIONS.AUTOPILOT_LOGS));
    if (logsSnap.empty) {
      for (const log of initialAutopilotLogs) {
        await setDoc(doc(db, COLLECTIONS.AUTOPILOT_LOGS, log.id), log);
      }
    }

    // 10. BI Metrics
    const biSnap = await getDocs(collection(db, COLLECTIONS.BI_METRICS));
    if (biSnap.empty) {
      await setDoc(doc(db, COLLECTIONS.BI_METRICS, 'current'), initialBiMetrics);
    }
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
}

// ==================== REAL-TIME SUBSCRIBERS ====================

export function subscribeCompany(callback: (company: CompanyInfo) => void) {
  return onSnapshot(collection(db, COLLECTIONS.COMPANY), snap => {
    if (!snap.empty) {
      callback(snap.docs[0].data() as CompanyInfo);
    }
  });
}

export function subscribeInvoices(callback: (invoices: Invoice[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.INVOICES), snap => {
    const list: Invoice[] = [];
    snap.forEach(d => list.push(d.data() as Invoice));
    callback(list);
  });
}

export function subscribeLeads(callback: (leads: LeadCustomer[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.LEADS), snap => {
    const list: LeadCustomer[] = [];
    snap.forEach(d => list.push(d.data() as LeadCustomer));
    callback(list);
  });
}

export function subscribeDocuments(callback: (docs: EnterpriseDocument[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), snap => {
    const list: EnterpriseDocument[] = [];
    snap.forEach(d => list.push(d.data() as EnterpriseDocument));
    callback(list);
  });
}

export function subscribeEmployees(callback: (employees: Employee[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.EMPLOYEES), snap => {
    const list: Employee[] = [];
    snap.forEach(d => list.push(d.data() as Employee));
    callback(list);
  });
}

export function subscribeInventory(callback: (items: InventoryItem[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.INVENTORY), snap => {
    const list: InventoryItem[] = [];
    snap.forEach(d => list.push(d.data() as InventoryItem));
    callback(list);
  });
}

export function subscribeSensors(callback: (sensors: SensorTelemetry[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.SENSORS), snap => {
    const list: SensorTelemetry[] = [];
    snap.forEach(d => list.push(d.data() as SensorTelemetry));
    callback(list);
  });
}

export function subscribeAgents(callback: (agents: AgentInfo[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.AGENTS), snap => {
    const list: AgentInfo[] = [];
    snap.forEach(d => list.push(d.data() as AgentInfo));
    callback(list);
  });
}

export function subscribeAutopilotLogs(callback: (logs: AutopilotLog[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.AUTOPILOT_LOGS), snap => {
    const list: AutopilotLog[] = [];
    snap.forEach(d => list.push(d.data() as AutopilotLog));
    // Sort logs descending by timestamp
    list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
    callback(list);
  });
}

export function subscribeBiMetrics(callback: (metrics: BiMetrics) => void) {
  return onSnapshot(doc(db, COLLECTIONS.BI_METRICS, 'current'), snap => {
    if (snap.exists()) {
      callback(snap.data() as BiMetrics);
    }
  });
}

// ==================== WRITE OPERATIONS ====================

export async function addInvoiceToFirestore(invoice: Invoice) {
  await setDoc(doc(db, COLLECTIONS.INVOICES, invoice.id), invoice);
}

export async function addLeadToFirestore(lead: LeadCustomer) {
  await setDoc(doc(db, COLLECTIONS.LEADS, lead.id), lead);
}

export async function updateLeadStageInFirestore(leadId: string, stage: LeadCustomer['stage']) {
  await updateDoc(doc(db, COLLECTIONS.LEADS, leadId), { stage });
}

export async function addDocumentToFirestore(document: EnterpriseDocument) {
  await setDoc(doc(db, COLLECTIONS.DOCUMENTS, document.id), document);
}

export async function addEmployeeToFirestore(employee: Employee) {
  await setDoc(doc(db, COLLECTIONS.EMPLOYEES, employee.id), employee);
}

export async function addInventoryItemToFirestore(item: InventoryItem) {
  await setDoc(doc(db, COLLECTIONS.INVENTORY, item.id), item);
}

export async function updateSensorTelemetryInFirestore(sensor: SensorTelemetry) {
  await setDoc(doc(db, COLLECTIONS.SENSORS, sensor.sensorId), sensor);
}

export async function addAutopilotLogToFirestore(log: AutopilotLog) {
  await setDoc(doc(db, COLLECTIONS.AUTOPILOT_LOGS, log.id), log);
}

export async function updateBiMetricsInFirestore(metrics: BiMetrics) {
  await setDoc(doc(db, COLLECTIONS.BI_METRICS, 'current'), metrics);
}

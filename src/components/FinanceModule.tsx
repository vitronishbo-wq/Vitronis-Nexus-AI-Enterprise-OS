import React, { useState } from 'react';
import { Invoice, CompanyInfo } from '../types';
import {
  Receipt,
  Plus,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Trash2
} from 'lucide-react';

interface FinanceModuleProps {
  invoices: Invoice[];
  company: CompanyInfo;
  onAddInvoice: (inv: Invoice) => void;
  onOpenQrModal: (title: string, data: string, hash?: string) => void;
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  invoices,
  company,
  onAddInvoice,
  onOpenQrModal,
  onRunAgentTask
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientTaxId, setClientTaxId] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(1000);
  const [category, setCategory] = useState('Venda de Serviços');

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const totalIssued = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.total, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !itemDesc) return;

    const subtotal = itemQty * itemPrice;
    const taxTotal = subtotal * 0.14;
    const total = subtotal + taxTotal;
    const invNum = `FT 2026/00${145 + invoices.length}`;
    const hash = `sha256_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

    const newInv: Invoice = {
      id: `inv_${Date.now()}`,
      number: invNum,
      clientName,
      clientTaxId: clientTaxId || 'AO509999999',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [{ description: itemDesc, quantity: itemQty, unitPrice: itemPrice, taxRate: 14, total: subtotal }],
      subtotal,
      taxTotal,
      total,
      status: 'issued',
      category,
      digitalSignatureHash: hash
    };

    onAddInvoice(newInv);
    setIsModalOpen(false);
    setClientName('');
    setClientTaxId('');
    setItemDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Receipt className="w-4 h-4" /> ERP FINANCIAL & INVOICING ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">Facturação & Controlo Financeiro</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Emissão de facturas certificadas, IVA, assinatura digital SHA-256 e integração automática com o Agente Financeiro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunAgentTask('Agente Financeiro ERP', 'Análise de Cobranças', { invoices })}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Análise Preditiva de Cobranças
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Emitir Factura
          </button>
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Total Facturado YTD</div>
          <div className="text-xl font-bold text-white font-mono">Kz {totalIssued.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-slate-400 mt-1">Todas as séries de facturação</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 bg-emerald-950/10 p-4 rounded-2xl shadow-lg">
          <div className="text-emerald-400 text-xs mb-1 font-semibold">Total Recebido (Liq)</div>
          <div className="text-xl font-bold text-emerald-300 font-mono">Kz {totalPaid.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Liquidado e reconciliado
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 bg-amber-950/10 p-4 rounded-2xl shadow-lg">
          <div className="text-amber-400 text-xs mb-1 font-semibold">Facturas Vencidas (Overdue)</div>
          <div className="text-xl font-bold text-amber-300 font-mono">Kz {totalOverdue.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Lembrete automático acionado
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
        <div className="flex items-center space-x-2">
          {['all', 'issued', 'paid', 'overdue'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer font-medium ${
                filter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'Todas' : st === 'issued' ? 'Emitidas' : st === 'paid' ? 'Pagas' : 'Vencidas'}
            </button>
          ))}
        </div>
        <span className="text-slate-400 font-mono text-[11px]">{filteredInvoices.length} registos</span>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="p-3.5">Número</th>
                <th className="p-3.5">Cliente / NIF</th>
                <th className="p-3.5">Emissão / Venc.</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Total (+IVA)</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Ações & QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredInvoices.map(inv => {
                const statusBadge =
                  inv.status === 'paid'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : inv.status === 'overdue'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';

                return (
                  <tr key={inv.id} className="hover:bg-slate-850/60 transition group">
                    <td className="p-3.5 font-mono font-bold text-white flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                      {inv.number}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{inv.clientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.clientTaxId}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      <div>{inv.date}</div>
                      <div className="text-slate-500 text-[10px]">Venc: {inv.dueDate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                        {inv.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white text-sm">
                      Kz {inv.total.toLocaleString('pt-AO')}
                      <span className="text-[10px] text-slate-400 font-normal block">IVA: Kz {inv.taxTotal.toLocaleString('pt-AO')}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border uppercase ${statusBadge}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            onOpenQrModal(
                              `Factura ${inv.number}`,
                              `VERIFIED_INVOICE:${inv.number}|TOTAL:${inv.total}|CLIENT:${inv.clientName}|EMITTER:${company.taxId}`,
                              inv.digitalSignatureHash
                            )
                          }
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 rounded-lg border border-cyan-800 transition cursor-pointer"
                          title="Ver QR Code e Assinatura Digital"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer text-[11px] px-2"
                        >
                          Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Factura {selectedInvoice.number}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Emitente: {company.name} ({company.taxId})</span>
                <span>Data: {selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-slate-200 font-semibold">
                <span>Cliente: {selectedInvoice.clientName}</span>
                <span>NIF: {selectedInvoice.clientTaxId}</span>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="text-cyan-400 font-bold mb-1">Itens da Factura:</div>
                {selectedInvoice.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-900">
                    <span>{it.description} (x{it.quantity})</span>
                    <span>Kz {it.total.toLocaleString('pt-AO')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                <span>Total Final (+14% IVA):</span>
                <span>Kz {selectedInvoice.total.toLocaleString('pt-AO')}</span>
              </div>

              {selectedInvoice.digitalSignatureHash && (
                <div className="pt-2 text-[10px] text-slate-500 break-all">
                  Hash: {selectedInvoice.digitalSignatureHash}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emitir Factura */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Emitir Nova Factura Empresarial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Cliente / Empresa</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Ex: Iberia Industrial S.A."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">NIF / Tax ID do Cliente</label>
                <input
                  type="text"
                  value={clientTaxId}
                  onChange={e => setClientTaxId(e.target.value)}
                  placeholder="Ex: PT509887766"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição do Serviço / Produto</label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={e => setItemDesc(e.target.value)}
                  placeholder="Ex: Módulo Autopilot AI Enterprise Q3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={itemQty}
                    onChange={e => setItemQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preço Unitário (Kz)</label>
                  <input
                    type="number"
                    min={0}
                    value={itemPrice}
                    onChange={e => setItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">Kz {(itemQty * itemPrice).toLocaleString('pt-AO')}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (14%):</span>
                  <span className="text-white">Kz {(itemQty * itemPrice * 0.14).toLocaleString('pt-AO')}</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-300 text-sm pt-1 border-t border-slate-800">
                  <span>Total Final:</span>
                  <span>Kz {(itemQty * itemPrice * 1.14).toLocaleString('pt-AO')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition"
                >
                  Emitir & Assinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { LeadCustomer } from '../types';
import {
  Users,
  Plus,
  Sparkles,
  TrendingUp,
  Mail,
  Phone,
  Building,
  ArrowRight,
  CheckCircle2,
  Brain,
  DollarSign
} from 'lucide-react';

interface CRMModuleProps {
  leads: LeadCustomer[];
  onAddLead: (lead: LeadCustomer) => void;
  onUpdateStage: (id: string, stage: LeadCustomer['stage']) => void;
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const CRMModule: React.FC<CRMModuleProps> = ({
  leads,
  onAddLead,
  onUpdateStage,
  onRunAgentTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState(25000);

  const stages: { id: LeadCustomer['stage']; label: string; color: string }[] = [
    { id: 'lead', label: 'Prospecção / Lead', color: 'border-slate-700 bg-slate-900/50' },
    { id: 'contacted', label: 'Contacto Inicial', color: 'border-blue-500/30 bg-blue-950/20' },
    { id: 'proposal', label: 'Proposta Elaborada', color: 'border-cyan-500/30 bg-cyan-950/20' },
    { id: 'negotiation', label: 'Negociação', color: 'border-purple-500/30 bg-purple-950/20' },
    { id: 'won', label: 'Ganha / Fechada', color: 'border-emerald-500/30 bg-emerald-950/20' }
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;

    const newLead: LeadCustomer = {
      id: `lead_${Date.now()}`,
      name,
      company,
      email: email || 'contato@empresa.com',
      phone: '+351 900 000 000',
      value,
      stage: 'lead',
      score: Math.floor(Math.random() * 30) + 70,
      aiInsight: 'Lead recém-cadastrada. O Agente Comercial recomenda agendamento de apresentação técnica.',
      lastContact: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    setIsModalOpen(false);
    setName('');
    setCompany('');
    setEmail('');
  };

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Users className="w-4 h-4" /> CRM & SALES PIPELINE ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">CRM & Gestão Comercial</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Funil de vendas inteligente, pontuação de oportunidades (Lead Score) e automação de propostas via IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunAgentTask('Agente Comercial & CRM', 'Otimização de Propostas Comercial', { leads })}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Análise de Lead Score IA
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nova Oportunidade
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Valor Total do Funil</div>
          <div className="text-xl font-bold text-white font-mono">Kz {totalPipelineValue.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-slate-400 mt-1">{leads.length} oportunidades ativas</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Lead Score Médio</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {Math.round(leads.reduce((a, b) => a + b.score, 0) / (leads.length || 1))}/100
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Alta taxa de conversão prevista
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Taxa de Fecho Prevista</div>
          <div className="text-xl font-bold text-emerald-300 font-mono">78.5%</div>
          <div className="text-[11px] text-slate-400 mt-1">Automação de follow-up ativa</div>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(st => {
          const stageLeads = leads.filter(l => l.stage === st.id);
          const stageTotal = stageLeads.reduce((a, b) => a + b.value, 0);

          return (
            <div key={st.id} className={`p-3 rounded-2xl border ${st.color} shadow-lg flex flex-col min-w-[220px]`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div>
                  <h3 className="font-bold text-white text-xs">{st.label}</h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Kz {stageTotal.toLocaleString('pt-AO')}</div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                {stageLeads.map(lead => (
                  <div key={lead.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-cyan-500/40 transition shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-xs">{lead.name}</span>
                      <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                        {lead.score} pts
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                      <Building className="w-3 h-3 text-slate-500" /> {lead.company}
                    </div>

                    <div className="text-xs font-mono font-bold text-emerald-400 mb-2">
                      Kz {lead.value.toLocaleString('pt-AO')}
                    </div>

                    {lead.aiInsight && (
                      <div className="text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80 mb-2 leading-tight">
                        <span className="text-cyan-400 font-semibold flex items-center gap-1 mb-0.5">
                          <Brain className="w-3 h-3" /> IA Insight
                        </span>
                        {lead.aiInsight}
                      </div>
                    )}

                    {/* Stage Move Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                      <span className="text-slate-500">{lead.lastContact}</span>
                      <div className="flex gap-1">
                        {st.id !== 'won' && (
                          <button
                            onClick={() => {
                              const nextIdx = stages.findIndex(s => s.id === st.id) + 1;
                              if (nextIdx < stages.length) {
                                onUpdateStage(lead.id, stages[nextIdx].id);
                              }
                            }}
                            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-semibold cursor-pointer"
                          >
                            Avançar →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar Oportunidade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Nova Oportunidade Comercial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Contacto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Carlos Mendonça"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Empresa</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Ex: Sintra Pharmaceuticals"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="carlos@sintra.pt"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Valor Estimado do Contrato (Kz)</label>
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
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
                  Adicionar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

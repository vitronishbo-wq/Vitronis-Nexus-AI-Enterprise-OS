import React, { useState } from 'react';
import { AgentInfo } from '../types';
import {
  Bot,
  Sparkles,
  Play,
  CheckCircle2,
  Brain,
  Crown,
  DollarSign,
  Scale,
  TrendingUp,
  FileText,
  Users,
  Package,
  Cpu,
  BarChart3,
  Zap,
  ShieldAlert,
  Send
} from 'lucide-react';

interface AIAgentsModuleProps {
  agents: AgentInfo[];
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => Promise<any>;
}

export const AIAgentsModule: React.FC<AIAgentsModuleProps> = ({ agents, onRunAgentTask }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(agents[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const getAgentIcon = (role: string) => {
    if (role.includes('Executivo')) return <Crown className="w-5 h-5 text-amber-400" />;
    if (role.includes('Financeiro')) return <DollarSign className="w-5 h-5 text-emerald-400" />;
    if (role.includes('Jurídico')) return <Scale className="w-5 h-5 text-purple-400" />;
    if (role.includes('Comercial')) return <TrendingUp className="w-5 h-5 text-cyan-400" />;
    if (role.includes('Documental')) return <FileText className="w-5 h-5 text-blue-400" />;
    if (role.includes('Humanos')) return <Users className="w-5 h-5 text-pink-400" />;
    if (role.includes('Estoque')) return <Package className="w-5 h-5 text-yellow-400" />;
    if (role.includes('Engenharia')) return <Cpu className="w-5 h-5 text-cyan-400" />;
    if (role.includes('BI')) return <BarChart3 className="w-5 h-5 text-indigo-400" />;
    return <Zap className="w-5 h-5 text-emerald-400" />;
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsExecuting(true);
    setExecutionOutput(null);

    try {
      const res = await onRunAgentTask(selectedAgent.name, 'Instrução do Utilizador', { prompt: customPrompt });
      if (res && res.analysis) {
        setExecutionOutput(res.analysis);
      } else {
        setExecutionOutput('Agente concluiu a tarefa com sucesso.');
      }
    } catch (err: any) {
      setExecutionOutput(`Erro na execução: ${err.message || 'Falha na resposta do agente'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Bot className="w-4 h-4" /> MULTI-AGENT AUTONOMOUS AI HUB
          </div>
          <h2 className="text-xl font-bold text-white">Núcleo dos 12 Agentes Especializados</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Agentes autónomos com papéis específicos para executar tarefas de auditoria, finanças, jurídico, robótica, RH e vendas.
          </p>
        </div>
      </div>

      {/* Grid of 12 Agents */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {agents.map(ag => {
          const isSelected = selectedAgent.id === ag.id;

          return (
            <div
              key={ag.id}
              onClick={() => {
                setSelectedAgent(ag);
                setExecutionOutput(null);
              }}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {getAgentIcon(ag.name)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {ag.tasksCompleted} tarefas
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs mb-0.5 line-clamp-1">{ag.name}</h4>
                <div className="text-[10px] text-cyan-400 font-mono mb-2 line-clamp-1">{ag.role}</div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 line-clamp-2">
                {ag.specialty}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Interactive Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
            {getAgentIcon(selectedAgent.name)}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{selectedAgent.name}</h3>
            <p className="text-xs text-cyan-400 font-mono">{selectedAgent.role} • {selectedAgent.specialty}</p>
          </div>
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleExecute} className="space-y-3">
          <label className="block text-xs text-slate-300 font-semibold">
            Enviar Instrução Direta ao {selectedAgent.name}:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder={`Ex: "Elabore um diagnóstico detalhado para o departamento de ${selectedAgent.role}"...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isExecuting || !customPrompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Send className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
              {isExecuting ? 'Executando...' : 'Executar Agente'}
            </button>
          </div>
        </form>

        {/* Execution Output */}
        {executionOutput && (
          <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 text-xs text-slate-200 font-mono leading-relaxed space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> Resposta do Agente {selectedAgent.name}:
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Concluído
              </span>
            </div>
            <div className="whitespace-pre-wrap font-sans text-xs text-slate-200 pt-2">
              {executionOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

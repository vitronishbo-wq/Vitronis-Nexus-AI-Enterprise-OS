import React, { useState } from 'react';
import { BiMetrics, AutopilotLog } from '../types';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Building,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

interface ExecutiveDashboardProps {
  biMetrics: BiMetrics;
  autopilotLogs: AutopilotLog[];
  isAutopilotRunning: boolean;
  onRunAutopilot: (prompt?: string) => void;
  onNavigate: (module: any) => void;
  latestAiDiagnosis: any;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  biMetrics,
  autopilotLogs,
  isAutopilotRunning,
  onRunAutopilot,
  onNavigate,
  latestAiDiagnosis
}) => {
  const [manualPrompt, setManualPrompt] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPrompt.trim()) return;
    onRunAutopilot(manualPrompt);
    setManualPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 p-6 rounded-2xl border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              VITRONIS AUTOPILOT AI OPERATIONAL NUCLEUS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Piloto Automático Empresarial
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Sistema autónomo gerindo contratos, fluxo de caixa, telemetria industrial, cobranças, conformidade jurídica e otimização comercial sem fricção.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onRunAutopilot()}
              disabled={isAutopilotRunning}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAutopilotRunning ? 'animate-spin' : ''}`} />
              {isAutopilotRunning ? 'Varredura em Execução...' : 'Varredura Autônoma'}
            </button>
            <button
              onClick={() => onNavigate('ai_agents')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              Consola dos 12 Agentes
            </button>
          </div>
        </div>

        {/* AI Prompt Input Bar */}
        <form onSubmit={handleManualSubmit} className="mt-6 relative z-10">
          <div className="flex items-center bg-slate-950/90 border border-cyan-500/30 rounded-xl p-1.5 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition shadow-inner">
            <div className="px-3 text-cyan-400">
              <Brain className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={manualPrompt}
              onChange={e => setManualPrompt(e.target.value)}
              placeholder="Ex: 'Analise os contratos prestes a vencer e elabore minutas de renovação', ou 'Calcule a margem do Q3'..."
              className="w-full bg-transparent text-slate-100 text-xs placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAutopilotRunning || !manualPrompt.trim()}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-40 cursor-pointer"
            >
              <span>Instruir IA</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Receita Recorrente (MRR)</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">Kz {biMetrics.mrr.toLocaleString('pt-AO')}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% em relação ao mês anterior
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Previsão de Caixa 30d</span>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">Kz {biMetrics.cashFlowForecast30d.toLocaleString('pt-AO')}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Abertas: Kz {biMetrics.openInvoicesTotal.toLocaleString('pt-AO')}</span>
            <span className="text-cyan-400 font-semibold">Saudável</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Margem Líquida EBITDA</span>
            <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">{biMetrics.netProfitMargin}%</div>
          <div className="flex items-center gap-1 text-[11px] text-purple-400 mt-2 font-medium">
            <span>Meta de 35% superada</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Contratos Ativos</span>
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{biMetrics.activeContractsCount} Contratos</div>
          <div className="text-[11px] text-slate-400 mt-2">
            100% assinados digitalmente
          </div>
        </div>
      </div>

      {/* Main Content Split: AI Diagnosis & Autopilot Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Diagnosis & Strategic Overview */}
        <div className="lg:col-span-2 space-y-6">
          {latestAiDiagnosis ? (
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Último Diagnóstico Autônomo da IA</h3>
                </div>
                <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                  Health Score: {latestAiDiagnosis.healthScore || 98}%
                </span>
              </div>

              <p className="text-slate-200 text-xs leading-relaxed mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                {latestAiDiagnosis.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3">
                  <h4 className="font-semibold text-amber-300 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Riscos Identificados
                  </h4>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {latestAiDiagnosis.topRisks?.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3">
                  <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Oportunidades Mapeadas
                  </h4>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {latestAiDiagnosis.topOpportunities?.map((o: string, idx: number) => (
                      <li key={idx}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {latestAiDiagnosis.strategicAdvice && (
                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-cyan-400 font-semibold">Recomendação Estratégica: </span>
                  {latestAiDiagnosis.strategicAdvice}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
              <Brain className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-80" />
              <h3 className="text-white font-semibold text-base">Autopilot Inicializado</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                Clique em "Varredura Autônoma" acima para gerar uma análise instantânea e decisões automáticas.
              </p>
            </div>
          )}

          {/* Core Enterprise Departments Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="font-semibold text-white text-sm mb-3">Módulos Empresariais Integrados</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => onNavigate('finance')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-cyan-400 font-semibold mb-1 group-hover:text-cyan-300">Facturação & ERP</div>
                <div className="text-slate-400 text-[11px]">Invoices, IVA, Caixa</div>
              </button>

              <button
                onClick={() => onNavigate('crm')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-emerald-400 font-semibold mb-1 group-hover:text-emerald-300">CRM & Vendas</div>
                <div className="text-slate-400 text-[11px]">Pipeline, Lead Score</div>
              </button>

              <button
                onClick={() => onNavigate('documents')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-purple-400 font-semibold mb-1 group-hover:text-purple-300">Documentos & QR</div>
                <div className="text-slate-400 text-[11px]">Contratos, Assinatura</div>
              </button>

              <button
                onClick={() => onNavigate('engineering')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="text-amber-400 font-semibold mb-1 group-hover:text-amber-300">Engenharia IoT</div>
                <div className="text-slate-400 text-[11px]">Sensores, Robótica</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Autopilot Audit Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Feed Autônomo de Ações</h3>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" /> Live
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1 text-xs no-scrollbar">
            {autopilotLogs.map(log => {
              const severityColor =
                log.severity === 'success'
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : log.severity === 'warning'
                  ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                  : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300';

              return (
                <div key={log.id} className={`p-3 rounded-xl border ${severityColor} relative group`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-white">{log.agentName}</span>
                    <span className="text-[10px] opacity-60 font-mono">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-snug">{log.message}</p>
                  {log.automatedActionTaken && (
                    <div className="mt-2 text-[10px] text-cyan-300 bg-slate-950/60 p-1.5 rounded border border-slate-800/80 font-mono">
                      ✓ Ação: {log.automatedActionTaken}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Server className="w-3.5 h-3.5" /> Servidores Serverless Ativos
            </span>
            <span className="text-slate-500">Firebase + Render</span>
          </div>
        </div>
      </div>
    </div>
  );
};

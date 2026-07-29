import React, { useState } from 'react';
import { BiMetrics } from '../types';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  PieChart,
  DollarSign,
  Brain,
  ShieldAlert,
  ArrowUpRight,
  Sliders
} from 'lucide-react';

interface BIModuleProps {
  biMetrics: BiMetrics;
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const BIModule: React.FC<BIModuleProps> = ({ biMetrics, onRunAgentTask }) => {
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/predictive-bi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: biMetrics, horizonDays })
      });
      const data = await res.json();
      if (data.success) {
        setAiPrediction(data.prediction);
      }
    } catch (err) {
      console.error('Error running prediction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-4 h-4" /> PREDICTIVE BUSINESS INTELLIGENCE ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">Business Intelligence & Análise Preditiva</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Projeções financeiras, simulação de cenários de receitas e otimização de tesouraria guiadas por IA.
          </p>
        </div>

        <button
          onClick={handleRunPrediction}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Calculando Projeção...' : 'Simular Projeção Preditiva'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1 font-sans">Receita Recorrente Anual (ARR)</div>
          <div className="text-xl font-bold text-white">Kz {biMetrics.arr.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-sans font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Crescimento acelerado
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1 font-sans">MRR Atual</div>
          <div className="text-xl font-bold text-cyan-300">Kz {biMetrics.mrr.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">Base sólida de assinaturas</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1 font-sans">Margem Líquida</div>
          <div className="text-xl font-bold text-purple-300">{biMetrics.netProfitMargin}%</div>
          <div className="text-[11px] text-purple-400 mt-1 font-sans font-medium">Eficiência serverless</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1 font-sans">Previsão 30d Caixa</div>
          <div className="text-xl font-bold text-emerald-300">Kz {biMetrics.cashFlowForecast30d.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-sans font-medium">Fluxo saudável</div>
        </div>
      </div>

      {/* AI Scenario Simulation Result */}
      {aiPrediction && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" /> Cenário Preditivo Calculado para os Próximos {horizonDays} Dias
            </h3>
            <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
              Status: {aiPrediction.cashFlowStatus || 'Positivo'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1 font-sans">Receita Projetada</div>
              <div className="text-lg font-bold text-emerald-400">Kz {aiPrediction.projectedRevenue?.toLocaleString('pt-AO')}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1 font-sans">Despesas Estimadas</div>
              <div className="text-lg font-bold text-amber-400">Kz {aiPrediction.projectedExpenses?.toLocaleString('pt-AO')}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1 font-sans">Lucro Líquido Esperado</div>
              <div className="text-lg font-bold text-cyan-300">Kz {aiPrediction.estimatedNetProfit?.toLocaleString('pt-AO')}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-cyan-400">Ações Recomendadas para Maximizar Margem:</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {aiPrediction.recommendedActions?.map((act: string, idx: number) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-semibold">Avaliação de Risco: </span>
            {aiPrediction.riskAssessment}
          </div>
        </div>
      )}

      {/* Financial Performance Bars Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm">Visualização de Desempenho Trimestral (Q1 - Q4 2026)</h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Q1 2026 (Realizado)</span>
              <span className="text-emerald-400 font-mono font-bold">Kz 112.000.000,00 (+32% Margem)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[65%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Q2 2026 (Realizado)</span>
              <span className="text-emerald-400 font-mono font-bold">Kz 142.500.000,00 (+38.4% Margem)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[82%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Q3 2026 (Projeção Preditiva IA)</span>
              <span className="text-cyan-300 font-mono font-bold">Kz 178.000.000,00 (+41% Margem Estimada)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[95%] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

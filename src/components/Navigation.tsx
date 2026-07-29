import React, { useState, useEffect } from 'react';
import { ModuleType } from '../types';
import {
  LayoutDashboard,
  Receipt,
  Users,
  FileCheck2,
  UserCheck,
  Boxes,
  Cpu,
  BarChart3,
  Bot,
  Sparkles,
  Activity,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface NavigationProps {
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  autopilotActive: boolean;
  setAutopilotActive: (active: boolean) => void;
  onTriggerAutopilot: () => void;
  isAutopilotRunning: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  setActiveModule,
  autopilotActive,
  setAutopilotActive,
  onTriggerAutopilot,
  isAutopilotRunning
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: ModuleType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Autopilot Executivo', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'IA' },
    { id: 'finance', label: 'ERP & Facturação', icon: <Receipt className="w-4 h-4" /> },
    { id: 'crm', label: 'CRM & Vendas', icon: <Users className="w-4 h-4" /> },
    { id: 'documents', label: 'Documentos & Assinaturas', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'hr', label: 'Recursos Humanos', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventário & Armazém', icon: <Boxes className="w-4 h-4" /> },
    { id: 'engineering', label: 'Engenharia & IoT', icon: <Cpu className="w-4 h-4" />, badge: 'IoT' },
    { id: 'bi', label: 'BI & Preditivo', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai_agents', label: 'Núcleo 12 Agentes IA', icon: <Bot className="w-4 h-4" />, badge: '12' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-white tracking-wide text-sm">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <span>VITRONIS NEXUS</span>
            <span className="text-cyan-400 font-mono text-[11px] bg-cyan-950 border border-cyan-800/60 px-1.5 py-0.5 rounded font-semibold">
              AI OS 4.0
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Empresa Licenciada & Certificada
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            <span className="text-slate-400">Autopilot IA:</span>
            <button
              onClick={() => setAutopilotActive(!autopilotActive)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition ${
                autopilotActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autopilotActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {autopilotActive ? 'ATIVO (Automático)' : 'PAUSADO'}
            </button>
          </div>

          <button
            onClick={onTriggerAutopilot}
            disabled={isAutopilotRunning}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-3 py-1 rounded-lg text-xs transition shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAutopilotRunning ? 'animate-spin' : ''}`} />
            {isAutopilotRunning ? 'Analisando...' : 'Executar Autopilot Agora'}
          </button>

          <div className="font-mono text-slate-400 hidden md:flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <nav className="flex items-center space-x-1 py-1.5">
          {navItems.map(item => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { SensorTelemetry } from '../types';
import {
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Server,
  RefreshCw,
  Gauge
} from 'lucide-react';

interface EngineeringModuleProps {
  sensors: SensorTelemetry[];
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const EngineeringModule: React.FC<EngineeringModuleProps> = ({
  sensors,
  onRunAgentTask
}) => {
  const [liveSensors, setLiveSensors] = useState<SensorTelemetry[]>(sensors);

  // Live simulation of telemetry fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSensors(prev =>
        prev.map(s => {
          const tempDelta = (Math.random() - 0.5) * 0.4;
          const vibDelta = (Math.random() - 0.5) * 0.02;
          return {
            ...s,
            temperature: Number((s.temperature + tempDelta).toFixed(1)),
            vibration: Number(Math.max(0.01, s.vibration + vibDelta).toFixed(2)),
            lastUpdated: 'Agora mesmo'
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Cpu className="w-4 h-4" /> INDUSTRIAL IOT & PREDICTIVE MAINTENANCE ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">Engenharia, Robótica & Telemetria</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Monitorização em tempo real de sensores industriais (Modbus / ESP32), linhas robóticas e IA de manutenção preditiva.
          </p>
        </div>

        <button
          onClick={() => onRunAgentTask('Agente Engenharia & IoT', 'Diagnóstico Preditivo de Sensores e Vibração', { sensors: liveSensors })}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Executar Análise Preditiva
        </button>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {liveSensors.map(sen => {
          const isWarn = sen.status === 'warning';

          return (
            <div
              key={sen.sensorId}
              className={`p-5 rounded-2xl border bg-slate-900 shadow-xl relative overflow-hidden ${
                isWarn ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {sen.sensorId}
                </span>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isWarn
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isWarn ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  {sen.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{sen.name}</h3>
              <div className="text-[11px] text-slate-400 mb-4">{sen.location}</div>

              {/* Gauges */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-500 mb-0.5">Temperatura</div>
                  <div className={`text-sm font-bold ${sen.temperature > 70 ? 'text-amber-400' : 'text-white'}`}>
                    {sen.temperature}ºC
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 mb-0.5">Pressão</div>
                  <div className="text-sm font-bold text-white">{sen.pressure} bar</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 mb-0.5">Vibração</div>
                  <div className="text-sm font-bold text-cyan-300">{sen.vibration} g</div>
                </div>
              </div>

              <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>Protocolo: ESP32 MQTT</span>
                <span>{sen.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Industrial Hardware Status Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" /> Infraestrutura de Automação & Robótica Embarcada
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Cluster ROS 2 (Robot Operating System)
            </div>
            <p className="text-slate-400 text-[11px]">3 Braços robóticos industriais sincronizados via comunicação determinística de baixa latência.</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Edge AI Jetson Embedded
            </div>
            <p className="text-slate-400 text-[11px]">Processamento de visão computacional em tempo real para controlo de qualidade de montagem.</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> Gateway Modbus PLC
            </div>
            <p className="text-slate-400 text-[11px]">Transmissão contínua de telemetria com criptografia TLS para a base de dados Firestore.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

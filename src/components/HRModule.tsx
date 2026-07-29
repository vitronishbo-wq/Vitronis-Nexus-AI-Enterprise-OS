import React, { useState } from 'react';
import { Employee } from '../types';
import {
  UserCheck,
  Plus,
  Sparkles,
  Award,
  DollarSign,
  Users,
  Building,
  CheckCircle2
} from 'lucide-react';

interface HRModuleProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const HRModule: React.FC<HRModuleProps> = ({
  employees,
  onAddEmployee,
  onRunAgentTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engenharia & IA');
  const [salary, setSalary] = useState(4500);

  const totalPayroll = employees.reduce((acc, e) => acc + e.salary, 0);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      name,
      role,
      department,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@vitronis.com`,
      salary,
      contractType: 'Sem Termo',
      status: 'active',
      okrScore: Math.floor(Math.random() * 15) + 85,
      performanceNotes: 'Admitido recentemente. Integração bem sucedida.'
    };

    onAddEmployee(newEmp);
    setIsModalOpen(false);
    setName('');
    setRole('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <UserCheck className="w-4 h-4" /> HUMAN RESOURCES & OKR ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">Recursos Humanos & Talentos</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Gestão de equipas, processamento de vencimentos, acompanhamento de OKRs e avaliação contínua de performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunAgentTask('Agente Recursos Humanos', 'Avaliação Preditiva de Talentos & OKR', { employees })}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Avaliação IA de OKRs
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Colaborador
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Total de Colaboradores</div>
          <div className="text-xl font-bold text-white font-mono">{employees.length} Ativos</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Contratos em Conformidade
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Folha Salarial Mensal</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">Kz {totalPayroll.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-slate-400 mt-1">Salário médio: Kz {Math.round(totalPayroll / (employees.length || 1)).toLocaleString('pt-AO')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Média de Desempenho OKR</div>
          <div className="text-xl font-bold text-purple-300 font-mono">
            {Math.round(employees.reduce((a, b) => a + b.okrScore, 0) / (employees.length || 1))}%
          </div>
          <div className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Excelente alinhamento estratégico
          </div>
        </div>
      </div>

      {/* Employees Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="p-3.5">Nome / Email</th>
                <th className="p-3.5">Cargo / Departamento</th>
                <th className="p-3.5">Vencimento Mensal</th>
                <th className="p-3.5">Tipo Contrato</th>
                <th className="p-3.5">Score OKR</th>
                <th className="p-3.5">Notas do Agente RH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-850/60 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">{emp.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{emp.email}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{emp.role}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{emp.department}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    Kz {emp.salary.toLocaleString('pt-AO')}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                      {emp.contractType}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    <span className="text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {emp.okrScore}%
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px] max-w-xs">
                    {emp.performanceNotes || 'Performance estável.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Colaborador */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Adicionar Novo Colaborador</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Dra. Beatriz Siqueira"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cargo / Função</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="Ex: Engenheiro de Software RAG"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Departamento</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Engenharia & IA">Engenharia & IA</option>
                  <option value="Comercial & CRM">Comercial & CRM</option>
                  <option value="Financeiro & Jurídico">Financeiro & Jurídico</option>
                  <option value="Operações & Robótica">Operações & Robótica</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Salário Mensal (Kz)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(Number(e.target.value))}
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
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

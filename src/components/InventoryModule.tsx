import React, { useState } from 'react';
import { InventoryItem } from '../types';
import {
  Boxes,
  Plus,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  PackageCheck,
  Search
} from 'lucide-react';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onOpenQrModal: (title: string, data: string) => void;
  onRunAgentTask: (agentRole: string, taskType: string, data: any) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onAddItem,
  onOpenQrModal,
  onRunAgentTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware IoT');
  const [quantity, setQuantity] = useState(50);
  const [minQuantity, setMinQuantity] = useState(20);
  const [unitPrice, setUnitPrice] = useState(150);

  const filteredInventory = inventory.filter(
    i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const newItem: InventoryItem = {
      id: `inv_item_${Date.now()}`,
      sku,
      name,
      category,
      quantity,
      minQuantity,
      unitPrice,
      warehouseLocation: 'Armazém Principal - Aisle A1',
      status: quantity <= minQuantity ? 'low_stock' : 'optimal',
      qrCode: `QR_${sku}_${Date.now()}`
    };

    onAddItem(newItem);
    setIsModalOpen(false);
    setSku('');
    setName('');
  };

  const totalInventoryValue = inventory.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  const lowStockCount = inventory.filter(i => i.quantity <= i.minQuantity).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Boxes className="w-4 h-4" /> SMART INVENTORY & SUPPLY CHAIN ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">Inventário & Reposição Automática</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Controlo de stock em múltiplos armazéns, etiquetas QR Code e ordens de compra automáticas via Agente de Suprimentos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunAgentTask('Agente Estoque & Compras', 'Otimização de Stock e Reposição ABC', { inventory })}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Análise de Reposição IA
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Item no Stock
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Valor Total em Armazém</div>
          <div className="text-xl font-bold text-white font-mono">Kz {totalInventoryValue.toLocaleString('pt-AO')}</div>
          <div className="text-[11px] text-slate-400 mt-1">{inventory.length} SKUs registados</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 bg-amber-950/10 p-4 rounded-2xl shadow-lg">
          <div className="text-amber-400 text-xs mb-1 font-semibold">Alerta de Stock Baixo</div>
          <div className="text-xl font-bold text-amber-300 font-mono">{lowStockCount} Itens Atingiram o Mínimo</div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Agente gerou sugestão de compra
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Localização Principal</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">Armazém Central Luanda</div>
          <div className="text-[11px] text-slate-400 mt-1">Sistemas de leitura QR ativos</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
        <Search className="w-4 h-4 text-slate-500 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por SKU ou Nome do Produto..."
          className="bg-transparent text-white w-full focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Produto / Categoria</th>
                <th className="p-3.5">Quantidade</th>
                <th className="p-3.5">Preço Un.</th>
                <th className="p-3.5">Localização</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Etiqueta QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.map(item => {
                const isLow = item.quantity <= item.minQuantity;

                return (
                  <tr key={item.id} className="hover:bg-slate-850/60 transition">
                    <td className="p-3.5 font-mono font-bold text-cyan-400">
                      {item.sku}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold">
                      <span className={isLow ? 'text-amber-400' : 'text-emerald-400'}>
                        {item.quantity} unidades
                      </span>
                      <span className="text-[10px] text-slate-500 block">Min: {item.minQuantity}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      Kz {item.unitPrice.toLocaleString('pt-AO')}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {item.warehouseLocation}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isLow
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isLow ? 'Stock Baixo' : 'Ótimo'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() =>
                          onOpenQrModal(
                            `Etiqueta QR SKU: ${item.sku}`,
                            `STOCK_SKU:${item.sku}|NAME:${item.name}|LOCATION:${item.warehouseLocation}`
                          )
                        }
                        className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 rounded-lg border border-cyan-800 transition cursor-pointer"
                        title="Ver Etiqueta QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-white">Cadastrar Item no Stock</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">SKU do Produto</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="Ex: VIT-SEN-ROB-04"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Actuador Linear Robótico Industrial"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Qtd Atual</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Qtd Mínima</label>
                  <input
                    type="number"
                    value={minQuantity}
                    onChange={e => setMinQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Preço Unitário (Kz)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={e => setUnitPrice(Number(e.target.value))}
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
                  Salvar e Gerar QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState } from "react";
import { 
  TrendingDown, 
  Scale, 
  Ruler, 
  Camera, 
  Plus,
  Calendar,
  ChevronDown,
  Edit,
  Save
} from "lucide-react";

export default function ProgressoPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newWaist, setNewWaist] = useState("");
  const [newHip, setNewHip] = useState("");
  const [newChest, setNewChest] = useState("");

  // Dados de exemplo
  const weightHistory = [
    { date: "01/01/2024", weight: 95.5 },
    { date: "08/01/2024", weight: 94.2 },
    { date: "15/01/2024", weight: 92.8 },
    { date: "22/01/2024", weight: 91.5 },
    { date: "29/01/2024", weight: 90.0 },
  ];

  const measurements = {
    current: { waist: 95, hip: 110, chest: 105, arm: 35, thigh: 65 },
    initial: { waist: 105, hip: 120, chest: 115, arm: 40, thigh: 72 },
  };

  const stats = {
    weightLost: 5.5,
    daysOnTreatment: 29,
    averageWeeklyLoss: 1.9,
    goalWeight: 75,
    currentWeight: 90.0,
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#064D58] to-[#085563] rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-[#2DD6C1]" />
            <span className="text-sm font-medium text-[#2DD6C1]">Peso Perdido</span>
          </div>
          <p className="text-3xl font-bold">{stats.weightLost} kg</p>
          <p className="text-xs text-gray-300 mt-1">Em {stats.daysOnTreatment} dias</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-[#064D58]" />
            <span className="text-sm font-medium text-gray-600">Peso Atual</span>
          </div>
          <p className="text-3xl font-bold text-[#064D58]">{stats.currentWeight} kg</p>
          <p className="text-xs text-gray-500 mt-1">Meta: {stats.goalWeight} kg</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#064D58]" />
            <span className="text-sm font-medium text-gray-600">Média Semanal</span>
          </div>
          <p className="text-3xl font-bold text-[#064D58]">{stats.averageWeeklyLoss} kg</p>
          <p className="text-xs text-gray-500 mt-1">Por semana</p>
        </div>
      </div>

      {/* Gráfico de Evolução de Peso */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Evolução de Peso</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#064D58] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#085563] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Gráfico Simplificado */}
        <div className="relative h-64 border-l-2 border-b-2 border-gray-300 pl-4 pb-4">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>96kg</span>
            <span>94kg</span>
            <span>92kg</span>
            <span>90kg</span>
          </div>

          <div className="h-full flex items-end justify-between gap-2">
            {weightHistory.map((entry, index) => {
              const height = ((96 - entry.weight) / 6) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-[#064D58] to-[#2DD6C1] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${height}%` }}></div>
                  <div className="text-xs text-gray-600 text-center">
                    <p className="font-semibold">{entry.weight}kg</p>
                    <p className="text-[10px]">{entry.date.slice(0, 5)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Medidas Corporais */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Medidas Corporais</h3>
          <button className="flex items-center gap-2 text-[#064D58] text-sm font-semibold hover:text-[#085563]">
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(measurements.current).map(([key, value]) => {
            const initial = measurements.initial[key as keyof typeof measurements.initial];
            const diff = initial - value;
            const labels: { [key: string]: string } = {
              waist: "Cintura",
              hip: "Quadril",
              chest: "Peito",
              arm: "Braço",
              thigh: "Coxa",
            };

            return (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">{labels[key]}</p>
                  <p className="text-2xl font-bold text-[#064D58]">{value} cm</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Inicial: {initial} cm</p>
                  <p className="text-sm font-semibold text-green-600">-{diff} cm</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fotos de Progresso */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Fotos de Progresso</h3>
          <button className="flex items-center gap-2 bg-[#2DD6C1] text-[#064D58] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#26c4b0] transition-colors">
            <Camera className="w-4 h-4" />
            Adicionar Foto
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#2DD6C1] transition-colors cursor-pointer">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Adicionar</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Adicionar Resultado */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#064D58] mb-4">Adicionar Novo Resultado</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 89.5"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Cintura (cm)</label>
                <input
                  type="number"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 94"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quadril (cm)</label>
                <input
                  type="number"
                  value={newHip}
                  onChange={(e) => setNewHip(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 109"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Peito (cm)</label>
                <input
                  type="number"
                  value={newChest}
                  onChange={(e) => setNewChest(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 104"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aqui você salvaria os dados
                  setShowAddModal(false);
                  setNewWeight("");
                  setNewWaist("");
                  setNewHip("");
                  setNewChest("");
                }}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

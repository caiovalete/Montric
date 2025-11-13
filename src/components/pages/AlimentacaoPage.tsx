"use client";

import { useState } from "react";
import { 
  Camera, 
  Plus,
  Search,
  Utensils,
  Clock,
  Flame,
  TrendingUp,
  ChevronRight,
  X
} from "lucide-react";

export default function AlimentacaoPage() {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  // Dados de exemplo
  const dailyNutrition = {
    calories: { current: 1450, goal: 1800 },
    protein: { current: 95, goal: 120 },
    carbs: { current: 145, goal: 180 },
    fat: { current: 48, goal: 60 },
  };

  const todayMeals = [
    {
      id: 1,
      type: "Café da Manhã",
      time: "08:30",
      items: ["2 ovos mexidos", "1 fatia de pão integral", "Café com leite"],
      calories: 380,
      protein: 28,
    },
    {
      id: 2,
      type: "Almoço",
      time: "12:45",
      items: ["Peito de frango grelhado (150g)", "Arroz integral", "Salada verde"],
      calories: 520,
      protein: 45,
    },
    {
      id: 3,
      type: "Lanche",
      time: "16:00",
      items: ["Iogurte grego", "Granola", "Frutas vermelhas"],
      calories: 280,
      protein: 18,
    },
  ];

  const mealTypes = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"];

  const caloriesPercentage = (dailyNutrition.calories.current / dailyNutrition.calories.goal) * 100;
  const proteinPercentage = (dailyNutrition.protein.current / dailyNutrition.protein.goal) * 100;
  const carbsPercentage = (dailyNutrition.carbs.current / dailyNutrition.carbs.goal) * 100;
  const fatPercentage = (dailyNutrition.fat.current / dailyNutrition.fat.goal) * 100;

  return (
    <div className="space-y-6">
      {/* Resumo Nutricional Diário */}
      <div className="bg-gradient-to-br from-[#064D58] to-[#085563] rounded-xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#2DD6C1]" />
          Resumo Nutricional de Hoje
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-300 mb-1">Calorias</p>
            <p className="text-2xl font-bold">{dailyNutrition.calories.current}</p>
            <p className="text-xs text-gray-300">de {dailyNutrition.calories.goal} kcal</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#2DD6C1] h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(caloriesPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-300 mb-1">Proteína</p>
            <p className="text-2xl font-bold">{dailyNutrition.protein.current}g</p>
            <p className="text-xs text-gray-300">de {dailyNutrition.protein.goal}g</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div
                className="bg-orange-400 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-300 mb-1">Carboidratos</p>
            <p className="text-2xl font-bold">{dailyNutrition.carbs.current}g</p>
            <p className="text-xs text-gray-300">de {dailyNutrition.carbs.goal}g</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-400 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-300 mb-1">Gorduras</p>
            <p className="text-2xl font-bold">{dailyNutrition.fat.current}g</p>
            <p className="text-xs text-gray-300">de {dailyNutrition.fat.goal}g</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div
                className="bg-yellow-400 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(fatPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar Refeição */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddMealModal(true)}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-dashed border-gray-300 hover:border-[#2DD6C1] flex flex-col items-center justify-center gap-3"
        >
          <div className="bg-[#064D58] p-3 rounded-full">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#064D58]">Adicionar Refeição</p>
            <p className="text-xs text-gray-500">Manual ou por foto</p>
          </div>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-dashed border-gray-300 hover:border-[#2DD6C1] flex flex-col items-center justify-center gap-3">
          <div className="bg-[#2DD6C1] p-3 rounded-full">
            <Camera className="w-6 h-6 text-[#064D58]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#064D58]">Escanear com IA</p>
            <p className="text-xs text-gray-500">Tire foto da refeição</p>
          </div>
        </button>
      </div>

      {/* Refeições de Hoje */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Refeições de Hoje</h3>

        <div className="space-y-4">
          {todayMeals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="w-4 h-4 text-[#064D58]" />
                  <span className="font-semibold text-[#064D58]">{meal.type}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meal.time}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-2">
                  {meal.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">
                    <span className="font-semibold text-[#064D58]">{meal.calories}</span> kcal
                  </span>
                  <span className="text-gray-500">
                    <span className="font-semibold text-orange-600">{meal.protein}g</span> proteína
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-[#064D58]">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico Semanal */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Histórico Semanal</h3>

        <div className="space-y-3">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, index) => {
            const calories = [1650, 1580, 1720, 1450, 1800, 1900, 1600][index];
            const percentage = (calories / 1800) * 100;

            return (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 w-8">{day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage > 100 ? "bg-red-500" : percentage > 90 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {calories} kcal
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Adicionar Refeição */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Adicionar Refeição</h3>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Refeição</label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedMeal(type)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedMeal === type
                          ? "bg-[#064D58] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Buscar Alimento</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex: Frango grelhado"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ou adicione manualmente</label>
                <textarea
                  placeholder="Descreva sua refeição..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={4}
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Calorias</label>
                  <input
                    type="number"
                    placeholder="kcal"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Proteína</label>
                  <input
                    type="number"
                    placeholder="g"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Carbs</label>
                  <input
                    type="number"
                    placeholder="g"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMealModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowAddMealModal(false);
                  setSelectedMeal(null);
                }}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

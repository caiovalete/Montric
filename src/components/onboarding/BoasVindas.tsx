"use client";

import { Calendar } from "lucide-react";

interface BoasVindasProps {
  onContinue: () => void;
}

export default function BoasVindas({ onContinue }: BoasVindasProps) {
  const today = new Date();
  const nextApplication = new Date(today);
  nextApplication.setDate(today.getDate() + 3);

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return (
    <div className="space-y-6">
      {/* Mini Calendário */}
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="inline-block bg-[#064D58] text-white rounded-xl p-4 mb-4">
          <div className="text-sm font-medium mb-1">{monthNames[today.getMonth()]}</div>
          <div className="text-4xl font-bold">{today.getDate()}</div>
          <div className="text-xs mt-1">{today.getFullYear()}</div>
        </div>
        <div className="flex items-center justify-center gap-2 text-[#064D58]">
          <Calendar className="w-5 h-5" />
          <p className="font-semibold">Próxima aplicação em 3 dias</p>
        </div>
      </div>

      {/* Título e Benefícios */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#064D58] mb-4">
          Torne-se um especialista na sua jornada de saúde
        </h1>
      </div>

      {/* Cards de Benefícios */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-md flex items-start gap-4">
          <div className="bg-[#2DD6C1]/10 p-3 rounded-lg flex-shrink-0">
            <div className="w-6 h-6 bg-[#2DD6C1] rounded-full flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#064D58] mb-1">Registre suas doses sem complicação</h3>
            <p className="text-sm text-gray-600">Acompanhe facilmente cada aplicação do seu medicamento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md flex items-start gap-4">
          <div className="bg-[#2DD6C1]/10 p-3 rounded-lg flex-shrink-0">
            <div className="w-6 h-6 bg-[#2DD6C1] rounded-full flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#064D58] mb-1">Acompanhe seu progresso</h3>
            <p className="text-sm text-gray-600">Monitore peso, apetite e níveis de energia diariamente</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md flex items-start gap-4">
          <div className="bg-[#2DD6C1]/10 p-3 rounded-lg flex-shrink-0">
            <div className="w-6 h-6 bg-[#2DD6C1] rounded-full flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#064D58] mb-1">Identifique padrões e efeitos</h3>
            <p className="text-sm text-gray-600">Entenda como seu corpo responde ao tratamento</p>
          </div>
        </div>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={onContinue}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg"
      >
        Continuar
      </button>
    </div>
  );
}

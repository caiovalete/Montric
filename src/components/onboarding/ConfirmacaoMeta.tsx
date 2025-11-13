"use client";

import { TrendingUp, Sparkles } from "lucide-react";

interface ConfirmacaoMetaProps {
  pesoAtual: number;
  metaPeso: number;
  onContinue: () => void;
}

export default function ConfirmacaoMeta({ pesoAtual, metaPeso, onContinue }: ConfirmacaoMetaProps) {
  const perdaPeso = pesoAtual - metaPeso;

  return (
    <div className="space-y-6">
      {/* Ícone de Sucesso */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-full mb-4 animate-bounce">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-4">
          Boa notícia!
        </h1>
        <p className="text-xl mb-2">
          Perder <span className="font-bold text-4xl">{perdaPeso.toFixed(1)} kg</span>
        </p>
        <p className="text-lg">
          está totalmente dentro do esperado.
        </p>
      </div>

      {/* Detalhes da Meta */}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">Peso Atual</p>
            <p className="text-2xl font-bold text-[#064D58]">{pesoAtual} kg</p>
          </div>
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
          <div className="px-4 text-gray-400">→</div>
          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div>
            <p className="text-sm text-green-600">Meta de Peso</p>
            <p className="text-2xl font-bold text-green-700">{metaPeso} kg</p>
          </div>
          <div className="bg-green-500 p-2 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-[#064D58] mb-1">
            {Math.ceil(perdaPeso / 0.5)}
          </div>
          <div className="text-xs text-gray-600">Semanas estimadas</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl font-bold text-[#064D58] mb-1">
            {((perdaPeso / pesoAtual) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">Redução de peso</div>
        </div>
      </div>

      {/* Mensagem de Encorajamento */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>🎯 Você consegue!</strong> Com acompanhamento consistente e o suporte do Montric, sua meta está ao alcance.
        </p>
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

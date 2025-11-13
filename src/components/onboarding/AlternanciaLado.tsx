"use client";

import { useState } from "react";

interface AlternanciaLadoProps {
  onContinue: (alterna: boolean) => void;
}

export default function AlternanciaLado({ onContinue }: AlternanciaLadoProps) {
  const [alterna, setAlterna] = useState<boolean | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#064D58] mb-2">
          Você alterna os lados entre as aplicações?
        </h1>
        <p className="text-gray-600">Isso nos ajuda a criar lembretes personalizados</p>
      </div>

      {/* Opções */}
      <div className="space-y-4">
        <button
          onClick={() => setAlterna(true)}
          className={`w-full p-6 rounded-xl text-left transition-all ${
            alterna === true
              ? "bg-[#064D58] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              alterna === true ? "border-white bg-[#2DD6C1]" : "border-gray-300"
            }`}>
              {alterna === true && <span className="text-white text-sm">✓</span>}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Sim, alterno entre direita e esquerda</h3>
              <p className={`text-sm ${alterna === true ? "text-gray-200" : "text-gray-500"}`}>
                Recomendado para evitar irritação no local de aplicação
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setAlterna(false)}
          className={`w-full p-6 rounded-xl text-left transition-all ${
            alterna === false
              ? "bg-[#064D58] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              alterna === false ? "border-white bg-[#2DD6C1]" : "border-gray-300"
            }`}>
              {alterna === false && <span className="text-white text-sm">✓</span>}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Não, mantenho sempre o mesmo lado</h3>
              <p className={`text-sm ${alterna === false ? "text-gray-200" : "text-gray-500"}`}>
                Você prefere aplicar sempre no mesmo local
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Dica:</strong> Alternar os locais de aplicação ajuda a prevenir irritação e melhora a absorção do medicamento.
        </p>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={() => alterna !== null && onContinue(alterna)}
        disabled={alterna === null}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  );
}

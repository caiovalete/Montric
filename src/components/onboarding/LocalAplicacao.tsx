"use client";

import { useState } from "react";

interface LocalAplicacaoProps {
  onContinue: (local: string) => void;
}

export default function LocalAplicacao({ onContinue }: LocalAplicacaoProps) {
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);

  const locais = [
    { id: "abdomen", label: "Abdômen", position: "top-[45%] left-[50%]" },
    { id: "coxa_direita", label: "Coxa Direita", position: "top-[70%] left-[40%]" },
    { id: "coxa_esquerda", label: "Coxa Esquerda", position: "top-[70%] left-[60%]" },
    { id: "braco_direito", label: "Braço Direito", position: "top-[35%] left-[35%]" },
    { id: "braco_esquerdo", label: "Braço Esquerdo", position: "top-[35%] left-[65%]" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#064D58] mb-2">
          Onde você costuma aplicar sua injeção?
        </h1>
        <p className="text-gray-600">Toque no diagrama para selecionar</p>
      </div>

      {/* Diagrama do Corpo */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="relative mx-auto" style={{ maxWidth: "300px", height: "400px" }}>
          {/* Silhueta simplificada */}
          <svg viewBox="0 0 200 300" className="w-full h-full">
            {/* Cabeça */}
            <circle cx="100" cy="30" r="20" fill="#E5E7EB" />
            
            {/* Corpo */}
            <rect x="70" y="50" width="60" height="80" rx="10" fill="#E5E7EB" />
            
            {/* Braços */}
            <rect x="40" y="60" width="25" height="60" rx="8" fill="#E5E7EB" />
            <rect x="135" y="60" width="25" height="60" rx="8" fill="#E5E7EB" />
            
            {/* Pernas */}
            <rect x="75" y="135" width="20" height="80" rx="8" fill="#E5E7EB" />
            <rect x="105" y="135" width="20" height="80" rx="8" fill="#E5E7EB" />
          </svg>

          {/* Pontos de Aplicação */}
          {locais.map((local) => (
            <button
              key={local.id}
              onClick={() => setSelectedLocal(local.id)}
              className={`absolute w-12 h-12 rounded-full border-4 transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                selectedLocal === local.id
                  ? "bg-[#2DD6C1] border-[#064D58] scale-125"
                  : "bg-white border-gray-300 hover:border-[#2DD6C1] hover:scale-110"
              }`}
              style={{ top: local.position.split(" ")[0].split("[")[1].split("]")[0], left: local.position.split(" ")[1].split("[")[1].split("]")[0] }}
            >
              {selectedLocal === local.id && (
                <span className="text-white text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Locais */}
      <div className="grid grid-cols-2 gap-3">
        {locais.map((local) => (
          <button
            key={local.id}
            onClick={() => setSelectedLocal(local.id)}
            className={`p-4 rounded-xl font-semibold transition-all ${
              selectedLocal === local.id
                ? "bg-[#064D58] text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            {local.label}
          </button>
        ))}
      </div>

      {/* Botão Continuar */}
      <button
        onClick={() => selectedLocal && onContinue(selectedLocal)}
        disabled={!selectedLocal}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  );
}

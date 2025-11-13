"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

interface AlturaProps {
  onContinue: (altura: number) => void;
}

export default function Altura({ onContinue }: AlturaProps) {
  const [altura, setAltura] = useState(170);

  const alturas = Array.from({ length: 101 }, (_, i) => 120 + i); // 120cm a 220cm

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block bg-[#2DD6C1]/10 p-4 rounded-full mb-4">
          <Ruler className="w-8 h-8 text-[#064D58]" />
        </div>
        <h1 className="text-3xl font-bold text-[#064D58] mb-2">
          Qual é sua altura?
        </h1>
        <p className="text-gray-600">Isso nos ajuda a calcular métricas personalizadas</p>
      </div>

      {/* Display da Altura */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-6xl font-bold mb-2">{altura}</div>
        <div className="text-xl text-[#2DD6C1]">centímetros</div>
      </div>

      {/* Seletor de Altura */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <input
          type="range"
          min="120"
          max="220"
          value={altura}
          onChange={(e) => setAltura(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2DD6C1]"
          style={{
            background: `linear-gradient(to right, #2DD6C1 0%, #2DD6C1 ${((altura - 120) / 100) * 100}%, #E5E7EB ${((altura - 120) / 100) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>120 cm</span>
          <span>220 cm</span>
        </div>
      </div>

      {/* Referências Visuais */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setAltura(160)}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">160</div>
          <div className="text-xs text-gray-500">Baixa</div>
        </button>
        <button
          onClick={() => setAltura(170)}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">170</div>
          <div className="text-xs text-gray-500">Média</div>
        </button>
        <button
          onClick={() => setAltura(180)}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">180</div>
          <div className="text-xs text-gray-500">Alta</div>
        </button>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={() => onContinue(altura)}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg"
      >
        Continuar
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

interface AnoNascimentoProps {
  onContinue: (ano: number) => void;
}

export default function AnoNascimento({ onContinue }: AnoNascimentoProps) {
  const currentYear = new Date().getFullYear();
  const [ano, setAno] = useState(1990);

  const anos = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i); // 18 a 98 anos

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block bg-[#2DD6C1]/10 p-4 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-[#064D58]" />
        </div>
        <h1 className="text-3xl font-bold text-[#064D58] mb-2">
          Qual é seu ano de nascimento?
        </h1>
        <p className="text-gray-600">Para personalizar suas recomendações</p>
      </div>

      {/* Display do Ano */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-6xl font-bold mb-2">{ano}</div>
        <div className="text-xl text-[#2DD6C1]">{currentYear - ano} anos</div>
      </div>

      {/* Seletor de Ano */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <input
          type="range"
          min={currentYear - 98}
          max={currentYear - 18}
          value={ano}
          onChange={(e) => setAno(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2DD6C1]"
          style={{
            background: `linear-gradient(to right, #2DD6C1 0%, #2DD6C1 ${((ano - (currentYear - 98)) / 80) * 100}%, #E5E7EB ${((ano - (currentYear - 98)) / 80) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{currentYear - 98}</span>
          <span>{currentYear - 18}</span>
        </div>
      </div>

      {/* Décadas Rápidas */}
      <div className="grid grid-cols-4 gap-3">
        {[1960, 1970, 1980, 1990].map((decada) => (
          <button
            key={decada}
            onClick={() => setAno(decada)}
            className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
          >
            <div className="text-lg font-bold text-[#064D58]">{decada}s</div>
          </button>
        ))}
      </div>

      {/* Botão Continuar */}
      <button
        onClick={() => onContinue(ano)}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg"
      >
        Continuar
      </button>
    </div>
  );
}

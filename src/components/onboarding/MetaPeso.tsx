"use client";

import { useState } from "react";
import { Target } from "lucide-react";

interface MetaPesoProps {
  onContinue: (metaPeso: number) => void;
}

export default function MetaPeso({ onContinue }: MetaPesoProps) {
  const [kg, setKg] = useState(70);
  const [decimal, setDecimal] = useState(0);

  const metaPeso = parseFloat(`${kg}.${decimal}`);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block bg-[#2DD6C1]/10 p-4 rounded-full mb-4">
          <Target className="w-8 h-8 text-[#064D58]" />
        </div>
        <h1 className="text-3xl font-bold text-[#064D58] mb-2">
          Qual é sua meta de peso?
        </h1>
        <p className="text-gray-600">Defina um objetivo realista e saudável</p>
      </div>

      {/* Display do Peso */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-7xl font-bold mb-2">
          {kg}<span className="text-4xl">.{decimal}</span>
        </div>
        <div className="text-xl text-[#2DD6C1]">quilogramas</div>
      </div>

      {/* Seletores */}
      <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
        {/* Quilogramas */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Quilogramas</label>
          <input
            type="range"
            min="40"
            max="150"
            value={kg}
            onChange={(e) => setKg(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2DD6C1]"
            style={{
              background: `linear-gradient(to right, #2DD6C1 0%, #2DD6C1 ${((kg - 40) / 110) * 100}%, #E5E7EB ${((kg - 40) / 110) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>40 kg</span>
            <span>150 kg</span>
          </div>
        </div>

        {/* Decimais */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Decimais</label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => setDecimal(num)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  decimal === num
                    ? "bg-[#064D58] text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Referências Rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => { setKg(60); setDecimal(0); }}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">60</div>
          <div className="text-xs text-gray-500">kg</div>
        </button>
        <button
          onClick={() => { setKg(70); setDecimal(0); }}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">70</div>
          <div className="text-xs text-gray-500">kg</div>
        </button>
        <button
          onClick={() => { setKg(80); setDecimal(0); }}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
        >
          <div className="text-2xl font-bold text-[#064D58]">80</div>
          <div className="text-xs text-gray-500">kg</div>
        </button>
      </div>

      {/* Dica */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>💡 Dica:</strong> Uma meta saudável é perder de 0,5 a 1 kg por semana. Consulte seu médico para definir o melhor objetivo para você.
        </p>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={() => onContinue(metaPeso)}
        className="w-full bg-[#064D58] text-white py-4 rounded-xl font-semibold hover:bg-[#085563] transition-all hover:scale-105 shadow-lg"
      >
        Continuar
      </button>
    </div>
  );
}

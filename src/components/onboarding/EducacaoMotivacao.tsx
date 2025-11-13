"use client";

import { Heart, Users, Clock } from "lucide-react";

interface EducacaoMotivacaoProps {
  onContinue: () => void;
}

export default function EducacaoMotivacao({ onContinue }: EducacaoMotivacaoProps) {
  return (
    <div className="space-y-6">
      {/* Ícone Principal */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-red-400 to-pink-500 p-6 rounded-full mb-4">
          <Heart className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#064D58] mb-4 leading-tight">
          Pesquisas mostram que manter um peso saudável aumenta a expectativa de vida
        </h1>
        <p className="text-xl text-gray-600">
          Isso significa mais tempo com as pessoas que você ama
        </p>
      </div>

      {/* Cards de Benefícios */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="bg-red-500 p-3 rounded-lg flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#064D58] mb-2">Saúde do Coração</h3>
              <p className="text-sm text-gray-700">
                Reduz riscos de doenças cardiovasculares e melhora a circulação sanguínea
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#064D58] mb-2">Mais Energia</h3>
              <p className="text-sm text-gray-700">
                Aumento da disposição para atividades diárias e melhor qualidade do sono
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="bg-purple-500 p-3 rounded-lg flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#064D58] mb-2">Momentos Especiais</h3>
              <p className="text-sm text-gray-700">
                Mais tempo para criar memórias com família e amigos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatística Impactante */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-5xl font-bold mb-2">+10</div>
        <div className="text-lg text-[#2DD6C1] mb-2">anos de vida</div>
        <p className="text-sm opacity-90">
          Média de aumento na expectativa de vida com peso saudável*
        </p>
        <p className="text-xs opacity-70 mt-3">
          *Fonte: Estudos da OMS sobre longevidade e saúde
        </p>
      </div>

      {/* Mensagem Motivacional */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 p-5 rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>💪 Sua jornada importa!</strong> Cada passo que você dá em direção à sua meta é um investimento no seu futuro e no tempo que você terá com quem ama.
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

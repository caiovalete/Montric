"use client";

import { Check, Sparkles, TrendingUp, Users, Zap, ArrowLeft, Shield, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssinaturaPage() {
  const router = useRouter();
  const [planoSelecionado, setPlanoSelecionado] = useState<"mensal" | "anual">("anual");
  const [processando, setProcessando] = useState(false);

  const planos = {
    mensal: {
      nome: "Mensal",
      preco: 45.90,
      precoPorMes: 45.90,
      periodo: "mês",
      descricao: "Ideal para começar",
      badge: "💪 FLEXÍVEL"
    },
    anual: {
      nome: "Anual",
      preco: 129.90,
      precoPorMes: 10.83,
      periodo: "ano",
      descricao: "Melhor custo-benefício",
      economia: 76,
      precoOriginal: 550.80,
      badge: "🏆 MAIS POPULAR"
    },
  };

  const beneficios = [
    { icon: Zap, texto: "Acesso ilimitado a todos os treinos" },
    { icon: TrendingUp, texto: "Planos personalizados com IA" },
    { icon: Users, texto: "Suporte prioritário 24/7" },
    { icon: Sparkles, texto: "Novos treinos toda semana" },
  ];

  const handleAssinar = async () => {
    setProcessando(true);
    
    try {
      // Simula processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plano = planos[planoSelecionado];
      
      // Salvar assinatura no localStorage
      const assinatura = {
        plano: planoSelecionado,
        valor: plano.preco,
        dataInicio: new Date().toISOString(),
        dataProximoPagamento: new Date(Date.now() + (planoSelecionado === "mensal" ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        status: "ativa"
      };
      
      localStorage.setItem("assinatura", JSON.stringify(assinatura));
      
      alert(`✅ Assinatura ${plano.nome} ativada com sucesso!\n\nValor: R$ ${plano.preco.toFixed(2).replace(".", ",")}\nPróximo pagamento: ${new Date(assinatura.dataProximoPagamento).toLocaleDateString("pt-BR")}`);
      
      router.push("/");
    } catch (error) {
      alert("❌ Erro ao processar assinatura. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  const planoAtual = planos[planoSelecionado];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Oferta especial por tempo limitado
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Transforme seu
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
              corpo e mente
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Escolha o plano ideal para alcançar seus objetivos fitness
          </p>
        </div>

        {/* Toggle de Planos */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setPlanoSelecionado("mensal")}
              className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                planoSelecionado === "mensal"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPlanoSelecionado("anual")}
              className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative text-sm sm:text-base ${
                planoSelecionado === "anual"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                -76%
              </span>
            </button>
          </div>
        </div>

        {/* Card do Plano Selecionado */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-500 transform hover:scale-[1.02] transition-transform duration-300">
            
            {/* Header do Card */}
            <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 text-white text-center relative overflow-hidden">
              {/* Efeito de fundo */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-4 border border-white/30">
                  {planoAtual.badge}
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  Plano {planoAtual.nome}
                </h2>
                
                <p className="text-blue-100 text-lg mb-6">
                  {planoAtual.descricao}
                </p>

                {/* Preço */}
                <div className="space-y-2">
                  {planoSelecionado === "anual" && (
                    <div className="text-blue-100 line-through text-xl">
                      R$ {planos.anual.precoOriginal.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                  
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl sm:text-6xl font-extrabold">
                      R$ {planoAtual.preco.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xl sm:text-2xl text-blue-100">
                      /{planoAtual.periodo}
                    </span>
                  </div>

                  <div className="text-blue-100 text-base sm:text-lg">
                    Apenas R$ {planoAtual.precoPorMes.toFixed(2).replace(".", ",")} por mês
                  </div>

                  {planoSelecionado === "anual" && (
                    <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2 rounded-full text-sm mt-2 shadow-lg">
                      💰 Economize {planos.anual.economia}% no plano anual
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                Tudo que você precisa para evoluir
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {beneficios.map((beneficio, index) => {
                  const Icon = beneficio.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium pt-2 text-sm sm:text-base">
                        {beneficio.texto}
                      </span>
                    </div>
                  );
                })}\n              </div>

              {/* Lista adicional */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <ul className="space-y-3">
                  {[
                    "Acompanhamento de progresso detalhado",
                    "Acesso ao app mobile iOS e Android",
                    "Relatórios de evolução semanais",
                    "Comunidade exclusiva de membros",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={handleAssinar}
                disabled={processando}
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-base sm:text-lg py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {processando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Começar Agora
                  </>
                )}
              </button>
              
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Pagamento seguro • Cancele quando quiser
              </p>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 text-center border-2 border-green-300 dark:border-green-700 shadow-lg">
            <div className="text-4xl sm:text-5xl mb-4">✅</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Garantia de 7 dias
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
              Experimente sem riscos! Se não ficar satisfeito, devolvemos 100% do seu investimento nos primeiros 7 dias. Sem perguntas, sem complicações.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            Junte-se a mais de 10.000 pessoas transformando suas vidas
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white dark:border-gray-900 shadow-md"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              +10.000 membros ativos
            </span>
          </div>
          
          {/* Avaliações */}
          <div className="mt-6 flex justify-center items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
              4.9/5 (2.847 avaliações)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

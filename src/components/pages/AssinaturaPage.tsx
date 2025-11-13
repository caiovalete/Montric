"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Download,
  FileText,
  Clock,
  TrendingUp
} from "lucide-react";

export default function AssinaturaPage() {
  const [currentPlan, setCurrentPlan] = useState("premium");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: { monthly: 49.90, yearly: 499.90 },
      icon: Star,
      color: "from-gray-500 to-gray-600",
      features: [
        "Acompanhamento de peso",
        "Registro de medicação",
        "Gráficos básicos",
        "Suporte por email"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 99.90, yearly: 999.90 },
      icon: Crown,
      color: "from-[#064D58] to-[#085563]",
      popular: true,
      features: [
        "Tudo do plano Básico",
        "Análises avançadas",
        "Plano alimentar personalizado",
        "Consultas com nutricionista",
        "Suporte prioritário 24/7",
        "Relatórios detalhados"
      ]
    },
    {
      id: "elite",
      name: "Elite",
      price: { monthly: 199.90, yearly: 1999.90 },
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      features: [
        "Tudo do plano Premium",
        "Acompanhamento médico mensal",
        "Ajuste de dosagem personalizado",
        "Acesso a eventos exclusivos",
        "Programa de recompensas VIP",
        "Consultoria nutricional ilimitada"
      ]
    }
  ];

  const subscriptionInfo = {
    status: "active",
    startDate: "01/01/2024",
    nextBilling: "01/02/2024",
    paymentMethod: "Cartão •••• 4321",
    amount: billingCycle === "monthly" ? 99.90 : 999.90
  };

  const invoices = [
    { id: 1, date: "01/01/2024", amount: 99.90, status: "paid" },
    { id: 2, date: "01/12/2023", amount: 99.90, status: "paid" },
    { id: 3, date: "01/11/2023", amount: 99.90, status: "paid" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Gerenciar Assinatura</h2>
            <p className="text-gray-200">Controle seu plano e pagamentos</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
            <div className="text-sm text-gray-200 mb-1">Plano Atual</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#2DD6C1]" />
              Premium
            </div>
          </div>
        </div>
      </div>

      {/* Status da Assinatura */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Status da Assinatura
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
            <p className="text-lg font-bold text-green-600">Ativa</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Início</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{subscriptionInfo.startDate}</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Próxima Cobrança</span>
            </div>
            <p className="text-lg font-bold text-orange-600">{subscriptionInfo.nextBilling}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Valor</span>
            </div>
            <p className="text-lg font-bold text-purple-600">
              R$ {subscriptionInfo.amount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Método de Pagamento</p>
              <p className="font-semibold text-gray-800">{subscriptionInfo.paymentMethod}</p>
            </div>
          </div>
          <button className="text-[#064D58] font-semibold hover:text-[#085563] transition-colors flex items-center gap-2">
            Atualizar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seletor de Ciclo de Cobrança */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Escolha seu Plano</h3>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-[#064D58] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-[#064D58] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Anual
              <span className="ml-1 text-xs text-green-600 font-bold">-17%</span>
            </button>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === currentPlan;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border-2 transition-all hover:scale-105 ${
                  isCurrentPlan
                    ? "border-[#2DD6C1] bg-gradient-to-br from-[#2DD6C1]/5 to-[#064D58]/5 shadow-xl"
                    : "border-gray-200 bg-white hover:border-[#2DD6C1]/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2DD6C1] to-[#064D58] text-white px-4 py-1 rounded-full text-xs font-bold">
                    MAIS POPULAR
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Plano Atual
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#064D58]">
                    R$ {plan.price[billingCycle].toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    /{billingCycle === "monthly" ? "mês" : "ano"}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isCurrentPlan
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#2DD6C1] to-[#064D58] text-white hover:shadow-lg hover:scale-105"
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Plano Atual" : "Selecionar Plano"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico de Faturas */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Histórico de Faturas
        </h3>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Fatura #{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-gray-800">R$ {invoice.amount.toFixed(2)}</p>
                  <p className="text-xs text-green-600 font-medium">Pago</p>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios do Plano Atual */}
      <div className="bg-gradient-to-br from-[#064D58] to-[#085563] rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Benefícios do seu Plano Premium
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Shield className="w-8 h-8 text-[#2DD6C1] mb-2" />
            <h4 className="font-semibold mb-1">Suporte Prioritário</h4>
            <p className="text-sm text-gray-200">Atendimento 24/7 com prioridade</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Star className="w-8 h-8 text-[#2DD6C1] mb-2" />
            <h4 className="font-semibold mb-1">Análises Avançadas</h4>
            <p className="text-sm text-gray-200">Relatórios detalhados do seu progresso</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Crown className="w-8 h-8 text-[#2DD6C1] mb-2" />
            <h4 className="font-semibold mb-1">Consultas Ilimitadas</h4>
            <p className="text-sm text-gray-200">Acesso a nutricionistas especializados</p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Gerenciar Assinatura</h3>
        <div className="space-y-3">
          <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center justify-between">
            <span className="font-medium text-gray-800">Pausar Assinatura</span>
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-full p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left flex items-center justify-between">
            <div>
              <span className="font-medium text-red-600 block">Cancelar Assinatura</span>
              <span className="text-xs text-red-500">Você perderá acesso aos benefícios premium</span>
            </div>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

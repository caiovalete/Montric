"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Droplet, 
  Dumbbell, 
  TrendingUp, 
  Calendar,
  Smile,
  Meh,
  Frown,
  Plus,
  ChevronRight,
  Home,
  Activity,
  Utensils,
  Syringe,
  ChevronLeft,
  User,
  FileText,
  X,
  Flame,
  CreditCard
} from "lucide-react";
import ProgressoPage from "@/components/pages/ProgressoPage";
import AlimentacaoPage from "@/components/pages/AlimentacaoPage";
import TratamentoPage from "@/components/pages/TratamentoPage";
import PerfilPage from "@/components/pages/PerfilPage";
import AssinaturaPage from "@/components/pages/AssinaturaPage";

type Page = "dashboard" | "progresso" | "alimentacao" | "tratamento" | "perfil" | "assinatura";

export default function MontricApp() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [waterProgress, setWaterProgress] = useState(1200);
  const [proteinProgress, setProteinProgress] = useState(85);
  const [caloriesConsumed, setCaloriesConsumed] = useState(1200);
  const [mood, setMood] = useState<number | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const waterGoal = 2000;
  const proteinGoal = 120;
  const caloriesGoal = 2000; // Meta de calorias consumidas

  const waterPercentage = (waterProgress / waterGoal) * 100;
  const proteinPercentage = (proteinProgress / proteinGoal) * 100;
  const caloriesPercentage = (caloriesConsumed / caloriesGoal) * 100;

  // Dados do calendário - slider de datas
  const getDaysArray = () => {
    const days = [];
    const baseDate = new Date(selectedDate);
    
    // Gera 15 dias: 7 anteriores, dia selecionado, 7 posteriores
    for (let i = -7; i <= 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const daysArray = getDaysArray();
  const today = new Date();

  // Auto-scroll para o dia selecionado
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedIndex = daysArray.findIndex(
        date => date.toDateString() === selectedDate.toDateString()
      );
      
      if (selectedIndex !== -1) {
        const itemWidth = 68; // largura aproximada de cada item (60px + gap)
        const scrollPosition = (selectedIndex * itemWidth) - (container.clientWidth / 2) + (itemWidth / 2);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDate]);

  // Simular dados de metas cumpridas
  const dailyGoals: { [key: string]: number } = {
    [new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toDateString()]: 100,
    [new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toDateString()]: 85,
    [new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toDateString()]: 100,
    [today.toDateString()]: 75,
  };

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                      "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const renderDashboard = () => (
    <>
      {/* Próxima Aplicação */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-6 mb-6 text-white shadow-xl">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-[#2DD6C1]" />
              <span className="text-sm font-medium text-[#2DD6C1]">Próxima Aplicação</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Sábado, 15:00</h2>
            <p className="text-sm text-gray-300">Mounjaro 5mg - Faltam 2 dias</p>
          </div>
          <button className="bg-[#2DD6C1] text-[#064D58] px-4 py-2 rounded-lg font-semibold hover:bg-[#26c4b0] transition-all hover:scale-105 text-sm sm:text-base w-full sm:w-auto">
            Registrar Agora
          </button>
        </div>
      </div>

      {/* Calendário Slider Minimalista */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Slider de Datas */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {daysArray.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today && !isToday;
            const isFuture = date > today;
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const goalPercentage = dailyGoals[date.toDateString()] || 0;

            let dotColor = "";
            
            if (isPast) {
              if (goalPercentage === 100) {
                dotColor = "bg-[#2DD6C1]";
              } else if (goalPercentage >= 50) {
                dotColor = "bg-yellow-400";
              } else if (goalPercentage > 0) {
                dotColor = "bg-red-400";
              }
            }

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl transition-all w-[60px] ${
                  isSelected
                    ? "bg-[#064D58] text-white shadow-md scale-105"
                    : isToday
                    ? "bg-[#2DD6C1]/10 text-[#064D58] border-2 border-[#2DD6C1]"
                    : isFuture
                    ? "text-gray-300 hover:bg-gray-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-xs font-medium mb-1">
                  {dayNames[date.getDay()]}
                </span>
                <span className="text-lg font-bold">
                  {date.getDate()}
                </span>
                {isPast && dotColor && (
                  <div className={`w-1.5 h-1.5 ${dotColor} rounded-full mt-1`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metas Diárias */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#064D58] mb-4">Metas de Hoje</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Água */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800">Água</span>
              </div>
              <button 
                onClick={() => setWaterProgress(prev => Math.min(prev + 250, waterGoal))}
                className="bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{waterProgress}ml</span>
                <span className="text-gray-400">{waterGoal}ml</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(waterPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{Math.round(waterPercentage)}% concluído</p>
          </div>

          {/* Proteína */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Dumbbell className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-semibold text-gray-800">Proteína</span>
              </div>
              <button 
                onClick={() => setProteinProgress(prev => Math.min(prev + 20, proteinGoal))}
                className="bg-orange-50 hover:bg-orange-100 p-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-orange-600" />
              </button>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{proteinProgress}g</span>
                <span className="text-gray-400">{proteinGoal}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{Math.round(proteinPercentage)}% concluído</p>
          </div>

          {/* Calorias Consumidas */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Utensils className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Calorias</span>
              </div>
              <button 
                onClick={() => setCaloriesConsumed(prev => Math.min(prev + 100, caloriesGoal))}
                className="bg-green-50 hover:bg-green-100 p-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{caloriesConsumed} kcal</span>
                <span className="text-gray-400">{caloriesGoal} kcal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(caloriesPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{Math.round(caloriesPercentage)}% concluído</p>
            <p className="text-xs text-gray-400 mt-1">🍽️ Vinculado à alimentação</p>
          </div>
        </div>
      </div>

      {/* Diário de Bem-estar */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Como você está hoje?</h3>
        
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setMood(5)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              mood === 5 ? 'bg-green-100 scale-110' : 'hover:bg-gray-100'
            }`}
          >
            <Smile className={`w-8 h-8 ${mood === 5 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Ótimo</span>
          </button>
          <button
            onClick={() => setMood(3)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              mood === 3 ? 'bg-yellow-100 scale-110' : 'hover:bg-gray-100'
            }`}
          >
            <Meh className={`w-8 h-8 ${mood === 3 ? 'text-yellow-600' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Normal</span>
          </button>
          <button
            onClick={() => setMood(1)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              mood === 1 ? 'bg-red-100 scale-110' : 'hover:bg-gray-100'
            }`}
          >
            <Frown className={`w-8 h-8 ${mood === 1 ? 'text-red-600' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">Ruim</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nível de Energia</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              defaultValue="3"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2DD6C1]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Efeitos Colaterais</label>
            <textarea 
              placeholder="Descreva como se sentiu hoje..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
              rows={3}
            ></textarea>
          </div>
          <button className="w-full bg-[#064D58] text-white py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors">
            Salvar Registro
          </button>
        </div>
      </div>

      {/* Frase Motivacional */}
      <div className="bg-gradient-to-r from-[#2DD6C1] to-[#064D58] rounded-xl p-6 text-white text-center shadow-xl">
        <p className="text-lg sm:text-xl font-semibold mb-2">
          "Cada passo conta na sua jornada! 💪"
        </p>
        <p className="text-sm opacity-90">
          Você está no caminho certo. Continue assim!
        </p>
      </div>
    </>
  );

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard();
      case "progresso":
        return <ProgressoPage />;
      case "alimentacao":
        return <AlimentacaoPage />;
      case "tratamento":
        return <TratamentoPage />;
      case "perfil":
        return <PerfilPage />;
      case "assinatura":
        return <AssinaturaPage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <header className="bg-[#064D58] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2e6264b4-2814-4124-b8d2-6d24827789b8.png" 
                alt="Montric Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Montric</h1>
                <p className="text-xs sm:text-sm text-[#2DD6C1]">Seu acompanhamento inteligente</p>
              </div>
            </div>
            
            {/* Botão de Perfil com Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative p-2 hover:bg-[#085563] rounded-full transition-colors"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage("perfil");
                    }}
                    className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Perfil</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage("assinatura");
                    }}
                    className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Assinatura</span>
                  </button>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Adicionar lógica de logout
                    }}
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setCurrentPage("dashboard")}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                currentPage === "dashboard"
                  ? "text-[#064D58]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => setCurrentPage("progresso")}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                currentPage === "progresso"
                  ? "text-[#064D58]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button
              onClick={() => setCurrentPage("alimentacao")}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                currentPage === "alimentacao"
                  ? "text-[#064D58]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Utensils className="w-6 h-6" />
              <span className="text-xs font-medium">Alimentação</span>
            </button>

            <button
              onClick={() => setCurrentPage("tratamento")}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                currentPage === "tratamento"
                  ? "text-[#064D58]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Syringe className="w-6 h-6" />
              <span className="text-xs font-medium">Tratamento</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

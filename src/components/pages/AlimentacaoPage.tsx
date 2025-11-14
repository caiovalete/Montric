"use client";

import { useState, useEffect, useRef } from "react";
import {
  Utensils,
  Plus,
  Calendar,
  Clock,
  Flame,
  TrendingUp,
  TrendingDown,
  Apple,
  Coffee,
  Soup,
  Cookie,
  XCircle,
  ChevronRight,
  Edit,
  Trash2,
  FileText,
  Camera,
  Upload,
  Loader2,
  X,
  Search,
} from "lucide-react";

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
}

interface Meal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  time: string;
  foods: FoodItem[];
  totalCalories: number;
  notes: string | null;
  imageUrl?: string;
}

interface DailySummary {
  date: string;
  totalCalories: number;
  mealsCount: number;
  goal: number;
}

// Banco de dados de alimentos com calorias por 100g
const FOOD_DATABASE: Record<string, number> = {
  "arroz branco": 130,
  "arroz integral": 111,
  "feijão preto": 77,
  "feijão carioca": 76,
  "frango grelhado": 165,
  "frango frito": 246,
  "carne bovina": 250,
  "filé mignon": 170,
  "picanha": 210,
  "peixe grelhado": 96,
  "salmão": 208,
  "ovo cozido": 155,
  "ovo frito": 196,
  "batata frita": 312,
  "batata cozida": 87,
  "macarrão": 131,
  "pão francês": 300,
  "pão integral": 247,
  "queijo mussarela": 280,
  "queijo prato": 360,
  "leite integral": 61,
  "leite desnatado": 35,
  "iogurte natural": 61,
  "banana": 89,
  "maçã": 52,
  "laranja": 47,
  "morango": 32,
  "alface": 15,
  "tomate": 18,
  "cenoura": 41,
  "brócolis": 34,
  "azeite": 884,
  "manteiga": 717,
  "açúcar": 387,
  "chocolate": 546,
  "sorvete": 207,
  "pizza": 266,
  "hambúrguer": 295,
  "refrigerante": 42,
  "suco de laranja": 45,
  "café": 1,
  "chá": 1,
};

const MEAL_TYPES = [
  { value: "breakfast", label: "Café da Manhã", icon: Coffee },
  { value: "lunch", label: "Almoço", icon: Soup },
  { value: "dinner", label: "Jantar", icon: Utensils },
  { value: "snack", label: "Lanche", icon: Cookie },
];

export default function AlimentacaoPage() {
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "1",
      type: "breakfast",
      date: "2024-01-20",
      time: "08:30",
      foods: [
        { name: "Pão integral", quantity: "50g", calories: 124 },
        { name: "Ovo cozido", quantity: "100g", calories: 155 },
      ],
      totalCalories: 279,
      notes: "Café da manhã leve e saudável",
    },
    {
      id: "2",
      type: "lunch",
      date: "2024-01-20",
      time: "12:45",
      foods: [
        { name: "Arroz integral", quantity: "150g", calories: 167 },
        { name: "Frango grelhado", quantity: "200g", calories: 330 },
        { name: "Feijão preto", quantity: "100g", calories: 77 },
      ],
      totalCalories: 574,
      notes: null,
    },
  ]);

  // Função para obter data e hora atuais
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const [formData, setFormData] = useState(() => {
    const { date, time } = getCurrentDateTime();
    return {
      type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
      date,
      time,
      notes: "",
    };
  });

  // Estado para os alimentos sendo adicionados
  const [foodItems, setFoodItems] = useState<Array<{ name: string; quantity: string; calories: number }>>([
    { name: "", quantity: "", calories: 0 },
  ]);

  const [editFormData, setEditFormData] = useState({
    type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    date: "",
    time: "",
    notes: "",
  });

  const [editFoodItems, setEditFoodItems] = useState<Array<{ name: string; quantity: string; calories: number }>>([]);

  const [quickAddData, setQuickAddData] = useState(() => {
    const { date, time } = getCurrentDateTime();
    return {
      type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
      date,
      time,
    };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFoodIndex, setActiveFoodIndex] = useState<number | null>(null);

  const dailyGoal = 1800;

  // Calcular resumo do dia atual
  const today = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((meal) => meal.date === today);
  const todayCalories = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const caloriesRemaining = dailyGoal - todayCalories;
  const progressPercentage = Math.min((todayCalories / dailyGoal) * 100, 100);

  // Calcular calorias com base no alimento e quantidade
  const calculateCalories = (foodName: string, quantity: string): number => {
    const normalizedName = foodName.toLowerCase().trim();
    const caloriesPer100g = FOOD_DATABASE[normalizedName];

    if (!caloriesPer100g) return 0;

    // Extrair número da quantidade (ex: "150g" -> 150)
    const quantityMatch = quantity.match(/(\d+)/);
    if (!quantityMatch) return 0;

    const grams = parseInt(quantityMatch[1]);
    return Math.round((caloriesPer100g * grams) / 100);
  };

  // Adicionar nova linha de alimento
  const addFoodLine = () => {
    setFoodItems([...foodItems, { name: "", quantity: "", calories: 0 }]);
  };

  // Remover linha de alimento
  const removeFoodLine = (index: number) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((_, i) => i !== index));
    }
  };

  // Atualizar alimento
  const updateFoodItem = (index: number, field: "name" | "quantity", value: string) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index][field] = value;

    // Recalcular calorias automaticamente
    if (field === "name" || field === "quantity") {
      const calories = calculateCalories(newFoodItems[index].name, newFoodItems[index].quantity);
      newFoodItems[index].calories = calories;
    }

    setFoodItems(newFoodItems);
  };

  // Filtrar sugestões de alimentos
  const getFoodSuggestions = (search: string) => {
    if (!search || search.length < 2) return [];
    const normalizedSearch = search.toLowerCase();
    return Object.keys(FOOD_DATABASE)
      .filter((food) => food.includes(normalizedSearch))
      .slice(0, 5);
  };

  // Selecionar sugestão
  const selectSuggestion = (index: number, foodName: string) => {
    updateFoodItem(index, "name", foodName);
    setShowSuggestions(false);
    setActiveFoodIndex(null);
  };

  const handleAddMeal = () => {
    if (!formData.date || !formData.time) {
      alert("Preencha data e horário");
      return;
    }

    // Filtrar alimentos válidos
    const validFoods = foodItems.filter((item) => item.name.trim() && item.quantity.trim() && item.calories > 0);

    if (validFoods.length === 0) {
      alert("Adicione pelo menos um alimento válido");
      return;
    }

    const totalCalories = validFoods.reduce((sum, item) => sum + item.calories, 0);

    const newMeal: Meal = {
      id: Date.now().toString(),
      type: formData.type,
      date: formData.date,
      time: formData.time,
      foods: validFoods,
      totalCalories,
      notes: formData.notes || null,
    };

    setMeals([newMeal, ...meals]);

    // Resetar formulário com data/hora atuais
    const { date, time } = getCurrentDateTime();
    setFormData({
      type: "breakfast",
      date,
      time,
      notes: "",
    });
    setFoodItems([{ name: "", quantity: "", calories: 0 }]);
    setShowAddMeal(false);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 10MB");
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analisar imagem com IA
    setIsAnalyzing(true);

    try {
      // Simular análise de IA (em produção, chamar API real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Resultado simulado da análise
      const analyzedFoods: FoodItem[] = [
        { name: "Arroz branco", quantity: "150g", calories: 195 },
        { name: "Feijão preto", quantity: "100g", calories: 77 },
        { name: "Filé mignon", quantity: "200g", calories: 340 },
        { name: "Alface", quantity: "50g", calories: 8 },
      ];

      const totalCalories = analyzedFoods.reduce((sum, item) => sum + item.calories, 0);

      // Criar nova refeição
      const newMeal: Meal = {
        id: Date.now().toString(),
        type: quickAddData.type,
        date: quickAddData.date,
        time: quickAddData.time,
        foods: analyzedFoods,
        totalCalories,
        notes: "Refeição identificada automaticamente por IA",
        imageUrl: reader.result as string,
      };

      setMeals([newMeal, ...meals]);
      setPhotoPreview(null);

      // Resetar com data/hora atuais
      const { date, time } = getCurrentDateTime();
      setQuickAddData({
        type: "breakfast",
        date,
        time,
      });

      alert("Refeição adicionada com sucesso! Os alimentos e calorias foram identificados automaticamente.");
    } catch (error) {
      alert("Erro ao analisar a imagem. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setEditFormData({
      type: meal.type,
      date: meal.date,
      time: meal.time,
      notes: meal.notes || "",
    });
    setEditFoodItems(meal.foods.map((f) => ({ ...f })));
    setShowEditModal(true);
  };

  const addEditFoodLine = () => {
    setEditFoodItems([...editFoodItems, { name: "", quantity: "", calories: 0 }]);
  };

  const removeEditFoodLine = (index: number) => {
    if (editFoodItems.length > 1) {
      setEditFoodItems(editFoodItems.filter((_, i) => i !== index));
    }
  };

  const updateEditFoodItem = (index: number, field: "name" | "quantity", value: string) => {
    const newFoodItems = [...editFoodItems];
    newFoodItems[index][field] = value;

    // Recalcular calorias automaticamente
    if (field === "name" || field === "quantity") {
      const calories = calculateCalories(newFoodItems[index].name, newFoodItems[index].quantity);
      newFoodItems[index].calories = calories;
    }

    setEditFoodItems(newFoodItems);
  };

  const handleUpdateMeal = () => {
    if (!editFormData.date || !editFormData.time || !editingMeal) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const validFoods = editFoodItems.filter((item) => item.name.trim() && item.quantity.trim() && item.calories > 0);

    if (validFoods.length === 0) {
      alert("Adicione pelo menos um alimento válido");
      return;
    }

    const totalCalories = validFoods.reduce((sum, item) => sum + item.calories, 0);

    const updatedMeals = meals.map((m) =>
      m.id === editingMeal.id
        ? {
            ...m,
            type: editFormData.type,
            date: editFormData.date,
            time: editFormData.time,
            foods: validFoods,
            totalCalories,
            notes: editFormData.notes || null,
          }
        : m
    );

    setMeals(updatedMeals);
    setShowEditModal(false);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (confirm("Tem certeza que deseja excluir esta refeição?")) {
      setMeals(meals.filter((m) => m.id !== mealId));
    }
  };

  const handleViewMealDetail = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealDetail(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMealTypeLabel = (type: string) => {
    const mealType = MEAL_TYPES.find((mt) => mt.value === type);
    return mealType?.label || type;
  };

  const getMealTypeIcon = (type: string) => {
    const mealType = MEAL_TYPES.find((mt) => mt.value === type);
    const Icon = mealType?.icon || Utensils;
    return <Icon className="w-5 h-5" />;
  };

  // Agrupar refeições por data
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#064D58]">Alimentação</h2>
          <p className="text-sm text-gray-600">Registre suas refeições e acompanhe suas calorias</p>
        </div>
      </div>

      {/* Resumo Diário */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#2DD6C1]" />
          <span className="text-sm font-medium text-[#2DD6C1]">Resumo de Hoje</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-300 mb-1">Consumido</p>
            <p className="text-3xl font-bold">{todayCalories}</p>
            <p className="text-xs text-gray-300">calorias</p>
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">Meta Diária</p>
            <p className="text-3xl font-bold">{dailyGoal}</p>
            <p className="text-xs text-gray-300">calorias</p>
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">Restante</p>
            <div className="flex items-center gap-2">
              <p className={`text-3xl font-bold ${caloriesRemaining >= 0 ? "text-[#2DD6C1]" : "text-red-300"}`}>
                {Math.abs(caloriesRemaining)}
              </p>
              {caloriesRemaining >= 0 ? (
                <TrendingDown className="w-6 h-6 text-[#2DD6C1]" />
              ) : (
                <TrendingUp className="w-6 h-6 text-red-300" />
              )}
            </div>
            <p className="text-xs text-gray-300">{caloriesRemaining >= 0 ? "disponíveis" : "excedidas"}</p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              progressPercentage >= 100 ? "bg-red-400" : "bg-[#2DD6C1]"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-300 mt-2 text-center">{progressPercentage.toFixed(0)}% da meta diária</p>
      </div>

      {/* Adicionar Refeição Rápido - Sempre Visível */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#2DD6C1]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#064D58]">Adicionar Refeição de Hoje</h3>
        </div>

        <div className="space-y-4">
          {/* Tipo de Refeição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Refeição</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MEAL_TYPES.map((mealType) => {
                const Icon = mealType.icon;
                return (
                  <button
                    key={mealType.value}
                    onClick={() => setQuickAddData({ ...quickAddData, type: mealType.value as any })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      quickAddData.type === mealType.value
                        ? "border-[#064D58] bg-[#064D58]/10 text-[#064D58]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={isAnalyzing}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{mealType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={quickAddData.date}
                onChange={(e) => setQuickAddData({ ...quickAddData, date: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                disabled={isAnalyzing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <input
                type="time"
                value={quickAddData.time}
                onChange={(e) => setQuickAddData({ ...quickAddData, time: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                disabled={isAnalyzing}
              />
            </div>
          </div>

          {/* Preview da Foto */}
          {photoPreview && (
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
              <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm font-medium">Analisando imagem...</p>
                    <p className="text-xs mt-1">Identificando alimentos e calorias</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzing}
              className="bg-[#2DD6C1] text-white py-4 rounded-lg font-semibold hover:bg-[#26c0ad] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5" />
              Tirar Foto
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="bg-[#064D58] text-white py-4 rounded-lg font-semibold hover:bg-[#085563] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              Enviar Foto
            </button>
          </div>

          {/* Inputs ocultos para foto */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isAnalyzing}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isAnalyzing}
          />

          {/* Botão Manual */}
          <button
            onClick={() => setShowAddMeal(true)}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Manualmente
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Dica:</strong> Tire uma foto do seu prato e nossa IA identificará automaticamente os alimentos e calculará as calorias!
            </p>
          </div>
        </div>
      </div>

      {/* Refeições de Hoje */}
      {todayMeals.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#064D58] mb-4">Refeições de Hoje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                {meal.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img src={meal.imageUrl} alt="Foto da refeição" className="w-full h-32 object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#064D58]/10 p-3 rounded-lg text-[#064D58]">
                      {getMealTypeIcon(meal.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{getMealTypeLabel(meal.type)}</h4>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar refeição"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir refeição"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {meal.foods.slice(0, 2).map((f) => f.name).join(", ")}
                    </span>
                    {meal.foods.length > 2 && (
                      <span className="text-xs text-gray-500">+{meal.foods.length - 2} mais</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-900">{meal.totalCalories} calorias</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewMealDetail(meal)}
                  className="w-full bg-[#064D58] text-white py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2"
                >
                  Ver Detalhes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Refeições */}
      <div>
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Histórico de Refeições</h3>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {sortedDates.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {sortedDates.map((date) => {
                const dateMeals = groupedMeals[date];
                const dateCalories = dateMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);

                return (
                  <div key={date} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#064D58]" />
                        <span className="font-semibold text-gray-900">{formatDate(date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-900">{dateCalories} cal</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dateMeals.map((meal) => (
                        <div
                          key={meal.id}
                          onClick={() => handleViewMealDetail(meal)}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#064D58]">{getMealTypeIcon(meal.type)}</div>
                            <div>
                              <p className="font-medium text-gray-900">{getMealTypeLabel(meal.type)}</p>
                              <p className="text-xs text-gray-600">{meal.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{meal.totalCalories} cal</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma refeição registrada ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar Refeição Manual */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Nova Refeição</h3>
              <button
                onClick={() => setShowAddMeal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição *</label>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TYPES.map((mealType) => {
                    const Icon = mealType.icon;
                    return (
                      <button
                        key={mealType.value}
                        onClick={() => setFormData({ ...formData, type: mealType.value as any })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.type === mealType.value
                            ? "border-[#064D58] bg-[#064D58]/10 text-[#064D58]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{mealType.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>

              {/* Lista de Alimentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alimentos *</label>
                <div className="space-y-3">
                  {foodItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            updateFoodItem(index, "name", e.target.value);
                            setActiveFoodIndex(index);
                            setShowSuggestions(e.target.value.length >= 2);
                          }}
                          onFocus={() => {
                            setActiveFoodIndex(index);
                            setShowSuggestions(item.name.length >= 2);
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setShowSuggestions(false);
                              setActiveFoodIndex(null);
                            }, 200);
                          }}
                          placeholder="Ex: Arroz branco"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                        />
                        {/* Sugestões */}
                        {showSuggestions && activeFoodIndex === index && item.name.length >= 2 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {getFoodSuggestions(item.name).map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectSuggestion(index, suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="capitalize">{suggestion}</span>
                                  <span className="text-xs text-gray-500">{FOOD_DATABASE[suggestion]} cal/100g</span>
                                </div>
                              </button>
                            ))}
                            {getFoodSuggestions(item.name).length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">Nenhum alimento encontrado</div>
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateFoodItem(index, "quantity", e.target.value)}
                        placeholder="Ex: 150g"
                        className="w-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                      />
                      <div className="w-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-semibold text-sm">
                        {item.calories} cal
                      </div>
                      {foodItems.length > 1 && (
                        <button
                          onClick={() => removeFoodLine(index)}
                          className="p-3 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={addFoodLine}
                  className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Alimento
                </button>

                {/* Total de Calorias */}
                <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total de Calorias:</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {foodItems.reduce((sum, item) => sum + item.calories, 0)} cal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações sobre a refeição..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={2}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMeal}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Refeição */}
      {showEditModal && editingMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Editar Refeição</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMeal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição *</label>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TYPES.map((mealType) => {
                    const Icon = mealType.icon;
                    return (
                      <button
                        key={mealType.value}
                        onClick={() => setEditFormData({ ...editFormData, type: mealType.value as any })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editFormData.type === mealType.value
                            ? "border-[#064D58] bg-[#064D58]/10 text-[#064D58]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{mealType.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                  <input
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>

              {/* Lista de Alimentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alimentos *</label>
                <div className="space-y-3">
                  {editFoodItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            updateEditFoodItem(index, "name", e.target.value);
                            setActiveFoodIndex(index);
                            setShowSuggestions(e.target.value.length >= 2);
                          }}
                          onFocus={() => {
                            setActiveFoodIndex(index);
                            setShowSuggestions(item.name.length >= 2);
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setShowSuggestions(false);
                              setActiveFoodIndex(null);
                            }, 200);
                          }}
                          placeholder="Ex: Arroz branco"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                        />
                        {/* Sugestões */}
                        {showSuggestions && activeFoodIndex === index && item.name.length >= 2 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {getFoodSuggestions(item.name).map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  updateEditFoodItem(index, "name", suggestion);
                                  setShowSuggestions(false);
                                  setActiveFoodIndex(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="capitalize">{suggestion}</span>
                                  <span className="text-xs text-gray-500">{FOOD_DATABASE[suggestion]} cal/100g</span>
                                </div>
                              </button>
                            ))}
                            {getFoodSuggestions(item.name).length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">Nenhum alimento encontrado</div>
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateEditFoodItem(index, "quantity", e.target.value)}
                        placeholder="Ex: 150g"
                        className="w-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                      />
                      <div className="w-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-semibold text-sm">
                        {item.calories} cal
                      </div>
                      {editFoodItems.length > 1 && (
                        <button
                          onClick={() => removeEditFoodLine(index)}
                          className="p-3 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={addEditFoodLine}
                  className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Alimento
                </button>

                {/* Total de Calorias */}
                <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total de Calorias:</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {editFoodItems.reduce((sum, item) => sum + item.calories, 0)} cal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Anotações sobre a refeição..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={2}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMeal(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateMeal}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Refeição */}
      {showMealDetail && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Detalhes da Refeição</h3>
              <button
                onClick={() => {
                  setShowMealDetail(false);
                  setSelectedMeal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Foto da Refeição */}
              {selectedMeal.imageUrl && (
                <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={selectedMeal.imageUrl} alt="Foto da refeição" className="w-full h-48 object-cover" />
                  <div className="bg-[#2DD6C1]/10 p-2 text-center">
                    <p className="text-xs text-[#064D58] font-medium">Identificado por IA</p>
                  </div>
                </div>
              )}

              {/* Tipo de Refeição */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#064D58]/10 p-3 rounded-lg text-[#064D58]">
                    {getMealTypeIcon(selectedMeal.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Refeição</p>
                    <p className="font-bold text-gray-900">{getMealTypeLabel(selectedMeal.type)}</p>
                  </div>
                </div>
              </div>

              {/* Data e Hora */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#064D58]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-0.5">Data</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedMeal.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                  <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                    <Clock className="w-5 h-5 text-[#064D58]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-0.5">Horário</p>
                    <p className="font-semibold text-gray-900">{selectedMeal.time}</p>
                  </div>
                </div>
              </div>

              {/* Alimentos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                    <Apple className="w-5 h-5 text-[#064D58]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Alimentos</p>
                    <div className="space-y-2">
                      {selectedMeal.foods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#064D58] rounded-full"></span>
                            <span className="text-gray-900">{food.name}</span>
                            <span className="text-xs text-gray-500">({food.quantity})</span>
                          </div>
                          <span className="text-sm font-semibold text-orange-600">{food.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calorias */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-0.5">Total de Calorias</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedMeal.totalCalories} cal</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedMeal.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                      <FileText className="w-5 h-5 text-[#064D58]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Observações</p>
                      <p className="text-gray-900">{selectedMeal.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowMealDetail(false);
                setSelectedMeal(null);
              }}
              className="w-full bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors mt-6"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

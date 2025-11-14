"use client";

import { useState, useEffect, useRef } from "react";
import { 
  TrendingDown, 
  Scale, 
  Ruler, 
  Camera, 
  Plus,
  Calendar,
  Save,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Edit2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

interface BodyMeasurement {
  id: string;
  waist: number | null;
  hip: number | null;
  chest: number | null;
  arm: number | null;
  thigh: number | null;
  date: string;
}

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date: string;
  notes: string | null;
}

export default function ProgressoPage() {
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showEditWeightModal, setShowEditWeightModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados para dados
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  
  // Estados para formulários
  const [weightForm, setWeightForm] = useState({
    id: "",
    weight: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  const [measurementData, setMeasurementData] = useState({
    waist: "",
    hip: "",
    chest: "",
    arm: "",
    thigh: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [photoData, setPhotoData] = useState({
    photo_file: null as File | null,
    photo_preview: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do localStorage e Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: weights } = await supabase
          .from('weight_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const { data: measures } = await supabase
          .from('body_measurements')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const { data: progressPhotos } = await supabase
          .from('progress_photos')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (weights) setWeightHistory(weights);
        if (measures) setMeasurements(measures);
        if (progressPhotos) setPhotos(progressPhotos);
      } else {
        const savedWeights = localStorage.getItem('weightHistory');
        const savedMeasurements = localStorage.getItem('bodyMeasurements');
        const savedPhotos = localStorage.getItem('progressPhotos');

        if (savedWeights) setWeightHistory(JSON.parse(savedWeights));
        if (savedMeasurements) setMeasurements(JSON.parse(savedMeasurements));
        if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      const savedWeights = localStorage.getItem('weightHistory');
      const savedMeasurements = localStorage.getItem('bodyMeasurements');
      const savedPhotos = localStorage.getItem('progressPhotos');

      if (savedWeights) setWeightHistory(JSON.parse(savedWeights));
      if (savedMeasurements) setMeasurements(JSON.parse(savedMeasurements));
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo peso
  const handleAddWeight = async () => {
    if (!weightForm.weight || !weightForm.date) {
      alert("Preencha o peso e a data");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let newEntry: WeightLog = {
        id: crypto.randomUUID(),
        weight: parseFloat(weightForm.weight),
        date: weightForm.date
      };
      
      if (user) {
        const { data, error } = await supabase.from('weight_logs').insert({
          user_id: user.id,
          weight: newEntry.weight,
          date: newEntry.date
        }).select().single();
        
        if (data && !error) {
          newEntry.id = data.id;
        }
      }

      const updated = [...weightHistory, newEntry].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setWeightHistory(updated);
      localStorage.setItem('weightHistory', JSON.stringify(updated));

      setWeightForm({
        id: "",
        weight: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddWeightModal(false);
    } catch (error) {
      console.error('Erro ao adicionar peso:', error);
      alert('Erro ao salvar peso');
    } finally {
      setSaving(false);
    }
  };

  // Editar peso existente
  const handleEditWeight = async () => {
    if (!weightForm.weight || !weightForm.date || !weightForm.id) {
      alert("Dados inválidos");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('weight_logs')
          .update({
            weight: parseFloat(weightForm.weight),
            date: weightForm.date
          })
          .eq('id', weightForm.id)
          .eq('user_id', user.id);
      }

      const updated = weightHistory.map(w => 
        w.id === weightForm.id 
          ? { ...w, weight: parseFloat(weightForm.weight), date: weightForm.date }
          : w
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setWeightHistory(updated);
      localStorage.setItem('weightHistory', JSON.stringify(updated));

      setWeightForm({
        id: "",
        weight: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowEditWeightModal(false);
    } catch (error) {
      console.error('Erro ao editar peso:', error);
      alert('Erro ao atualizar peso');
    } finally {
      setSaving(false);
    }
  };

  // Deletar peso
  const handleDeleteWeight = async (weightId: string) => {
    if (!confirm('Deseja realmente excluir este registro de peso?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('weight_logs')
          .delete()
          .eq('id', weightId)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Erro ao deletar no Supabase:', error);
          throw error;
        }
      }

      const updated = weightHistory.filter(w => w.id !== weightId);
      setWeightHistory(updated);
      localStorage.setItem('weightHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao deletar peso:', error);
      alert('Erro ao excluir registro');
    }
  };

  // Abrir modal de edição
  const openEditModal = (weight: WeightLog) => {
    setWeightForm({
      id: weight.id,
      weight: weight.weight.toString(),
      date: weight.date
    });
    setShowEditWeightModal(true);
  };

  // Adicionar medidas corporais
  const handleAddMeasurements = async () => {
    if (!measurementData.waist && !measurementData.hip && !measurementData.chest && 
        !measurementData.arm && !measurementData.thigh) {
      alert("Preencha pelo menos uma medida");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newEntry = {
        id: crypto.randomUUID(),
        waist: measurementData.waist ? parseFloat(measurementData.waist) : null,
        hip: measurementData.hip ? parseFloat(measurementData.hip) : null,
        chest: measurementData.chest ? parseFloat(measurementData.chest) : null,
        arm: measurementData.arm ? parseFloat(measurementData.arm) : null,
        thigh: measurementData.thigh ? parseFloat(measurementData.thigh) : null,
        date: measurementData.date
      };
      
      if (user) {
        await supabase.from('body_measurements').insert({
          user_id: user.id,
          ...newEntry
        });
      }

      const updated = [...measurements, newEntry];
      setMeasurements(updated);
      localStorage.setItem('bodyMeasurements', JSON.stringify(updated));

      setMeasurementData({
        waist: "",
        hip: "",
        chest: "",
        arm: "",
        thigh: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowMeasurementsModal(false);
    } catch (error) {
      console.error('Erro ao adicionar medidas:', error);
      alert('Erro ao salvar medidas');
    } finally {
      setSaving(false);
    }
  };

  // Manipular seleção de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoData({
        ...photoData,
        photo_file: file,
        photo_preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Upload de foto
  const handleAddPhoto = async () => {
    if (!photoData.photo_file || !photoData.photo_preview) {
      alert("Selecione uma foto");
      return;
    }

    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let photoUrl = photoData.photo_preview;
      
      if (user) {
        try {
          const fileExt = photoData.photo_file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('progress-photos')
            .upload(fileName, photoData.photo_file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!error) {
            const { data: { publicUrl } } = supabase.storage
              .from('progress-photos')
              .getPublicUrl(fileName);
            
            photoUrl = publicUrl;
          }
        } catch (storageError) {
          console.log('Storage não disponível, usando base64');
        }
      }

      const newEntry = {
        id: crypto.randomUUID(),
        photo_url: photoUrl,
        notes: photoData.notes || null,
        date: photoData.date
      };

      if (user) {
        await supabase.from('progress_photos').insert({
          user_id: user.id,
          ...newEntry
        });
      }

      const updated = [...photos, newEntry];
      setPhotos(updated);
      localStorage.setItem('progressPhotos', JSON.stringify(updated));

      setPhotoData({
        photo_file: null,
        photo_preview: "",
        notes: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowPhotoModal(false);
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      alert('Erro ao salvar foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Deletar foto
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('progress_photos')
          .delete()
          .eq('id', photoId);
      }

      const updated = photos.filter(p => p.id !== photoId);
      setPhotos(updated);
      localStorage.setItem('progressPhotos', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
    }
  };

  // Calcular estatísticas
  const calculateStats = () => {
    if (weightHistory.length === 0) {
      return {
        currentWeight: 0,
        initialWeight: 0,
        weightLost: 0,
        daysOnTreatment: 0,
        averageWeeklyLoss: 0,
        goalWeight: 75
      };
    }

    const sortedWeights = [...weightHistory].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const currentWeight = sortedWeights[sortedWeights.length - 1].weight;
    const initialWeight = sortedWeights[0].weight;
    const weightLost = initialWeight - currentWeight;

    const firstDate = new Date(sortedWeights[0].date);
    const lastDate = new Date(sortedWeights[sortedWeights.length - 1].date);
    const daysOnTreatment = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const weeks = daysOnTreatment / 7;
    const averageWeeklyLoss = weeks > 0 ? weightLost / weeks : 0;

    return {
      currentWeight,
      initialWeight,
      weightLost,
      daysOnTreatment,
      averageWeeklyLoss,
      goalWeight: 75
    };
  };

  const stats = calculateStats();

  const getCurrentMeasurements = () => {
    if (measurements.length === 0) return null;
    return measurements[0];
  };

  const getInitialMeasurements = () => {
    if (measurements.length === 0) return null;
    return measurements[measurements.length - 1];
  };

  const currentMeasurements = getCurrentMeasurements();
  const initialMeasurements = getInitialMeasurements();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064D58] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#064D58] to-[#085563] rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-[#2DD6C1]" />
            <span className="text-sm font-medium text-[#2DD6C1]">Peso Perdido</span>
          </div>
          <p className="text-3xl font-bold">{stats.weightLost.toFixed(1)} kg</p>
          <p className="text-xs text-gray-300 mt-1">Em {stats.daysOnTreatment} dias</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-[#064D58]" />
            <span className="text-sm font-medium text-gray-600">Peso Atual</span>
          </div>
          <p className="text-3xl font-bold text-[#064D58]">{stats.currentWeight.toFixed(1)} kg</p>
          <p className="text-xs text-gray-500 mt-1">Meta: {stats.goalWeight} kg</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#064D58]" />
            <span className="text-sm font-medium text-gray-600">Média Semanal</span>
          </div>
          <p className="text-3xl font-bold text-[#064D58]">{stats.averageWeeklyLoss.toFixed(1)} kg</p>
          <p className="text-xs text-gray-500 mt-1">Por semana</p>
        </div>
      </div>

      {/* Gráfico de Evolução de Peso */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Evolução de Peso</h3>
          <button
            onClick={() => setShowAddWeightModal(true)}
            className="flex items-center gap-2 bg-[#064D58] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#085563] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {weightHistory.length > 0 ? (
          <>
            {/* Gráfico Visual */}
            <div className="relative h-64 mb-6">
              <div className="h-full border-l-2 border-b-2 border-gray-300 pl-12 pb-8 relative">
                {/* Eixo Y - Labels de peso */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-10 text-right pr-2">
                  {(() => {
                    const weights = weightHistory.map(w => w.weight);
                    const maxWeight = Math.max(...weights);
                    const minWeight = Math.min(...weights);
                    const range = maxWeight - minWeight;
                    const padding = range * 0.1 || 5;
                    const chartMax = maxWeight + padding;
                    const chartMin = Math.max(0, minWeight - padding);
                    const chartRange = chartMax - chartMin;
                    
                    return [0, 1, 2, 3, 4].map((i) => {
                      const value = chartMax - (chartRange * i / 4);
                      return <span key={i}>{value.toFixed(0)}kg</span>;
                    });
                  })()}
                </div>

                {/* Barras do gráfico */}
                <div className="h-full flex items-end justify-between gap-2">
                  {(() => {
                    const sortedData = [...weightHistory]
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(-10);
                    
                    const weights = sortedData.map(w => w.weight);
                    const maxWeight = Math.max(...weights);
                    const minWeight = Math.min(...weights);
                    const range = maxWeight - minWeight;
                    const padding = range * 0.1 || 5;
                    const chartMax = maxWeight + padding;
                    const chartMin = Math.max(0, minWeight - padding);
                    const chartRange = chartMax - chartMin;
                    
                    return sortedData.map((entry) => {
                      const heightPercent = chartRange > 0 
                        ? ((entry.weight - chartMin) / chartRange) * 100 
                        : 50;
                      
                      return (
                        <div key={entry.id} className="flex-1 flex flex-col items-center gap-2 h-full">
                          <div className="flex-1 flex items-end w-full">
                            <div 
                              className="w-full bg-gradient-to-t from-[#064D58] to-[#2DD6C1] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group" 
                              style={{ height: `${heightPercent}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {entry.weight}kg
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            <p className="font-semibold">{entry.weight}kg</p>
                            <p className="text-[10px]">{formatDate(entry.date).slice(0, 6)}</p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Lista de Registros */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Histórico de Registros</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {[...weightHistory]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div 
                      key={entry.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Scale className="w-4 h-4 text-[#064D58]" />
                        <div>
                          <p className="font-semibold text-[#064D58]">{entry.weight} kg</p>
                          <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWeight(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Nenhum registro de peso ainda</p>
            <button
              onClick={() => setShowAddWeightModal(true)}
              className="bg-[#064D58] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
            >
              Adicionar Primeiro Registro
            </button>
          </div>
        )}
      </div>

      {/* Medidas Corporais */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Medidas Corporais</h3>
          <button 
            onClick={() => setShowMeasurementsModal(true)}
            className="flex items-center gap-2 text-[#064D58] text-sm font-semibold hover:text-[#085563]"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {currentMeasurements && initialMeasurements ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'waist', label: 'Cintura' },
              { key: 'hip', label: 'Quadril' },
              { key: 'chest', label: 'Peito' },
              { key: 'arm', label: 'Braço' },
              { key: 'thigh', label: 'Coxa' }
            ].map(({ key, label }) => {
              const current = currentMeasurements[key as keyof BodyMeasurement] as number | null;
              const initial = initialMeasurements[key as keyof BodyMeasurement] as number | null;
              
              if (!current) return null;
              
              const diff = initial && current ? initial - current : 0;

              return (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-[#064D58]">{current} cm</p>
                  </div>
                  <div className="text-right">
                    {initial && <p className="text-xs text-gray-500">Inicial: {initial} cm</p>}
                    {diff > 0 && <p className="text-sm font-semibold text-green-600">-{diff.toFixed(1)} cm</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Ruler className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Nenhuma medida registrada ainda</p>
            <button
              onClick={() => setShowMeasurementsModal(true)}
              className="bg-[#064D58] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
            >
              Adicionar Primeira Medida
            </button>
          </div>
        )}
      </div>

      {/* Fotos de Progresso */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#064D58]">Fotos de Progresso</h3>
          <button 
            onClick={() => setShowPhotoModal(true)}
            className="flex items-center gap-2 bg-[#2DD6C1] text-[#064D58] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#26c4b0] transition-colors"
          >
            <Camera className="w-4 h-4" />
            Adicionar Foto
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                <img 
                  src={photo.photo_url} 
                  alt={`Progresso ${formatDate(photo.date)}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex flex-col items-center justify-center p-2 gap-2">
                  <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatDate(photo.date)}
                  </p>
                  {photo.notes && (
                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity text-center line-clamp-2">
                      {photo.notes}
                    </p>
                  )}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => setShowPhotoModal(true)}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#2DD6C1] transition-colors cursor-pointer"
            >
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Adicionar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Adicionar Peso */}
      {showAddWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Adicionar Peso</h3>
              <button
                onClick={() => setShowAddWeightModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightForm.weight}
                  onChange={(e) => setWeightForm({...weightForm, weight: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 89.5"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Data</label>
                <input
                  type="date"
                  value={weightForm.date}
                  onChange={(e) => setWeightForm({...weightForm, date: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddWeightModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddWeight}
                disabled={saving}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Peso */}
      {showEditWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Editar Peso</h3>
              <button
                onClick={() => setShowEditWeightModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightForm.weight}
                  onChange={(e) => setWeightForm({...weightForm, weight: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 89.5"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Data</label>
                <input
                  type="date"
                  value={weightForm.date}
                  onChange={(e) => setWeightForm({...weightForm, date: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditWeightModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditWeight}
                disabled={saving}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Atualizar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Medidas */}
      {showMeasurementsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Adicionar Medidas</h3>
              <button
                onClick={() => setShowMeasurementsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementData.waist}
                  onChange={(e) => setMeasurementData({...measurementData, waist: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 95"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quadril (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementData.hip}
                  onChange={(e) => setMeasurementData({...measurementData, hip: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 110"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Peito (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementData.chest}
                  onChange={(e) => setMeasurementData({...measurementData, chest: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 105"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Braço (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementData.arm}
                  onChange={(e) => setMeasurementData({...measurementData, arm: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 35"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Coxa (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementData.thigh}
                  onChange={(e) => setMeasurementData({...measurementData, thigh: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  placeholder="Ex: 65"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Data</label>
                <input
                  type="date"
                  value={measurementData.date}
                  onChange={(e) => setMeasurementData({...measurementData, date: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMeasurementsModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMeasurements}
                disabled={saving}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Foto */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Adicionar Foto</h3>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoData({
                    photo_file: null,
                    photo_preview: "",
                    notes: "",
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {photoData.photo_preview && (
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={photoData.photo_preview} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setPhotoData({...photoData, photo_file: null, photo_preview: ""})}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!photoData.photo_preview && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2DD6C1] transition-colors"
                  >
                    <Camera className="w-8 h-8 text-[#064D58]" />
                    <span className="text-sm font-medium text-gray-700">Tirar Foto</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2DD6C1] transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-[#064D58]" />
                    <span className="text-sm font-medium text-gray-700">Galeria</span>
                  </button>
                </div>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Observações (opcional)</label>
                <textarea
                  value={photoData.notes}
                  onChange={(e) => setPhotoData({...photoData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={3}
                  placeholder="Notas sobre a foto..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Data</label>
                <input
                  type="date"
                  value={photoData.date}
                  onChange={(e) => setPhotoData({...photoData, date: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoData({
                    photo_file: null,
                    photo_preview: "",
                    notes: "",
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPhoto}
                disabled={!photoData.photo_file || uploadingPhoto}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPhoto ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

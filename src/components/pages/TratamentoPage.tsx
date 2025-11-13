"use client";

import { useState, useEffect } from "react";
import {
  Syringe,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  ChevronRight,
  Pill,
  Activity,
  FileText,
} from "lucide-react";

interface Treatment {
  id: string;
  medication: string;
  dosage_mg: number;
  frequency: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  next_application?: string;
}

interface MedicationLog {
  id: string;
  treatment_id: string;
  scheduled_date: string;
  applied_date: string | null;
  applied_time: string | null;
  status: "pending" | "applied" | "skipped";
  notes: string | null;
  medication_name?: string;
}

const MEDICATIONS = [
  "Mounjaro (Tirzepatida)",
  "Ozempic (Semaglutida)",
  "Saxenda (Liraglutida)",
  "Wegovy (Semaglutida)"
];

const DOSAGES: { [key: string]: number[] } = {
  "Mounjaro (Tirzepatida)": [2.5, 5, 7.5, 10, 12.5, 15],
  "Ozempic (Semaglutida)": [0.25, 0.5, 1, 2],
  "Saxenda (Liraglutida)": [0.6, 1.2, 1.8, 2.4, 3],
  "Wegovy (Semaglutida)": [0.25, 0.5, 1, 1.7, 2.4]
};

export default function TratamentoPage() {
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedLog, setSelectedLog] = useState<MedicationLog | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: "1",
      medication: "Mounjaro (Tirzepatida)",
      dosage_mg: 5,
      frequency: "Semanal",
      start_date: "2024-01-01",
      end_date: null,
      is_active: true,
      next_application: "2024-01-20T15:00:00",
    },
  ]);
  const [medicationHistory, setMedicationHistory] = useState<MedicationLog[]>([
    {
      id: "1",
      treatment_id: "1",
      scheduled_date: "2024-01-13",
      applied_date: "2024-01-13",
      applied_time: "15:30",
      status: "applied",
      notes: "Aplicação normal, sem efeitos colaterais",
      medication_name: "Mounjaro (Tirzepatida) 5mg",
    },
    {
      id: "2",
      treatment_id: "1",
      scheduled_date: "2024-01-06",
      applied_date: "2024-01-06",
      applied_time: "14:45",
      status: "applied",
      notes: null,
      medication_name: "Mounjaro (Tirzepatida) 5mg",
    },
  ]);

  const [formData, setFormData] = useState({
    medication: "",
    dosage_mg: "",
    frequency: "Semanal",
    start_date: "",
    end_date: "",
  });

  const [editFormData, setEditFormData] = useState({
    medication: "",
    dosage_mg: "",
    frequency: "Semanal",
    start_date: "",
    end_date: "",
  });

  const [logData, setLogData] = useState({
    applied_date: "",
    applied_time: "",
    notes: "",
    status: "applied" as "applied" | "skipped",
  });

  const handleAddTreatment = () => {
    if (!formData.medication || !formData.dosage_mg || !formData.start_date) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const newTreatment: Treatment = {
      id: Date.now().toString(),
      medication: formData.medication,
      dosage_mg: Number(formData.dosage_mg),
      frequency: formData.frequency,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      is_active: true,
    };

    setTreatments([...treatments, newTreatment]);
    setFormData({
      medication: "",
      dosage_mg: "",
      frequency: "Semanal",
      start_date: "",
      end_date: "",
    });
    setShowAddTreatment(false);
  };

  const handleEditTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setEditFormData({
      medication: treatment.medication,
      dosage_mg: treatment.dosage_mg.toString(),
      frequency: treatment.frequency,
      start_date: treatment.start_date,
      end_date: treatment.end_date || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateTreatment = () => {
    if (!editFormData.medication || !editFormData.dosage_mg || !editFormData.start_date || !editingTreatment) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const updatedTreatments = treatments.map((t) =>
      t.id === editingTreatment.id
        ? {
            ...t,
            medication: editFormData.medication,
            dosage_mg: Number(editFormData.dosage_mg),
            frequency: editFormData.frequency,
            start_date: editFormData.start_date,
            end_date: editFormData.end_date || null,
          }
        : t
    );

    setTreatments(updatedTreatments);
    setShowEditModal(false);
    setEditingTreatment(null);
  };

  const handleDeleteTreatment = (treatmentId: string) => {
    if (confirm("Tem certeza que deseja excluir este tratamento?")) {
      setTreatments(treatments.filter((t) => t.id !== treatmentId));
    }
  };

  const handleLogMedication = () => {
    if (!selectedTreatment || !logData.applied_date || !logData.applied_time) {
      alert("Preencha a data e hora da aplicação");
      return;
    }

    const newLog: MedicationLog = {
      id: Date.now().toString(),
      treatment_id: selectedTreatment.id,
      scheduled_date: selectedTreatment.next_application?.split('T')[0] || new Date().toISOString().split('T')[0],
      applied_date: logData.applied_date,
      applied_time: logData.applied_time,
      status: logData.status,
      notes: logData.notes || null,
      medication_name: `${selectedTreatment.medication} ${selectedTreatment.dosage_mg}mg`,
    };

    setMedicationHistory([newLog, ...medicationHistory]);
    setLogData({ applied_date: "", applied_time: "", notes: "", status: "applied" });
    setShowLogModal(false);
    setSelectedTreatment(null);
  };

  const handleViewLogDetail = (log: MedicationLog) => {
    setSelectedLog(log);
    setShowLogDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString?: string | null) => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    
    if (timeString) {
      return `${dateFormatted} às ${timeString}`;
    }
    
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNextApplicationDate = (treatment: Treatment) => {
    if (treatment.next_application) {
      const date = new Date(treatment.next_application);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Hoje";
      if (diffDays === 1) return "Amanhã";
      if (diffDays < 0) return "Atrasado";
      return `Em ${diffDays} dias`;
    }
    return "Não agendado";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "text-green-600 bg-green-100";
      case "skipped":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <CheckCircle className="w-4 h-4" />;
      case "skipped":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "applied":
        return "Aplicado";
      case "skipped":
        return "Pulado";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const availableDosages = formData.medication ? DOSAGES[formData.medication] || [] : [];
  const availableEditDosages = editFormData.medication ? DOSAGES[editFormData.medication] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#064D58]">Tratamento</h2>
          <p className="text-sm text-gray-600">Gerencie seus medicamentos e aplicações</p>
        </div>
        <button
          onClick={() => setShowAddTreatment(true)}
          className="bg-[#064D58] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#085563] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Novo Tratamento</span>
        </button>
      </div>

      {/* Próxima Aplicação Destacada */}
      {treatments.length > 0 && treatments[0].next_application && (
        <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#2DD6C1]" />
                <span className="text-sm font-medium text-[#2DD6C1]">Próxima Aplicação</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">
                {formatDateTime(treatments[0].next_application)}
              </h3>
              <p className="text-sm text-gray-300">
                {treatments[0].medication} {treatments[0].dosage_mg}mg -{" "}
                {getNextApplicationDate(treatments[0])}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedTreatment(treatments[0]);
                setShowLogModal(true);
              }}
              className="bg-[#2DD6C1] text-[#064D58] px-6 py-3 rounded-lg font-semibold hover:bg-[#26c4b0] transition-all hover:scale-105 w-full sm:w-auto"
            >
              Registrar Agora
            </button>
          </div>
        </div>
      )}

      {/* Tratamentos Ativos */}
      <div>
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Tratamentos Ativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#064D58]/10 p-3 rounded-lg">
                    <Pill className="w-6 h-6 text-[#064D58]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{treatment.medication}</h4>
                    <p className="text-sm text-gray-600">{treatment.dosage_mg}mg</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditTreatment(treatment)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar tratamento"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTreatment(treatment.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir tratamento"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Frequência: {treatment.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Início: {formatDate(treatment.start_date)}
                  </span>
                </div>
                {treatment.next_application && (
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-[#2DD6C1]" />
                    <span className="text-[#064D58] font-medium">
                      Próxima: {getNextApplicationDate(treatment)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedTreatment(treatment);
                  setShowLogModal(true);
                }}
                className="w-full bg-[#064D58] text-white py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors flex items-center justify-center gap-2"
              >
                <Syringe className="w-4 h-4" />
                Registrar Aplicação
              </button>
            </div>
          ))}
        </div>

        {treatments.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Nenhum tratamento cadastrado</p>
            <button
              onClick={() => setShowAddTreatment(true)}
              className="bg-[#064D58] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
            >
              Adicionar Primeiro Tratamento
            </button>
          </div>
        )}
      </div>

      {/* Histórico de Aplicações */}
      <div>
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Histórico de Aplicações</h3>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {medicationHistory.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {medicationHistory.map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleViewLogDetail(log)}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {log.medication_name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {getStatusIcon(log.status)}
                          {getStatusText(log.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDateTime(log.applied_date || log.scheduled_date, log.applied_time)}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-gray-500 italic line-clamp-1">{log.notes}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma aplicação registrada ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar Tratamento */}
      {showAddTreatment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Novo Tratamento</h3>
              <button
                onClick={() => setShowAddTreatment(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamento *
                </label>
                <select
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value, dosage_mg: "" })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option value="">Selecione o medicamento</option>
                  {MEDICATIONS.map((med) => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosagem (mg) *
                </label>
                <select
                  value={formData.dosage_mg}
                  onChange={(e) => setFormData({ ...formData, dosage_mg: e.target.value })}
                  disabled={!formData.medication}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione a dosagem</option>
                  {availableDosages.map((dosage) => (
                    <option key={dosage} value={dosage}>{dosage}mg</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option value="Diário">Diário</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término (opcional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTreatment(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTreatment}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Tratamento */}
      {showEditModal && editingTreatment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Editar Tratamento</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTreatment(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamento *
                </label>
                <select
                  value={editFormData.medication}
                  onChange={(e) => setEditFormData({ ...editFormData, medication: e.target.value, dosage_mg: "" })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option value="">Selecione o medicamento</option>
                  {MEDICATIONS.map((med) => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosagem (mg) *
                </label>
                <select
                  value={editFormData.dosage_mg}
                  onChange={(e) => setEditFormData({ ...editFormData, dosage_mg: e.target.value })}
                  disabled={!editFormData.medication}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione a dosagem</option>
                  {availableEditDosages.map((dosage) => (
                    <option key={dosage} value={dosage}>{dosage}mg</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência *
                </label>
                <select
                  value={editFormData.frequency}
                  onChange={(e) => setEditFormData({ ...editFormData, frequency: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option value="Diário">Diário</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início *
                </label>
                <input
                  type="date"
                  value={editFormData.start_date}
                  onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término (opcional)
                </label>
                <input
                  type="date"
                  value={editFormData.end_date}
                  onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTreatment(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateTreatment}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Aplicação */}
      {showLogModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Registrar Aplicação</h3>
              <button
                onClick={() => {
                  setShowLogModal(false);
                  setSelectedTreatment(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Medicamento</p>
              <p className="font-bold text-gray-900">
                {selectedTreatment.medication}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Dosagem: {selectedTreatment.dosage_mg}mg
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status da Aplicação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLogData({ ...logData, status: "applied" })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      logData.status === "applied"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Aplicado</span>
                  </button>
                  <button
                    onClick={() => setLogData({ ...logData, status: "skipped" })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      logData.status === "skipped"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Pulado</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Aplicação *
                </label>
                <input
                  type="date"
                  value={logData.applied_date}
                  onChange={(e) => setLogData({ ...logData, applied_date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora da Aplicação *
                </label>
                <input
                  type="time"
                  value={logData.applied_time}
                  onChange={(e) => setLogData({ ...logData, applied_time: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={logData.notes}
                  onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
                  placeholder="Efeitos colaterais, local da aplicação, etc..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLogModal(false);
                  setSelectedTreatment(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogMedication}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Salvar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Aplicação */}
      {showLogDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#064D58]">Resumo da Aplicação</h3>
              <button
                onClick={() => {
                  setShowLogDetailModal(false);
                  setSelectedLog(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(
                      selectedLog.status
                    )}`}
                  >
                    {getStatusIcon(selectedLog.status)}
                    {getStatusText(selectedLog.status)}
                  </span>
                </div>
              </div>

              {/* Medicamento */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                    <Pill className="w-5 h-5 text-[#064D58]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-0.5">Medicamento</p>
                    <p className="font-bold text-gray-900">{selectedLog.medication_name}</p>
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
                    <p className="text-sm text-gray-600 mb-0.5">Data da Aplicação</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedLog.applied_date || selectedLog.scheduled_date)}
                    </p>
                  </div>
                </div>
                
                {selectedLog.applied_time && (
                  <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                    <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                      <Clock className="w-5 h-5 text-[#064D58]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-0.5">Horário</p>
                      <p className="font-semibold text-gray-900">{selectedLog.applied_time}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              {selectedLog.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#064D58]/10 p-2.5 rounded-lg">
                      <FileText className="w-5 h-5 text-[#064D58]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Observações</p>
                      <p className="text-gray-900">{selectedLog.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedLog.notes && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma observação registrada</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowLogDetailModal(false);
                setSelectedLog(null);
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

"use client";

import { useState } from "react";
import { 
  Syringe, 
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Edit,
  Trash2,
  X,
  Bell
} from "lucide-react";

export default function TratamentoPage() {
  const [showAddDoseModal, setShowAddDoseModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);

  // Dados de exemplo
  const currentMedication = {
    name: "Mounjaro",
    dosage: "5mg",
    frequency: "Semanal",
    startDate: "01/01/2024",
    nextDose: "Sábado, 15:00",
    daysRemaining: 2,
  };

  const doseHistory = [
    { id: 1, date: "22/01/2024", time: "15:00", dosage: "5mg", location: "Abdômen", notes: "Sem efeitos colaterais" },
    { id: 2, date: "15/01/2024", time: "15:00", dosage: "5mg", location: "Coxa", notes: "Leve náusea" },
    { id: 3, date: "08/01/2024", time: "15:00", dosage: "2.5mg", location: "Abdômen", notes: "Primeira dose - tudo ok" },
    { id: 4, date: "01/01/2024", time: "15:00", dosage: "2.5mg", location: "Braço", notes: "Início do tratamento" },
  ];

  const medications = [
    { id: 1, name: "Mounjaro", type: "Tirzepatida", dosages: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"] },
    { id: 2, name: "Ozempic", type: "Semaglutida", dosages: ["0.25mg", "0.5mg", "1mg", "2mg"] },
    { id: 3, name: "Wegovy", type: "Semaglutida", dosages: ["0.25mg", "0.5mg", "1mg", "1.7mg", "2.4mg"] },
    { id: 4, name: "Saxenda", type: "Liraglutida", dosages: ["0.6mg", "1.2mg", "1.8mg", "2.4mg", "3mg"] },
  ];

  const injectionSites = ["Abdômen", "Coxa", "Braço", "Glúteo"];

  return (
    <div className="space-y-6">
      {/* Medicamento Atual */}
      <div className="bg-gradient-to-br from-[#064D58] to-[#085563] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Syringe className="w-5 h-5 text-[#2DD6C1]" />
              <span className="text-sm font-medium text-[#2DD6C1]">Medicamento Atual</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">{currentMedication.name}</h2>
            <p className="text-lg text-gray-300">{currentMedication.dosage} - {currentMedication.frequency}</p>
          </div>
          <button
            onClick={() => setShowMedicationModal(true)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-300 mb-1">Início do Tratamento</p>
            <p className="text-lg font-semibold">{currentMedication.startDate}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-300 mb-1">Próxima Dose</p>
            <p className="text-lg font-semibold">{currentMedication.nextDose}</p>
            <p className="text-xs text-[#2DD6C1] mt-1">Em {currentMedication.daysRemaining} dias</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddDoseModal(true)}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-4"
        >
          <div className="bg-[#064D58] p-3 rounded-full">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-[#064D58]">Registrar Dose</p>
            <p className="text-xs text-gray-500">Aplicou agora? Registre aqui</p>
          </div>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-4">
          <div className="bg-[#2DD6C1] p-3 rounded-full">
            <Bell className="w-6 h-6 text-[#064D58]" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-[#064D58]">Configurar Lembrete</p>
            <p className="text-xs text-gray-500">Nunca esqueça uma dose</p>
          </div>
        </button>
      </div>

      {/* Histórico de Doses */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Histórico de Doses</h3>

        <div className="space-y-3">
          {doseHistory.map((dose) => (
            <div
              key={dose.id}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-[#064D58]">{dose.date}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dose.time}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-1">
                  <span>Dose: <span className="font-semibold text-[#064D58]">{dose.dosage}</span></span>
                  <span>Local: <span className="font-semibold text-[#064D58]">{dose.location}</span></span>
                </div>
                {dose.notes && (
                  <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {dose.notes}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-[#064D58] p-1">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas do Tratamento */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4">Estatísticas do Tratamento</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-[#064D58]">29</p>
            <p className="text-xs text-gray-600 mt-1">Dias de Tratamento</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-[#064D58]">4</p>
            <p className="text-xs text-gray-600 mt-1">Doses Aplicadas</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-600 mt-1">Adesão</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-[#064D58]">0</p>
            <p className="text-xs text-gray-600 mt-1">Doses Perdidas</p>
          </div>
        </div>
      </div>



      {/* Modal de Registrar Dose */}
      {showAddDoseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Registrar Dose</h3>
              <button
                onClick={() => setShowAddDoseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Data e Hora</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                  <input
                    type="time"
                    defaultValue="15:00"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Dosagem</label>
                <select 
                  defaultValue="5mg"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option>2.5mg</option>
                  <option>5mg</option>
                  <option>7.5mg</option>
                  <option>10mg</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Local da Aplicação</label>
                <div className="grid grid-cols-2 gap-2">
                  {injectionSites.map((site) => (
                    <button
                      key={site}
                      className="p-3 rounded-lg text-sm font-medium bg-gray-100 hover:bg-[#064D58] hover:text-white transition-all"
                    >
                      {site}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Observações</label>
                <textarea
                  placeholder="Como se sentiu? Algum efeito colateral?"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] resize-none"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddDoseModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAddDoseModal(false)}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurar Medicamento */}
      {showMedicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#064D58]">Configurar Medicamento</h3>
              <button
                onClick={() => setShowMedicationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Medicamento</label>
                <select 
                  defaultValue="Mounjaro (Tirzepatida)"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option>Mounjaro (Tirzepatida)</option>
                  <option>Ozempic (Semaglutida)</option>
                  <option>Wegovy (Semaglutida)</option>
                  <option>Saxenda (Liraglutida)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Dosagem Atual</label>
                <select 
                  defaultValue="5mg"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option>2.5mg</option>
                  <option>5mg</option>
                  <option>7.5mg</option>
                  <option>10mg</option>
                  <option>12.5mg</option>
                  <option>15mg</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Frequência</label>
                <select 
                  defaultValue="Semanal"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                >
                  <option>Semanal</option>
                  <option>Diária</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Dia e Horário da Aplicação</label>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    defaultValue="Sábado"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  >
                    <option>Domingo</option>
                    <option>Segunda</option>
                    <option>Terça</option>
                    <option>Quarta</option>
                    <option>Quinta</option>
                    <option>Sexta</option>
                    <option>Sábado</option>
                  </select>
                  <input
                    type="time"
                    defaultValue="15:00"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMedicationModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowMedicationModal(false)}
                className="flex-1 bg-[#064D58] text-white py-3 rounded-lg font-semibold hover:bg-[#085563] transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save,
  Camera,
  Shield,
  Bell,
  Heart,
  Activity,
  Target,
  Ruler,
  Weight
} from "lucide-react";

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    birthDate: "15/03/1985",
    city: "São Paulo, SP",
    height: "165",
    weight: "78",
    initialWeight: "85",
    targetWeight: "65",
    startDate: "01/01/2024",
    medication: "Mounjaro (Tirzepatida)"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você adicionaria a lógica para salvar os dados
  };

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const medicationOptions = [
    "Mounjaro (Tirzepatida)",
    "Ozempic (Semaglutida)",
    "Wegovy (Semaglutida)",
    "Saxenda (Liraglutida)"
  ];

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <div className="bg-gradient-to-r from-[#064D58] to-[#085563] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2DD6C1] rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-[#064D58]">
                {profileData.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4 text-[#064D58]" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">{profileData.name}</h2>
              <p className="text-sm text-gray-200">Membro desde {profileData.startDate}</p>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-[#2DD6C1] text-[#064D58] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#26c4b0] transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </>
            )}
          </button>
        </div>
      </div>

      {/* Informações Pessoais */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Nome Completo</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-mail
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.phone}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data de Nascimento
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.birthDate}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cidade
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.city}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dados de Saúde */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Dados de Saúde
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Altura (cm)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={profileData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.height} cm</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Peso Inicial (kg)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={profileData.initialWeight}
                onChange={(e) => handleChange("initialWeight", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.initialWeight} kg</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Weight className="w-4 h-4" />
              Peso Atual (kg)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={profileData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.weight} kg</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center gap-2">
              <Target className="w-4 h-4" />
              Meta de Peso (kg)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={profileData.targetWeight}
                onChange={(e) => handleChange("targetWeight", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1]"
              />
            ) : (
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.targetWeight} kg</p>
            )}
          </div>
        </div>

        {/* Progresso Visual */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#2DD6C1]/10 to-[#064D58]/10 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso de Peso</span>
            <span className="text-sm font-bold text-[#064D58]">
              {parseFloat(profileData.initialWeight) - parseFloat(profileData.weight)} kg perdidos • {parseFloat(profileData.weight) - parseFloat(profileData.targetWeight)} kg para a meta
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#2DD6C1] to-[#064D58] h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(((parseFloat(profileData.initialWeight) - parseFloat(profileData.weight)) / (parseFloat(profileData.initialWeight) - parseFloat(profileData.targetWeight))) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tratamento Atual */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Tratamento Atual
        </h3>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Medicamento</label>
          {isEditing ? (
            <select
              value={profileData.medication}
              onChange={(e) => handleChange("medication", e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2DD6C1] bg-white"
            >
              {medicationOptions.map((med) => (
                <option key={med} value={med}>
                  {med}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">{profileData.medication}</p>
          )}
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#064D58] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Configurações
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#064D58]" />
              <div>
                <p className="font-medium text-gray-800">Notificações</p>
                <p className="text-xs text-gray-500">Lembretes de medicação e metas</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2DD6C1] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2DD6C1]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#064D58]" />
              <div>
                <p className="font-medium text-gray-800">Privacidade</p>
                <p className="text-xs text-gray-500">Controle seus dados pessoais</p>
              </div>
            </div>
            <button className="text-[#064D58] font-medium text-sm hover:text-[#085563]">
              Gerenciar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="text-2xl font-bold mb-1">24</div>
          <div className="text-xs opacity-90">Dias de Tratamento</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="text-2xl font-bold mb-1">18</div>
          <div className="text-xs opacity-90">Metas Cumpridas</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div className="text-2xl font-bold mb-1">{parseFloat(profileData.initialWeight) - parseFloat(profileData.weight)}kg</div>
          <div className="text-xs opacity-90">Peso Perdido</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="text-2xl font-bold mb-1">92%</div>
          <div className="text-xs opacity-90">Adesão</div>
        </div>
      </div>
    </div>
  );
}

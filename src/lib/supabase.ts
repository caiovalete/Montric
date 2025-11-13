import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export type Profile = {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  cidade?: string;
  altura_cm?: number;
  peso_inicial_kg?: number;
  peso_atual_kg?: number;
  meta_peso_kg?: number;
  medicamento?: string;
  local_aplicacao_preferido?: string;
  alterna_lados?: boolean;
  ano_nascimento?: number;
  onboarding_completo: boolean;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plano: 'mensal' | 'anual';
  status: 'ativa' | 'cancelada' | 'expirada';
  data_inicio: string;
  data_fim: string;
  valor: number;
  created_at: string;
  updated_at: string;
};

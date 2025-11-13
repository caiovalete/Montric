'use server';

import { createClient } from '@/lib/supabase';
import { WellnessLog } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function saveWellnessLog(data: {
  date: string;
  mood: number;
  energy_level: number;
  side_effects?: string;
  notes?: string;
}) {
  const supabase = createClient();
  
  // Verificar se já existe registro para esta data
  const { data: existing } = await supabase
    .from('wellness_logs')
    .select('*')
    .eq('date', data.date)
    .single();

  if (existing) {
    // Atualizar registro existente
    const { error } = await supabase
      .from('wellness_logs')
      .update({
        mood: data.mood,
        energy_level: data.energy_level,
        side_effects: data.side_effects || null,
        notes: data.notes || null
      })
      .eq('date', data.date);

    if (error) {
      console.error('Erro ao atualizar bem-estar:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Criar novo registro
    const { error } = await supabase
      .from('wellness_logs')
      .insert({
        date: data.date,
        mood: data.mood,
        energy_level: data.energy_level,
        side_effects: data.side_effects || null,
        notes: data.notes || null
      });

    if (error) {
      console.error('Erro ao criar registro de bem-estar:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function getWellnessLog(date: string): Promise<WellnessLog | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('wellness_logs')
    .select('*')
    .eq('date', date)
    .single();

  if (error) {
    console.error('Erro ao buscar bem-estar:', error);
    return null;
  }

  return data;
}

export async function getWellnessLogsForRange(startDate: string, endDate: string): Promise<WellnessLog[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('wellness_logs')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar registros de bem-estar:', error);
    return [];
  }

  return data || [];
}

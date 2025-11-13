'use server';

import { createClient } from '@/lib/supabase';
import { ProgressLog } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addProgressLog(data: {
  date: string;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  body_fat_percentage?: number;
  notes?: string;
}) {
  const supabase = createClient();
  
  // Verificar se já existe registro para esta data
  const { data: existing } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('date', data.date)
    .single();

  if (existing) {
    // Atualizar registro existente
    const { error } = await supabase
      .from('progress_logs')
      .update({
        weight: data.weight || existing.weight,
        waist: data.waist || existing.waist,
        hips: data.hips || existing.hips,
        chest: data.chest || existing.chest,
        arms: data.arms || existing.arms,
        thighs: data.thighs || existing.thighs,
        body_fat_percentage: data.body_fat_percentage || existing.body_fat_percentage,
        notes: data.notes || existing.notes
      })
      .eq('date', data.date);

    if (error) {
      console.error('Erro ao atualizar progresso:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Criar novo registro
    const { error } = await supabase
      .from('progress_logs')
      .insert({
        date: data.date,
        weight: data.weight || null,
        waist: data.waist || null,
        hips: data.hips || null,
        chest: data.chest || null,
        arms: data.arms || null,
        thighs: data.thighs || null,
        body_fat_percentage: data.body_fat_percentage || null,
        notes: data.notes || null
      });

    if (error) {
      console.error('Erro ao criar registro de progresso:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function getProgressLog(date: string): Promise<ProgressLog | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('date', date)
    .single();

  if (error) {
    console.error('Erro ao buscar progresso:', error);
    return null;
  }

  return data;
}

export async function getProgressHistory(limit: number = 30): Promise<ProgressLog[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar histórico de progresso:', error);
    return [];
  }

  return data || [];
}

export async function getWeightTrend(days: number = 30) {
  const supabase = createClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('progress_logs')
    .select('date, weight')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar tendência de peso:', error);
    return [];
  }

  return data || [];
}

export async function getMeasurementsTrend(days: number = 30) {
  const supabase = createClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('progress_logs')
    .select('date, waist, hips, chest, arms, thighs')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar tendência de medidas:', error);
    return [];
  }

  return data || [];
}

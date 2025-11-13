'use server';

import { createClient } from '@/lib/supabase';
import { DailyGoal } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getDailyGoal(date: string): Promise<DailyGoal | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('date', date)
    .single();

  if (error) {
    console.error('Erro ao buscar meta diária:', error);
    return null;
  }

  return data;
}

export async function updateWaterProgress(date: string, amount: number) {
  const supabase = createClient();
  
  // Buscar meta atual
  const { data: currentGoal } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('date', date)
    .single();

  if (currentGoal) {
    // Atualizar meta existente
    const { error } = await supabase
      .from('daily_goals')
      .update({ 
        water_consumed: currentGoal.water_consumed + amount,
        updated_at: new Date().toISOString()
      })
      .eq('date', date);

    if (error) {
      console.error('Erro ao atualizar água:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Criar nova meta
    const { error } = await supabase
      .from('daily_goals')
      .insert({
        date,
        water_consumed: amount,
        water_goal: 2000,
        protein_goal: 120,
        calories_goal: 2000
      });

    if (error) {
      console.error('Erro ao criar meta:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateProteinProgress(date: string, amount: number) {
  const supabase = createClient();
  
  const { data: currentGoal } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('date', date)
    .single();

  if (currentGoal) {
    const { error } = await supabase
      .from('daily_goals')
      .update({ 
        protein_consumed: currentGoal.protein_consumed + amount,
        updated_at: new Date().toISOString()
      })
      .eq('date', date);

    if (error) {
      console.error('Erro ao atualizar proteína:', error);
      return { success: false, error: error.message };
    }
  } else {
    const { error } = await supabase
      .from('daily_goals')
      .insert({
        date,
        protein_consumed: amount,
        water_goal: 2000,
        protein_goal: 120,
        calories_goal: 2000
      });

    if (error) {
      console.error('Erro ao criar meta:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateCaloriesProgress(date: string, amount: number) {
  const supabase = createClient();
  
  const { data: currentGoal } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('date', date)
    .single();

  if (currentGoal) {
    const { error } = await supabase
      .from('daily_goals')
      .update({ 
        calories_consumed: currentGoal.calories_consumed + amount,
        updated_at: new Date().toISOString()
      })
      .eq('date', date);

    if (error) {
      console.error('Erro ao atualizar calorias:', error);
      return { success: false, error: error.message };
    }
  } else {
    const { error } = await supabase
      .from('daily_goals')
      .insert({
        date,
        calories_consumed: amount,
        water_goal: 2000,
        protein_goal: 120,
        calories_goal: 2000
      });

    if (error) {
      console.error('Erro ao criar meta:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function getDailyGoalsForRange(startDate: string, endDate: string): Promise<DailyGoal[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar metas:', error);
    return [];
  }

  return data || [];
}

'use server';

import { createClient } from '@/lib/supabase';
import { Meal } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addMeal(data: {
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  time?: string;
  notes?: string;
}) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('meals')
    .insert({
      date: data.date,
      meal_type: data.meal_type,
      name: data.name,
      calories: data.calories || null,
      protein: data.protein || null,
      carbs: data.carbs || null,
      fats: data.fats || null,
      time: data.time || null,
      notes: data.notes || null
    });

  if (error) {
    console.error('Erro ao adicionar refeição:', error);
    return { success: false, error: error.message };
  }

  // Atualizar calorias e proteínas do dia automaticamente
  if (data.calories || data.protein) {
    const { data: currentGoal } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('date', data.date)
      .single();

    if (currentGoal) {
      await supabase
        .from('daily_goals')
        .update({
          calories_consumed: currentGoal.calories_consumed + (data.calories || 0),
          protein_consumed: currentGoal.protein_consumed + (data.protein || 0),
          updated_at: new Date().toISOString()
        })
        .eq('date', data.date);
    } else {
      await supabase
        .from('daily_goals')
        .insert({
          date: data.date,
          calories_consumed: data.calories || 0,
          protein_consumed: data.protein || 0,
          water_goal: 2000,
          protein_goal: 120,
          calories_goal: 2000
        });
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function getMealsForDate(date: string): Promise<Meal[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('date', date)
    .order('time', { ascending: true });

  if (error) {
    console.error('Erro ao buscar refeições:', error);
    return [];
  }

  return data || [];
}

export async function updateMeal(id: string, data: Partial<Meal>) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('meals')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar refeição:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteMeal(id: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar refeição:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function getMealsSummary(date: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('meals')
    .select('calories, protein, carbs, fats')
    .eq('date', date);

  if (error) {
    console.error('Erro ao buscar resumo de refeições:', error);
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0
    };
  }

  const summary = data.reduce(
    (acc, meal) => ({
      totalCalories: acc.totalCalories + (meal.calories || 0),
      totalProtein: acc.totalProtein + (meal.protein || 0),
      totalCarbs: acc.totalCarbs + (meal.carbs || 0),
      totalFats: acc.totalFats + (meal.fats || 0)
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0
    }
  );

  return summary;
}

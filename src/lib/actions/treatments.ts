'use server';

import { createClient } from '@/lib/supabase';
import { Treatment, MedicationLog } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createTreatment(data: {
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
}) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('treatments')
    .insert({
      medication_name: data.medication_name,
      dosage: data.dosage,
      frequency: data.frequency,
      start_date: data.start_date,
      end_date: data.end_date || null,
      is_active: true
    });

  if (error) {
    console.error('Erro ao criar tratamento:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function getActiveTreatments(): Promise<Treatment[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tratamentos:', error);
    return [];
  }

  return data || [];
}

export async function updateTreatment(id: string, data: Partial<Treatment>) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('treatments')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar tratamento:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function logMedication(data: {
  treatment_id: string;
  scheduled_date: string;
  applied_date?: string;
  status: 'pending' | 'applied' | 'skipped';
  notes?: string;
}) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('medication_logs')
    .insert({
      treatment_id: data.treatment_id,
      scheduled_date: data.scheduled_date,
      applied_date: data.applied_date || null,
      status: data.status,
      notes: data.notes || null
    });

  if (error) {
    console.error('Erro ao registrar medicação:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function getNextMedication(): Promise<MedicationLog | null> {
  const supabase = createClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('status', 'pending')
    .gte('scheduled_date', now)
    .order('scheduled_date', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar próxima medicação:', error);
    return null;
  }

  return data;
}

export async function getMedicationHistory(limit: number = 10): Promise<MedicationLog[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('medication_logs')
    .select('*')
    .order('scheduled_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar histórico de medicação:', error);
    return [];
  }

  return data || [];
}

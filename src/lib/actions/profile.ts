'use server';

import { createClient } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  return data;
}

export async function updateProfile(data: Partial<Profile>) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function createProfile(data: {
  full_name: string;
  email: string;
  weight?: number;
  height?: number;
  birth_date?: string;
  gender?: string;
}) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      full_name: data.full_name,
      email: data.email,
      weight: data.weight || null,
      height: data.height || null,
      birth_date: data.birth_date || null,
      gender: data.gender || null,
      subscription_plan: 'free',
      subscription_status: 'active'
    });

  if (error) {
    console.error('Erro ao criar perfil:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateSubscription(plan: 'free' | 'premium' | 'pro') {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: plan,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erro ao atualizar assinatura:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function cancelSubscription() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: 'free',
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erro ao cancelar assinatura:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

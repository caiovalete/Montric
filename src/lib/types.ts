// Tipos do Sistema Montric

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  weight: number | null;
  height: number | null;
  birth_date: string | null;
  gender: string | null;
  subscription_plan: 'free' | 'premium' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  date: string;
  water_goal: number;
  water_consumed: number;
  protein_goal: number;
  protein_consumed: number;
  calories_goal: number;
  calories_consumed: number;
  created_at: string;
  updated_at: string;
}

export interface WellnessLog {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  energy_level: number;
  side_effects: string | null;
  notes: string | null;
  created_at: string;
}

export interface Treatment {
  id: string;
  user_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  treatment_id: string;
  scheduled_date: string;
  applied_date: string | null;
  status: 'pending' | 'applied' | 'skipped';
  notes: string | null;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  time: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  waist: number | null;
  hips: number | null;
  chest: number | null;
  arms: number | null;
  thighs: number | null;
  body_fat_percentage: number | null;
  notes: string | null;
  created_at: string;
}

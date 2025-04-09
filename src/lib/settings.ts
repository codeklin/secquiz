import { supabase } from './supabase';

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  updated_at: string;
  updated_by: string;
}

/**
 * Gets all application settings
 */
export async function getAllSettings(): Promise<AppSetting[]> {
  const { data, error } = await supabase
    .from('settings')
    .select('*');
  
  if (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Gets a specific setting by key
 */
export async function getSettingByKey(key: string): Promise<AppSetting | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('setting_key', key)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return null;
    }
    console.error(`Error getting setting ${key}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Updates a setting
 */
export async function updateSetting(key: string, value: any, userId: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .update({
      setting_value: value,
      updated_by: userId
    })
    .eq('setting_key', key);
  
  if (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
}

/**
 * Creates a new setting
 */
export async function createSetting(
  key: string, 
  value: any, 
  description: string, 
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .insert([{
      setting_key: key,
      setting_value: value,
      description: description,
      updated_by: userId
    }]);
  
  if (error) {
    console.error(`Error creating setting ${key}:`, error);
    throw error;
  }
}

/**
 * Gets the free questions limit setting
 */
export async function getFreeQuestionsLimit(): Promise<number> {
  try {
    const setting = await getSettingByKey('free_questions_limit');
    if (setting && setting.setting_value) {
      return parseInt(setting.setting_value.toString(), 10);
    }
    return 10; // Default value
  } catch (error) {
    console.error('Error getting free questions limit:', error);
    return 10; // Default value on error
  }
}

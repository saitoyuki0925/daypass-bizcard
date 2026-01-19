// src/utils/supabaseCheck.ts
import supabase from './supabase';

export async function checkSupabaseConnection() {
  const { data, error } = await supabase
    .from('skills') // 存在するテーブル名に置き換え
    .select('id')
    .limit(1);

  return { data, error };
}

import supabase from '../supabase';
import type { Database } from '../../../database.types';
import { UserClass } from '../../domain/users';

type User = Database['public']['Tables']['users']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

//usersテーブルの情報を全て取得する関数
export const getAllUsers = async (): Promise<{ data: User[] | null; error: any }> => {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data);
  return { data, error };
};

//usersテーブルの特定のuser_idの情報を取得する関数
export const getUserById = async (userId: string): Promise<{ data: UserClass | null; error: any }> => {
  const { data, error } = await supabase.from('users').select('*, user_skill(skills(name))').eq('user_id', userId).single();
  const user = UserClass.cretateUser(data.created_at, data.description, data.github_id, data.id, data.name, data.qiita_id, data.user_id, data.x_id, data.user_skill);
  return { data: user, error };
};

// users テーブルに新しいユーザーを追加する関数
export const insertUser = async (user: User) => {
  const { data, error } = await supabase.from('users').insert(user).single();
  return { data, error };
};

//skill_userテーブルの特定のuser_idの情報を取得する関数
export const getUserSkills = async (userId: string): Promise<{ data: { user_id: string; skill_id: number }[] | null; error: any }> => {
  const { data, error } = await supabase.from('user_skill').select('*').eq('user_id', userId);
  return { data, error };
};

//skill_userテーブルの特定のuser_idの情報を追加する関数(複数業登録対応。配列で受け取る)
export const insertUserSkills = async (userSkills: { user_id: string; skill_id: number }[]) => {
  const { data, error } = await supabase.from('user_skill').insert(userSkills);
  return { data, error };
};
//skillsテーブルの情報を取得する関数
export const getSkills = async (): Promise<{ data: Skill[] | null; error: any }> => {
  const { data, error } = await supabase.from('skills').select('*');
  return { data, error };
};

//skillsテーブルに新しいスキルを追加する関数
export const insertSkill = async (skill: Skill) => {
  const { data, error } = await supabase.from('skills').insert([skill]).single();
  return { data, error };
};

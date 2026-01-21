import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const JST_OFFSET = 9 * 60 * 60 * 1000;

// 現在の日本時間を取得（UTC+9時間）
const now = new Date();
const jptNow = new Date(now.getTime() + JST_OFFSET);

// 日本時間での前日の日付（“JSTの暦”として扱うため UTC系で操作）
let jpYesterday = new Date(jptNow);
jpYesterday.setUTCDate(jptNow.getUTCDate() - 1);

// 日本時間の前日00:00:00（UTC基準で 00:00 を作る）
const jstStartDate = new Date(jpYesterday);
jstStartDate.setUTCHours(0, 0, 0, 0);

// 日本時間の前日23:59:59
const jstEndDate = new Date(jpYesterday);
jstEndDate.setUTCHours(23, 59, 59, 999);

// JSTからUTCに変換（-9時間）
const utcStartDate = new Date(jstStartDate.getTime() - JST_OFFSET);
const utcEndDate = new Date(jstEndDate.getTime() - JST_OFFSET);

// 削除対象ユーザーの user_id を取得
const { data: usersToDelete, error: userFetchError } = await supabase.from('users').select('user_id').gte('created_at', utcStartDate.toISOString()).lte('created_at', utcEndDate.toISOString());

if (userFetchError) {
  console.error('削除対象ユーザーの取得に失敗しました:', userFetchError);
} else if (usersToDelete?.length) {
  const targetUserIds = usersToDelete.map((user) => user.user_id);

  // ユーザースキル削除（対象ユーザーの user_id で検索）
  const skillDeleteResult = await supabase.from('user_skill').delete().in('user_id', targetUserIds);

  console.log('削除したユーザースキル:', skillDeleteResult);
} else {
  console.log('削除対象のユーザーが見つからなかったため、スキル削除をスキップしました。');
}

// ユーザー削除
const userDeleteResult = await supabase
  .from('users')
  .delete()
  // 削除条件を追加
  .gte('created_at', utcStartDate.toISOString())
  .lte('created_at', utcEndDate.toISOString());

console.log('startedYesterday:', utcStartDate);
console.log('endedYesterday:', utcEndDate);

console.log('削除したユーザーデータ:', userDeleteResult);

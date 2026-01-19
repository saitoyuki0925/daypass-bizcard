export type UserRow = {
  created_at: string;
  description: string;
  github_id: string;
  id: number;
  name: string;
  qiita_id: string;
  user_id: string;
  x_id: string;
  user_skill: { skills: { name: string } }[];
};

// ユーザー情報をクラス化する
export class UserClass {
  created_at: string;
  description: string;
  github_id: string;
  id: number;
  name: string;
  qiita_id: string;
  user_id: string;
  x_id: string;
  user_skill?: { skills: { name: string } }[];

  // フルユーザーのためのコンストラクタ
  constructor(created_at: string, description: string, github_id: string, id: number, name: string, qiita_id: string, user_id: string, x_id: string, user_skill?: { skills: { name: string } }[]) {
    this.created_at = created_at;
    this.description = description;
    this.github_id = github_id;
    this.id = id;
    this.name = name;
    this.qiita_id = qiita_id;
    this.user_id = user_id;
    this.x_id = x_id;
    this.user_skill = user_skill;
  }

  // ファクトリーメソッドを使ってユーザーオブジェクトを作成
  static cretateUser(created_at: string, description: string, github_id: string, id: number, name: string, qiita_id: string, user_id: string, x_id: string, user_skill?: { skills: { name: string } }[]) {
    // ユーザーオブジェクトを作成
    const user = new UserClass(created_at, description, github_id, id, name, qiita_id, user_id, x_id, user_skill);
    // qita x github のidを使ってURLを作成
    function formatSnsUrl(baseUrl: string, userPath: string): string | undefined {
      if (userPath === undefined || userPath.trim() === '') return undefined;
      return `${baseUrl}/${userPath}`;
    }
    user.qiita_id = formatSnsUrl('https://qiita.com', qiita_id) ?? '';
    user.github_id = formatSnsUrl('https://github.com', github_id) ?? '';
    user.x_id = formatSnsUrl('https://twitter.com', x_id) ?? '';

    return user;
  }
}

# daypass-bizcard

**概要**

- **Project:** 名刺共有 / ビジネスカード管理用のフロントエンド（React + Vite）
- **目的:** ユーザーが名刺情報を登録・表示・共有できるシンプルなウェブアプリケーション

**主要技術スタック**

- **フレームワーク:** React 19, Vite
- **UI:** Chakra UI
- **認証/DB:** Firebase（`src/friebase.js` に設定）および Supabase（クライアントは `src/utils/supabase.tsx`）
- **その他:** react-router-dom, react-hook-form, luxon

**セットアップ（ローカル実行）**

1. リポジトリをクローン

```
npm install
```

2. 開発サーバ起動

```
npm run dev
```

3. 本番ビルド

```
npm run build
```

**環境変数**

- Supabase のクライアントは環境変数 `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を参照します（参照箇所: [src/utils/supabase.tsx](src/utils/supabase.tsx)）。
- Firebase 設定は現在 [src/friebase.js](src/friebase.js) にハードコードされています。必要に応じて `.env` に移行してください。

**npm スクリプト**

- `dev`: 開発サーバを起動します（`vite`）
- `build`: TypeScript ビルドと Vite のビルドを実行します
- `preview`: ビルド結果のプレビューを開始します
- `lint`: ESLint をプロジェクト全体に対して実行します
- `test`: テストを実行します（`vitest`）

**ディレクトリ構成（主要）**

- [src](src)
  - [main.tsx](src/main.tsx): アプリのエントリ
  - [App.tsx](src/App.tsx)
  - [components/page](src/components/page): ページコンポーネント（Home, Register, CardPage 等）
  - [utils/supabase.tsx](src/utils/supabase.tsx): Supabase クライアント初期化
  - [friebase.js](src/friebase.js): Firebase 設定（スペルに注意）

**テスト**

- テストは `vitest` を使用しています。

```
npm run test
```

**開発上の注意点**

- ファイル `src/friebase.js` はプロジェクト内で Firebase 設定を直接持っています。公開リポジトリに機密情報を残さないよう必要に応じて `.env` に移動してください。
- Supabase のキーは Vite の環境変数プレフィックス `VITE_` を使用してください。

**参考ファイル**

- エントリポイント: [src/main.tsx](src/main.tsx)
- ルーティング: [src/router/Router.tsx](src/router/Router.tsx)
- ページ例: [src/components/page/Register.tsx](src/components/page/Register.tsx)

---

必要があれば、README に以下を追加できます: デプロイ手順、CI 設定、環境変数サンプルファイル（`.env.example`）、またはアーキテクチャ図。どれを追加しますか？

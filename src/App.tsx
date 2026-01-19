import { Router } from './router/Router';
import { useEffect } from 'react';
import { checkSupabaseConnection } from './utils/supabaseCheck';

function App() {
  // Supabase接続確認
  useEffect(() => {
    (async () => {
      const res = await checkSupabaseConnection();
      console.log(res);
    })();
  }, []);
  return (
    <>
      <h1 data-testid="title">Hello Jest</h1>
      <Router />
    </>
  );
}

export default App;

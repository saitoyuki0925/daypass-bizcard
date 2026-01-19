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
      <Router />
    </>
  );
}

export default App;

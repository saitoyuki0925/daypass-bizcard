import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-LSPJeUvAAWj0SB7DduD01mD2OLuWXgI',
  authDomain: 'blog-with-react-and-friebase.firebaseapp.com',
  projectId: 'blog-with-react-and-friebase',
  storageBucket: 'blog-with-react-and-friebase.appspot.com',
  messagingSenderId: '827420255988',
  appId: '1:827420255988:web:95bc467a22febe1e2da0a1',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../friebase.js';
const Login = () => {
  const loginInWithGoogle = () => {
    // Googleでログイン
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
    });
  };
  return (
    <div className="container">
      <p>ログインして始める</p>
      <button type="button" className="btn" onClick={loginInWithGoogle}>
        Googleでログインする
      </button>
    </div>
  );
};

export default Login;

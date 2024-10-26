'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AuthButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  // ログイン状態のチェック
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedName = localStorage.getItem('name')
      if (token && storedName) {
        setIsLoggedIn(true);
        setName(storedName);
      } else {
        setIsLoggedIn(false);
      }
    };

    // 初回ロード時にログイン状態を確認
    checkLoginStatus();

    // カスタムイベントのリスナーを登録
    window.addEventListener('login', checkLoginStatus);  // ログイン時
    window.addEventListener('logout', checkLoginStatus); // ログアウト時

    // コンポーネントがアンマウントされるときにリスナーを削除
    return () => {
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);

  // ログインページへの遷移
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div>
      {isLoggedIn ? (
        <p className="text-gray-700 font-bold p-2 absolute top-4 right-4">
          ようこそ {name} さん
        </p>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold p-2 rounded absolute top-4 right-4"
        >
          ログイン
        </button>
      )}
    </div>
  );
}

export default AuthButton;

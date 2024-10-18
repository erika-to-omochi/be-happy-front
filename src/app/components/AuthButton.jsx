'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AuthButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン状態のチェック
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // トークンがあればログインしていると判断
  }, []);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  // ログインページへの遷移
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold p-2 rounded absolute top-4 right-4"
        >
          ログアウト
        </button>
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false); // リダイレクト中かどうかを管理

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      if (response.ok) {
        const token = response.headers.get('Authorization')?.split(' ')[1]; // ヘッダーからトークンを取得
        const data = await response.json();
        const name = data.user.name;

        if (token) {
          localStorage.setItem('token', token); // トークンをlocalStorageに保存
          localStorage.setItem('name', name);
          setSuccessMessage('ログインしました！');

          // カスタムイベントを発行してログイン状態の変更を通知
          window.dispatchEvent(new Event('login'));

          setIsRedirecting(true);

          // 1秒後にリダイレクト
          setTimeout(() => {
            router.push('/box'); // ログイン後のリダイレクト先
          }, 1000);
        } else {
          setError('トークンが見つかりません');
        }
      } else {
        setError('ログインに失敗しました');
      }
    } catch (error) {
      setError('ログインエラーが発生しました');
    }
  };

  // リダイレクト中の場合、ローディング表示を行う
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#E8C5C0]">ログイン成功！リダイレクト中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-2xl space-y-6">
        <h1 className="text-2xl mb-6 text-center">ログイン</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>} {/* エラーメッセージ表示 */}
        {successMessage && <p className="text-[#E8C5C0] mb-4 text-center">{successMessage}</p>} {/* 成功メッセージ表示 */}
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 rounded"
          >
            ログイン
          </button>
        </div>
        <div className="mt-4 text-center">
          <p>アカウントをお持ちでないですか？</p>
          <Link href="/register" className="text-blue-500 hover:underline">
            新規登録はこちら
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

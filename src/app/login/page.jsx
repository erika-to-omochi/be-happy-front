'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // エラーメッセージの状態

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

      const data = await response.json();

      if (response.ok) {
        const token = response.headers.get('Authorization')?.split(' ')[1]; // ヘッダーからトークンを取得
        if (token) {
          localStorage.setItem('token', token); // トークンをlocalStorageに保存
          router.push('/'); // ログイン後のリダイレクト先
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-2xl space-y-6">
        <h1 className="text-2xl mb-6 text-center">ログイン</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>} {/* エラーメッセージ表示 */}
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
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

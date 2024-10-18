'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // エラーメッセージの状態

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // エラーメッセージをリセット

    try {
      const response = await fetch(`${apiUrl}/users/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Rails が JSON を返すようにするため
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // JWT トークンを取得（ヘッダーから取得する場合）
        const token = response.headers.get('Authorization')?.split(' ')[1];

        if (token) {
          localStorage.setItem('token', token);
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl mb-6">ログイン</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* エラーメッセージ表示 */}
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          ログイン
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
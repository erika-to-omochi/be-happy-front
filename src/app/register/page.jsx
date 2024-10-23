'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // 成功メッセージの状態

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || response.headers.get('Authorization')?.split(' ')[1]; // ヘッダーまたはレスポンスからトークンを取得
        if (token) {
          localStorage.setItem('token', token); // トークンをlocalStorageに保存
          localStorage.setItem('email', email); // メールアドレスも保存（必要に応じて）

          setSuccessMessage('登録しました！ログイン中...'); // 成功メッセージを設定

          // カスタムイベントを発行してログイン状態を通知
          window.dispatchEvent(new Event('login'));

          // すぐにログイン状態にして、ホームにリダイレクト
          setTimeout(() => {
            router.push('/'); // 成功時のリダイレクト
          }, 1000);
        } else {
          setError('トークンが見つかりません');
        }
      } else {
        console.error(data); // サーバーからのエラー内容をコンソールに表示
        setError(data.errors || '登録に失敗しました');
      }
    } catch (error) {
      setError('登録エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-2xl space-y-6">
        <h1 className="text-2xl mb-6 text-center">新規登録</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-[#E8C5C0] mb-4 text-center">{successMessage}</p>} {/* 成功メッセージ表示 */}
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            autoComplete="username"
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
            autoComplete="new-password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">パスワード確認</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            autoComplete="new-password"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 rounded"
          >
            登録
          </button>
        </div>
        <div className="mt-4 text-center">
          <p>アカウントをお持ちですか？</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            ログインはこちら
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;

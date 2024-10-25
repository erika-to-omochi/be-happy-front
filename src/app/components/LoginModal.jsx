import React from 'react';
import { useRouter } from 'next/navigation';

const LoginModal = ({ showModal, onClose, onGuestLogin }) => {
  const router = useRouter();

  if (!showModal) return null;

  const onLogin = () => {
    router.push('/login'); // Next.jsのページ遷移
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-center mb-4">ログインオプション</h2>
        <p className="text-center mb-4">ログイン方法を選択してください。</p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onLogin}
            className="w-[50%] bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 p-3 rounded-lg font-bold"
          >
            ログイン
          </button>
          <button
            onClick={onGuestLogin}
            className="w-[50%] bg-gray-500 text-white p-3 rounded-lg font-bold"
          >
            ゲストとしてログイン
          </button>
          <button
            onClick={onClose}
            className="w-[50%] bg-red-500 text-white p-2 rounded-lg font-bold"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

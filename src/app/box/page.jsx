'use client';

import React, { useState, useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import MemoryInput from '../components/MemoryInput';
import MemoryBox from '../components/MemoryBox';
import LoginModal from '../components/LoginModal';
import { useRouter } from 'next/navigation';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);
  const [name, setName] = useState('ゲスト');
  const [guestToken, setGuestToken] = useState(null); // Initialize as null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const controls = useAnimation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const exp = decoded.exp * 1000;
      return Date.now() >= exp;
    } catch (e) {
      console.error('トークンのデコードに失敗しました:', e);
      return true;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedGuestToken = localStorage.getItem('guestToken');
      const guestId = localStorage.getItem('guestId');

      if (token && token !== 'null' && token !== 'undefined' && !isTokenExpired(token)) {
        setIsLoggedIn(true);
        setIsGuest(false);
        fetchUserName(token);
      } else if (storedGuestToken && storedGuestToken !== 'null' && storedGuestToken !== 'undefined' && storedGuestToken.trim() !== '') {
        setGuestToken(storedGuestToken); // Set state
        setIsGuest(true);
        setIsLoggedIn(false);
        setName('ゲスト');
      } else {
        setShowModal(true);
        handleGuestLogin();
      }
      setIsLoading(false);

      const pendingMemory = localStorage.getItem('pendingMemory');
      const pendingName = localStorage.getItem('pendingName');
      if (pendingMemory) {
        setMemory(pendingMemory);
        setName(pendingName || 'ゲスト');
        // 一度復元したらlocalStorageから削除
        localStorage.removeItem('pendingMemory');
        localStorage.removeItem('pendingName');
      }
    }
  }, []); // 空配列で初回レンダー時のみ実行

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'username', password: 'password' }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setGuestToken(null); // Clear guestToken
        setIsLoggedIn(true);
        setIsGuest(false);
        setShowModal(false);
        fetchUserName(data.token);
        router.push('/box');
      } else {
        console.error('ログインに失敗しました');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  // ゲストとしてログインする関数
  const handleGuestLogin = async () => {
    try {
      const storedGuestToken = localStorage.getItem('guestToken');
      let guestId = localStorage.getItem('guestId');

      // guestTokenが存在する場合、以前のゲストセッションを使用
      if (storedGuestToken && storedGuestToken !== 'null' && storedGuestToken !== 'undefined' && storedGuestToken.trim() !== '') {
        setIsGuest(true);
        setIsLoggedIn(false);
        setGuestToken(storedGuestToken); // 正しく guestToken を設定
        setName('ゲスト');
      } else {
        // 新規ゲストセッションを作成
        const response = await fetch(`${apiUrl}/guest_sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('guestToken', data.token);
          setGuestToken(data.token); // 状態を更新
          guestId = guestId || data.guest_id;
          localStorage.setItem('guestId', guestId);

          setIsGuest(true);
          setIsLoggedIn(false);
          setName('ゲスト');
          setShowModal(false);
        } else {
          console.error('ゲストログインに失敗しました');
        }
      }
    } catch (error) {
      console.error('ゲストログインエラー:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestToken');
    localStorage.removeItem('token');
    localStorage.removeItem('guestId'); // Also remove guestId
    setGuestToken(null);
    setIsLoggedIn(false);
    setIsGuest(false);
    setName('ゲスト');
  };

  const fetchUserName = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.user_name || 'ゲスト');
      } else {
        console.error('ユーザー情報の取得に失敗しました');
        setName('ゲスト');
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      setName('ゲスト');
    }
  };

  // メモリ入力のハンドラー
  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  // メモリの送信ハンドラー
  const handleSubmit = async ({ memory, name }) => {
    if (!isLoggedIn && !isGuest) {
      localStorage.setItem('pendingMemory', memory);
      localStorage.setItem('pendingName', name);
      setShowModal(true); // 未ログインの場合、モーダルを表示
    } else {
      try {
        const token = localStorage.getItem('token');
        const guestToken = localStorage.getItem('guestToken');
        const currentToken = token || guestToken;

        // Check if content is not empty
        if (!memory.trim()) {
          console.error("エラー: メモリ内容が空です。");
          return;
        }

        const response = await fetch(`${apiUrl}/memories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            memory: { content: memory, name: name },
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setIsBoxClosed(false);
        } else {
          const errorData = await response.json();
          console.error('メモリの保存に失敗しました:', errorData);
        }
      } catch (error) {
        console.error('送信エラー:', error);
      }
    }
  };

  // 記憶を箱にしまうアニメーション処理
  const handleStore = async () => {
    setIsAnimating(true);
    try {
      await controls.start({
        scale: 0.3,
        transition: { duration: 1 },
      });
      await controls.start({
        y: 80,
        transition: { duration: 1 },
      });
      setIsBoxClosed(true);
    } catch (error) {
      console.error('アニメーションエラー:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  // 続行のリセット処理
  const handleContinue = () => {
    setIsSubmitted(false);
    setMemory('');
    setIsBoxClosed(false);
    controls.set({ scale: 1, y: 0 });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center w-full"
      style={{
        backgroundImage: `url('/5.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="w-full text-2xl sm:text-4xl font-bold text-center">
        記憶をしまう
      </h1>
      <p className="bg-white text-center text-gray-800 font-semibold p-4 my-4 rounded-lg shadow-lg max-w-lg">
      編集、削除機能がまだ実装できていません。他の方に見られたくない場合は匿名にできます。削除したい場合は、こちらで消せますのでえりかまで連絡ください。
    </p>

      {/* モーダルの表示 */}
      <LoginModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onLogin={handleLogin}
        onGuestLogin={handleGuestLogin}
      />

      {/* メモリボックス部分 */}
      <MemoryBox
        isSubmitted={isSubmitted}
        memory={memory}
        controls={controls}
        isBoxClosed={isBoxClosed}
        isAnimating={isAnimating}
        handleStore={handleStore}
        handleContinue={handleContinue}
      />

      {/* メモリ入力部分 */}
      {!isSubmitted && (
        <MemoryInput
          memory={memory}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Step1;

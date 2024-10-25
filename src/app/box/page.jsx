'use client';

import React, { useState, useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import MemoryInput from '../components/MemoryInput';
import MemoryBox from '../components/MemoryBox';
import LoginModal from '../components/LoginModal';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);
  const [name, setName] = useState('ゲスト');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const controls = useAnimation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // クライアントサイドでのみlocalStorageにアクセス
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const guestToken = localStorage.getItem('guestToken');

      if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
        setIsLoggedIn(true);
        setIsGuest(false);
        fetchUserName(token);
      } else if (guestToken && guestToken !== 'null' && guestToken !== 'undefined' && guestToken.trim() !== '') {
        setIsGuest(true);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
        setIsGuest(false);
        setShowModal(true); 
      }
      setIsLoading(false); 
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'username', password: 'password' }), // ユーザー情報を追加
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        setIsLoggedIn(true); 
        setIsGuest(false);
        setShowModal(false); 
        fetchUserName(data.token); 
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
      const response = await fetch(`${apiUrl}/guest_sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('guestToken', data.token); 
        setIsGuest(true); 
        setIsLoggedIn(false);
        setName('ゲスト'); 
        setShowModal(false); 
        console.log('ゲストとしてログインしました');
      } else {
        console.error('ゲストログインに失敗しました');
      }
    } catch (error) {
      console.error('ゲストログインエラー:', error);
    }
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
  const handleSubmit = async () => {
    if (!isLoggedIn && !isGuest) {
      setShowModal(true); // 未ログインの場合、モーダルを表示
    } else {
      try {
        const token = localStorage.getItem('token');
        const guestToken = localStorage.getItem('guestToken');
        const currentToken = token || guestToken;

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
          console.error('メモリの保存に失敗しました');
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

  const handleLogout = () => {
    localStorage.removeItem('guestToken');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsGuest(false);
    setName('ゲスト');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center w-full max-w-4xl px-4 mx-auto"
      style={{
        backgroundImage: `url('/5.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="w-full text-2xl sm:text-4xl font-bold text-center">
        記憶をしまう
      </h1>

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

      {/* ログイン状態の表示 */}
      {isGuest && (
        <div className="mt-4 p-2 text-black rounded flex flex-col items-center">
          <p>ゲストとしてログインしています</p>
          <button onClick={handleLogout} className="mt-2 p-2 bg-red-500 text-black rounded">
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1;

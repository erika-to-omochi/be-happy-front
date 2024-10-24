'use client';

import React, { useState, useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import MemoryInput from '../components/MemoryInput';
import MemoryBox from '../components/MemoryBox';

const Step1 = () => {
  // 状態の初期化
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);
  const [name, setName] = useState('ゲスト'); // 初期値をゲストに設定
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 実際のログイン状態
  const [isGuest, setIsGuest] = useState(false); // ゲストログイン状態
  const [isLoading, setIsLoading] = useState(true); // 初期読み込み状態を追加

  const controls = useAnimation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log('API URL:', apiUrl);

  // クライアントサイドでのみlocalStorageにアクセス
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // localStorageからトークンを取得
      const token = localStorage.getItem('token');
      const guestToken = localStorage.getItem('guestToken');

      console.log('取得したトークン:', token);
      console.log('取得したゲストトークン:', guestToken);

      // 実際のユーザーがログインしているかを確認
      if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
        setIsLoggedIn(true);
        setIsGuest(false);
        console.log('実際のトークンが見つかりました。isLoggedIn を true に設定します。');

        // トークンからユーザー名を取得する処理
        fetchUserName(token);
      } 
      // ゲストとしてログインしているかを確認
      else if (guestToken && guestToken !== 'null' && guestToken !== 'undefined' && guestToken.trim() !== '') {
        setIsGuest(true);
        setIsLoggedIn(false);
        console.log('ゲストトークンが見つかりました。isGuest を true に設定します。');
      } else {
        setIsLoggedIn(false);
        setIsGuest(false);
        console.log('トークンが見つかりません。isLoggedIn と isGuest は false のままです。');
      }
      setIsLoading(false); // 読み込み完了
    }
  }, []);

  // ユーザー名を取得する関数
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
        console.log('ユーザー名を取得しました:', data.user_name);
      } else {
        console.error('ユーザー情報の取得に失敗しました');
        setName('ゲスト');
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      setName('ゲスト');
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
        if (data.token && data.token !== 'null' && data.token !== 'undefined' && data.token.trim() !== '') { // トークンが存在し、正当な値か確認
          localStorage.setItem('guestToken', data.token); // ゲストトークンを保存
          setIsGuest(true); // ゲスト状態を更新
          setIsLoggedIn(false); // 実際のログイン状態をfalseに設定
          setName('ゲスト'); // 名前をゲストにリセット
          console.log('ゲストとしてログインしました');
        } else {
          console.error('ゲストログインに失敗しました: トークンが返されませんでした');
        }
      } else {
        const errorData = await response.json();
        console.error('ゲストログインに失敗しました:', errorData);
      }
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  // ログアウトする関数
  const handleLogout = () => {
    localStorage.removeItem('guestToken');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsGuest(false);
    setName('ゲスト');
    console.log('ログアウトしました。トークンを削除しました。');
  };

  // メモリ入力のハンドラー
  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  // メモリの送信ハンドラー
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const guestToken = localStorage.getItem('guestToken');

    if (!token && !guestToken) {
      console.error('トークンがありません。ログインが必要です。');
      return;
    }

    const currentToken = token || guestToken;

    if (currentToken === 'null' || currentToken === 'undefined' || currentToken.trim() === '') {
      console.error('無効なトークンです。');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentToken}`, // トークンを送信
        },
        body: JSON.stringify({
          memory: {
            content: memory, // 送信する記憶内容
            name: name,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Memory saved successfully:', data);

        // アニメーション処理
        await controls.start({
          scale: 0.1,
          y: 50,
          transition: { duration: 1 },
        });

        setIsSubmitted(true);
        setIsBoxClosed(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to save memory:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ストア処理のハンドラー
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
      console.error('Animation error:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  // 続行処理のハンドラー
  const handleContinue = () => {
    setIsSubmitted(false);
    setMemory('');
    setIsBoxClosed(false);
    controls.set({ scale: 1, y: 0 });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center w-full max-w-5xl"
      style={{
        backgroundImage: `url('/5.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-4xl lg:text-5xl md:text-5xl sm:text-4xl mb-16 mt-24 font-bold">記憶をしまう</h1>


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

      {/* ゲストログインボタンの表示: ログインしていない場合のみ */}
      {!isLoading && !isLoggedIn && !isGuest && (
        <button
          onClick={handleGuestLogin}
          className="mt-4 p-3 bg-blue-500 text-white rounded w-full max-w-md text-lg"
        >
          ゲストとしてログイン
        </button>
      )}
    </div>
  );
};

export default Step1;

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LayoutGrid } from '../components/ui/LayoutGrid';
import LogoutButton from '../components/LogoutButton'; // LogoutButtonをインポート

const MyMemoriesPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transformingIds, setTransformingIds] = useState({});
  const [transformedContents, setTransformedContents] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を保持
  const [logoutMessage, setLogoutMessage] = useState(''); // ログアウトメッセージを保持

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ログイン状態のチェック
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ログアウトメッセージの表示
  useEffect(() => {
    const message = localStorage.getItem('logoutMessage');
    if (message) {
      setLogoutMessage(message);
      localStorage.removeItem('logoutMessage'); // メッセージを一度表示したら削除
    }
  }, []);

  const handleTransform = async (id) => {
    try {
      setTransformingIds((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem('token'); // トークンを取得
      const response = await fetch(`${apiUrl}/memories/${id}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // 認証トークンをヘッダーに追加
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '変換に失敗しました');
      }

      const data = await response.json();
      const transformedContent = data.content.transformedContent;

      setTransformedContents((prev) => ({
        ...prev,
        [id]: transformedContent,
      }));

      return transformedContent;
    } catch (error) {
      console.error('Transform Error:', error);
      setError(error.message);
    } finally {
      setTransformingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    const fetchMemories = async () => {
      const token = localStorage.getItem('token'); // ログインしているユーザーのトークンを取得
      if (!token) {
        setError('新規登録、ログイン後に自分の投稿した内容が見れます。');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/memories/my_page`, {
          headers: {
            'Authorization': `Bearer ${token}`, // 認証トークンをヘッダーに追加
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
            `Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setMemories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching memories:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
          >
            <Image src="/7.png" alt="Loading Icon" width={50} height={50} />
          </motion.div>
          <p className="text-center text-xl ml-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-center mt-10 text-xl text-black">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* ログインしている場合にのみログアウトボタンを表示 */}
      {isLoggedIn && (
        <div className="absolute top-4 left-4">
          <LogoutButton setIsLoggedIn={setIsLoggedIn} /> {/* LogoutButtonの表示 */}
        </div>
      )}

      {/* ログアウトメッセージの表示 */}
      {logoutMessage && (
        <p className="text-xl text-[#E8C5C0] mb-4">{logoutMessage}</p>
      )}

      <h1 className="text-4xl lg:text-5xl md:text-5xl sm:text-4xl mb-16 mt-24 font-bold">私の記憶一覧</h1>
      <div className="flex flex-col items-center justify-start w-full px-4 sm:px-6 lg:px-8">
        {memories.length === 0 ? (
          <p className="text-lg">記憶がまだありません。<br />『記憶をしまう』から投稿できます。</p>
        ) : (
          <div className="w-full mt-4">
            <LayoutGrid
              cards={memories}
              handleTransform={handleTransform} // handleTransform を渡す
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMemoriesPage;

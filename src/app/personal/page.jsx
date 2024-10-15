'use client';

import React, { useEffect, useState } from 'react';
import { LayoutGrid } from '../components/ui/layout-grid';
import ActionButtons from '../components/ActionButtons';

const IndexPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const imagePaths = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
    '/images/10.png',
    '/images/11.png',
    '/images/12.png',
    '/images/13.png',
    '/images/14.png',
    '/images/15.png',
    '/images/16.png',
    '/images/17.png'
  ];

  // 記憶のポジティブ変換処理
  const handleTransform = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/${id}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const updatedMemory = await response.json();
      setMemories((prevMemories) =>
        prevMemories.map((memory) => (memory.id === id ? updatedMemory : memory))
      );
    } catch (err) {
      console.error(err.message);
      setError(err.message); // エラーを状態に設定
    }
  };

  // 記憶の一覧を取得する
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Memories fetched from API:", data);  // デバッグログ
        setMemories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching memories:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  // カード形式で表示するためのデータを作成
  const cards = memories.map((memory, index) => ({
    id: memory.id,
    content: {
      inputContent: memory.content,
      transformedContent: memory.transformed_content,
      createdAt: memory.created_at,
    },
    className: 'md:col-span-1',
    // 順番に画像を割り当て（画像の数を超えた場合はループする）
    thumbnail: imagePaths[index % imagePaths.length],
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mt-8">箱に入っている記憶一覧</h1>
      {memories.length === 0 ? (
        <p className="text-lg">記憶がまだありません。</p>
      ) : (
        <div className="w-full mt-8">
          <LayoutGrid cards={cards} handleTransform={handleTransform} />
        </div>
      )}

      <ActionButtons />
    </div>
  );
};

export default IndexPage;

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LayoutGrid } from '../components/ui/LayoutGrid';
import ActionButtons from '../components/ActionButtons';

const MyMemoriesPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transformingIds, setTransformingIds] = useState({});
  const [transformedContents, setTransformedContents] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
      console.log('Transformed content:', transformedContent);

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
        setError('トークンがありません。ログインしてください。');
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
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-start w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl lg:text-3xl md:text-3xl sm:text-xl text-base font-bold mt-16">
          私の記憶一覧
        </h1>
        {memories.length === 0 ? (
          <p className="text-lg">記憶がまだありません。</p>
        ) : (
          <div className="w-full mt-4">
            <LayoutGrid
              cards={memories}
              handleTransform={handleTransform} // handleTransform を渡す
            />
          </div>
        )}
        <div className="min-h-[8vh] flex flex-col items-center justify-center p-4">
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default MyMemoriesPage;

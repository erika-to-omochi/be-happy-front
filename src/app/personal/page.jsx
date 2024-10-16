'use client';

import React, { useEffect, useState } from 'react';
import { LayoutGrid } from '../components/ui/LayoutGrid';
import ActionButtons from '../components/ActionButtons';

const IndexPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transformingIds, setTransformingIds] = useState({});
  const [transformedContents, setTransformedContents] = useState({});

  const handleTransform = async (id) => {
    try {
      setTransformingIds((prev) => ({ ...prev, [id]: true })); // 変換中フラグをセット
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memories/${id}/transform`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '変換に失敗しました');
      }
      const data = await response.json();

      setTransformedContents((prev) => ({
        ...prev,
        [id]: data.transformed_content,
      }));

      return data.transformed_content; // 変換された内容を返す
    } catch (error) {
      console.error('Transform Error:', error);
      setError(error.message);
    } finally {
      setTransformingIds((prev) => ({ ...prev, [id]: false })); // 変換中フラグをリセット
    }
  };

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/memories`
        );
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
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white"
    >
      <div className="flex flex-col items-center justify-start w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mt-24">箱に入っている記憶一覧</h1>
        {memories.length === 0 ? (
          <p className="text-lg">記憶がまだありません。</p>
        ) : (
          <div className="w-full mt-8">
            <LayoutGrid
              cards={memories}
              handleTransform={handleTransform} // ここで LayoutGrid に handleTransform を渡す
            />
          </div>
        )}
        <ActionButtons />
      </div>
    </div>
  );
};

export default IndexPage;

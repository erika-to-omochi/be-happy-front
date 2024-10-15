'use client';

import React, { useEffect, useState } from 'react';

const IndexPage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTransform = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/${id}/transform`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const updatedMemory = await response.json();
      // メモリのリストを更新する
      setMemories((prevMemories) =>
        prevMemories.map((memory) => (memory.id === id ? updatedMemory : memory))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMemories(data);
      } catch (err) {
        setError(err.message);
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">箱に入っている記憶一覧</h1>
      {memories.length === 0 ? (
        <p className="text-lg">記憶がまだありません。</p>
      ) : (
        <ul className="w-full max-w-2xl space-y-4">
          {memories.map((memory) => (
            <li key={memory.id} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold">入力内容:</p>
              <p className="mb-4">{memory.content}</p>
              {memory.transformed_content ? (
                <>
                  <p className="text-lg font-semibold">ポジティブ変換:</p>
                  <p>{memory.transformed_content}</p>
                </>
              ) : (
                <button
                className="mt-4 bg-blue-500 text-white p-2 rounded"
                onClick={() => handleTransform(memory.id)}
              >
                ポジティブ変換する
              </button>
            )}
              <p className="text-sm text-gray-500 mt-2">
                作成日: {new Date(memory.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IndexPage;

// front/src/app/components/ui/layout-grid.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const LayoutGrid = ({ cards, handleTransform }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);

  const openModal = (card) => {
    setSelectedMemory(card);
  };

  const closeModal = () => {
    setSelectedMemory(null);
  };

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedMemory) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMemory]);

  return (
    <div className="w-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div
          key={i}
          className={cn(
            card.className,
            "relative overflow-hidden aspect-square rounded-xl h-auto w-full p-4"
          )}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer h-full w-full"
            onClick={() => openModal(card)} // 画像クリックでモーダルを開く
          >
            <Image
              src={card.thumbnail}
              alt="thumbnail"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      ))}

      {/* モーダルの実装 */}
      <AnimatePresence>
        {selectedMemory && (
          <>
            {/* モーダルのバックグラウンド */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            {/* モーダルコンテンツ */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-lg max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()} // モーダルコンテンツのクリックで閉じないようにする
              >
                {/* クローズボタン */}
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  &#10005;
                </button>

                {/* モーダルの内容 */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">詳細情報</h2>
                  <p className="text-lg font-semibold">入力内容:</p>
                  <p className="mb-4">{selectedMemory.content.inputContent}</p>
                  {selectedMemory.content.transformedContent ? (
                    <>
                      <p className="text-lg font-semibold">ポジティブ変換:</p>
                      <p>{selectedMemory.content.transformedContent}</p>
                    </>
                  ) : (
                    <button
                      className="mt-4 bg-blue-500 text-white p-2 rounded"
                      onClick={() => handleTransform(selectedMemory.id)}
                    >
                      ポジティブ変換する
                    </button>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    作成日:{" "}
                    {selectedMemory.content.createdAt &&
                    !isNaN(new Date(selectedMemory.content.createdAt))
                      ? new Date(selectedMemory.content.createdAt).toLocaleString()
                      : "不明"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const LayoutGrid = ({ cards, handleTransform }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ローディング状態の追加

  const openModal = (card) => {
    setSelectedMemory(card); // モーダルを開くときに選択されたカードを設定
  };

  const closeModal = () => {
    setSelectedMemory(null);
    setIsLoading(false); // モーダルを閉じたときにローディングをリセット
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

  const handleTransformClick = async (id) => {
    setIsLoading(true); // 変換処理の開始時にローディング状態にする

    try {
      // 変換処理を実行し、変換された内容を取得
      const transformedContent = await handleTransform(id);
      console.log('Transformed Content:', transformedContent); // 変換後の内容をログ出力

      if (transformedContent) {
        // 状態を更新
        setSelectedMemory((prev) => {
          const updatedMemory = {
            ...prev,
            content: {
              ...prev.content,
              transformedContent: transformedContent,
            },
          };
          console.log('Updated selectedMemory:', updatedMemory); // 更新後の状態をログ出力
          return updatedMemory;
        });
      } else {
        console.warn('Transformed content is null or undefined.');
      }
    } catch (error) {
      console.error('Error during transformation:', error);
      // 必要に応じてエラーハンドリングを追加
    } finally {
      setIsLoading(false); // 変換が終わったらローディングを解除
    }
  };

  return (
    <div className="w-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div
          key={i}
          className={cn(
            card.className,
            "relative overflow-hidden aspect-square h-auto w-full"
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
                  <p className="text-lg font-semibold">入力内容</p>
                  <p className="mb-4">{selectedMemory.content.inputContent}</p>

                  {isLoading ? ( // ローディング中の表示
                    <div className="flex justify-center items-center">
                      <p className="text-lg font-semibold">Loading...</p>
                      <span className="loading loading-spinner loading-xs ml-2"></span> {/* スピナーを追加 */}
                    </div>
                  ) : selectedMemory.content.transformedContent ? (
                    <>
                      <p className="text-lg font-semibold">ポジティブ変換</p>
                      <p>{selectedMemory.content.transformedContent}</p>
                    </>
                  ) : (
                    <div className="flex justify-center"> {/* ボタンを中央に配置 */}
                      <button
                        className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
                        onClick={() => handleTransformClick(selectedMemory.id)}
                      >
                        ポジティブ変換する
                      </button>
                    </div>
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
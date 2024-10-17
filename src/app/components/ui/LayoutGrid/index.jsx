'use client';

import React, { useState, useEffect } from 'react';
import ImageCard from '../image-card';
import Modal from '../modal';

export const LayoutGrid = ({ cards, handleTransform }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCards, setUpdatedCards] = useState([]);

  useEffect(() => {
    // cards のデータをマッピングして updatedCards に保存
    const mappedCards = cards.map((card, index) => ({
      ...card,
      content: {
        inputContent: card.content.inputContent || card.content,
        transformedContent: card.content.transformedContent || card.transformed_content,
        createdAt: card.content.createdAt || card.created_at,
      },
      // サムネイル画像が存在しない場合、デフォルトの画像を使用
      thumbnail: card.thumbnail || `/images/${index % 17 + 1}.png`,
    }));
    setUpdatedCards(mappedCards);
  }, [cards]);

  const openModal = (card) => {
    setSelectedMemory(card); // モーダルに表示する記憶を設定
  };

  const closeModal = () => {
    setSelectedMemory(null); // モーダルを閉じる
    setIsLoading(false);
  };

  const handleTransformClick = async (id) => {
    setIsLoading(true);
    try {
      const transformedContent = await handleTransform(id); // 変換処理を実行
      if (transformedContent) {
        // 選択された記憶に変換後の内容を即座に反映
        setSelectedMemory((prev) => ({
          ...prev,
          content: {
            ...prev.content,
            transformedContent: transformedContent,
          },
        }));

        // updatedCards 配列も更新
        setUpdatedCards((prevCards) =>
          prevCards.map((card) =>
            card.id === id
              ? {
                  ...card,
                  content: {
                    ...card.content,
                    transformedContent: transformedContent,                  },
                }
              : card
          )
        );
      }
    } catch (error) {
      console.error('Error during transformation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {updatedCards.map((card) => (
        <ImageCard key={card.id} card={card} onClick={() => openModal(card)} />
      ))}
      {selectedMemory && (
        <Modal
          selectedMemory={selectedMemory}
          onClose={closeModal}
          onTransform={() => handleTransformClick(selectedMemory.id)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
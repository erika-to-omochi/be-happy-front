'use client';

import React, { useState, useEffect } from 'react';
import ImageCard from '../image-card';
import Modal from '../modal';

export const LayoutGrid = ({ cards, handleTransform, currentUser }) => { // currentUser を受け取る
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCards, setUpdatedCards] = useState([]);

  useEffect(() => {
    const mappedCards = cards.map((card, index) => ({
      ...card,
      content: {
        inputContent: card.content.inputContent || card.content,
        transformedContent: card.content.transformedContent || card.transformed_content,
        createdAt: card.content.createdAt || card.created_at,
      },
      thumbnail: card.thumbnail || `/images/${index % 17 + 1}.png`,
    }));
    setUpdatedCards(mappedCards);
  }, [cards]);

  const openModal = (card) => {
    setSelectedMemory(card);
  };

  const closeModal = () => {
    setSelectedMemory(null);
    setIsLoading(false);
  };

  const handleTransformClick = async (id, userId) => {
    setIsLoading(true);
    try {
      const transformedContent = await handleTransform(id, userId); // userId を渡す
      if (transformedContent) {
        setSelectedMemory((prev) => ({
          ...prev,
          content: {
            ...prev.content,
            transformedContent,
          },
        }));

        setUpdatedCards((prevCards) =>
          prevCards.map((card) =>
            card.id === id
              ? {
                  ...card,
                  content: {
                    ...card.content,
                    transformedContent,
                  },
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
    <div className="w-full h-full p-4 grid grid-cols-3 gap-4 justify-items-center mx-auto max-w-screen-lg">
      {updatedCards.map((card) => (
        <ImageCard key={card.id} card={card} onClick={() => openModal(card)} />
      ))}
      {selectedMemory && (
        <Modal
          selectedMemory={selectedMemory}
          onClose={closeModal}
          onTransform={() => handleTransformClick(selectedMemory.id, selectedMemory.user?.id)} // user?.id を使用して安全に取得
          isLoading={isLoading}
          currentUser={currentUser} // currentUser を Modal に渡す
        />
      )}
    </div>
  );
};

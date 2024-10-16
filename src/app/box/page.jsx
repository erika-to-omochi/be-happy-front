// pages/Step1.js
'use client';

import React, { useState } from 'react';
import { useAnimation } from 'framer-motion';
import MemoryInput from '../components/MemoryInput';
import MemoryBox from '../components/MemoryBox';
import ActionButtons from '../components/ActionButtons';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);

  const controls = useAnimation();

  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  const handleSubmit = async () => {
    await controls.start({
      scale: 0.1,
      y: 50,
      transition: { duration: 1 },
    });
    setIsSubmitted(true);
    setIsBoxClosed(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memory: { content: memory } }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Memory saved successfully:', data);
      } else {
        const errorData = await response.json();
        console.error('Failed to save memory:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const handleContinue = () => {
    setIsSubmitted(false);
    setMemory('');
    setIsBoxClosed(false);
    controls.set({ scale: 1, y: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="fixed top-0 left-0 w-full text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center mt-32">
        STEP 1
      </h1>

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

      {/* アクションボタン */}
      <ActionButtons />
    </div>
  );
};

export default Step1;

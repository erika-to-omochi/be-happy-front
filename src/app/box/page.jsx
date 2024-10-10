'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`, {
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

    setTimeout(() => {
      setIsSubmitted(false);
      setMemory('');
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">STEP 1</h1>

      <div className="flex justify-center">
        <Image
          src="/2.png"
          alt="Chamomile"
          width={320} // sm:w-80 に対応
          height={320}
          className="object-cover rounded-lg shadow-lg"
          priority={true}
        />
      </div>

      <p className="text-center text-base sm:text-lg max-w-md mb-4 sm:mb-6">
        あなたが整理したい記憶を教えてください。
      </p>

      {!isSubmitted && (
        <div className="relative w-full max-w-md">
          <textarea
            value={memory}
            onChange={handleInputChange}
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ここに入力してください。"
            rows="4"
          />
        </div>
      )}

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center mt-4 sm:mt-6 bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
        >
          <span className="mr-2">送信</span>
          <span className="text-xl">⬆️</span>
        </button>
      )}

      {/* 箱のアニメーション */}
      {isSubmitted && (
        <div className="relative mt-6 text-center">
          {/* テキストが箱に縮小して入るアニメーション */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.1, y: 50 }}
            transition={{ duration: 1 }}
            className="text-lg mb-4 sm:mb-8"
          >
            {memory}
          </motion.div>

          {/* 箱の画像 */}
          <motion.div initial={{ scale: 1 }} animate={{ scale: 1 }}>
            <Image
              src="/box1.png"
              alt="開いた箱"
              width={192} // sm:w-48 に対応
              height={192}
              className="mx-auto"
            />
          </motion.div>

          {/* 箱の蓋が閉まるアニメーション */}
          <motion.div
            initial={{ y: -230}}
            animate={{ y: -150 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <Image
              src="/box2.png"
              alt="蓋"
              width={192} // sm:w-48 に対応
              height={192}
              className="mx-auto absolute top-0"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Step1;

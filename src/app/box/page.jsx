'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);

  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setIsBoxClosed(false);

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
      setIsBoxClosed(true);
    }, 2500); // アニメーション完了後の待機時間を設定
  };

  const handleContinue = () => {
    setIsSubmitted(false);
    setMemory('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">STEP 1</h1>

      {/* 画像とアニメーションが表示される領域 */}
      <div className="relative flex justify-center w-full max-w-md">
        {/* isSubmittedがtrueのときはsrc="/2.png"を非表示にし、箱のアニメーションを表示 */}
        {!isSubmitted ? (
          <Image
            src="/2.png"
            alt="Chamomile"
            width={320}
            height={320}
            className="object-cover rounded-lg shadow-lg"
            priority={true}
          />
        ) : (
          <div className="relative w-full h-[320px] flex items-center justify-center">
            {/* テキストが左上から箱に向かって縮小して入るアニメーション */}
            <motion.div
              initial={{ opacity: 1, scale: 2, x: -100, y: -100 }}
              animate={{ opacity: 0, scale: 0.1, x: 100, y: 200 }}
              transition={{ duration: 1.5 }}
              className="text-2xl sm:text-3xl font-bold text-center"
              style={{ position: 'absolute', left: 0, top: 0 }}
            >
              {memory}
            </motion.div>

            {/* 箱の画像 */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="absolute top-[25%] left-[25%] transform -translate-x-1/2 -translate-y-[20%]" // 修正箇所
            >
              <Image
                src="/box1.png"
                alt="開いた箱"
                width={256}
                height={256}
                className="mx-auto"
              />
            </motion.div>

            {/* 箱の蓋が閉まるアニメーション */}
            <motion.div
              initial={{ y: -70 }}
              animate={{ y: -25 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-[25%] left-[25%] transform -translate-x-1/2 -translate-y-[20%]" // 修正箇所
            >
              <Image
                src="/box2.png"
                alt="蓋"
                width={256}
                height={256}
                className="mx-auto"
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* isSubmittedがfalseのときだけメッセージを表示 */}
      {!isSubmitted && (
        <p className="text-center text-base sm:text-lg max-w-md mb-4 sm:mb-6">
          あなたが整理したい記憶を教えてください。
        </p>
      )}

      {/* テキストエリアと送信ボタン */}
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

      {/* 蓋が閉まった後のメッセージとボタン */}
      {isSubmitted && isBoxClosed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-base sm:text-lg mb-4">
            嫌な記憶が勝手に出てこないように蓋をしました。
          </p>
          <button
            onClick={handleContinue}
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
          >
            続ける
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Step1;

'use client';

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

const Step1 = () => {
  const [memory, setMemory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxClosed, setIsBoxClosed] = useState(false);

  // Framer Motionのアニメーションコントロール
  const controls = useAnimation();

  const handleInputChange = (e) => {
    setMemory(e.target.value);
  };

  const handleSubmit = async () => {
    await controls.start({
      scale: 0.1,
      y: 50, // 下方向に50px移動（必要に応じて調整）
      transition: { duration: 1 },
    });
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
  };

  const handleStore = async () => {
    setIsAnimating(true);

    try {
      // 1. Scale down the memo
      await controls.start({
        scale: 0.3,
        transition: { duration: 1 },
      });

      // 2. Move the memo downward
      await controls.start({
        y: 80, // Adjust the value as needed for downward movement
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
    setIsBoxClosed(false); // 箱の閉じた状態もリセット
    controls.set({ scale: 1, y: 0 }); // メモの位置とスケールをリセット
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">STEP 1</h1>

      {/* 画像とアニメーションが表示される領域 */}
      <div className="relative flex justify-center w-full max-w-md h-[400px]">
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
          <div className="relative w-full h-full flex items-center justify-center">
            {/* メモが大きなまま表示され、スケールダウンする */}
            <motion.div
              key="memo"
              initial={{ opacity: 1, scale: 1, y: -100 }}
              animate={controls}
              className="text-2xl sm:text-3xl font-bold bg-white p-4 shadow-lg rounded-md"
              style={{
                position: 'absolute',
                top: '30%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                maxWidth: '90%',
                height: 'auto',
                maxHeight: '300px',
                overflow: 'hidden',
                padding: '16px',
              }}
            >
              {memory}
            </motion.div>

            {/* 箱の画像を固定位置に配置 */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="absolute top-[200px] transform -translate-x-1/2"
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
            {isBoxClosed && (
              <motion.div
                initial={{ y: -90 }}
                animate={{ y: -25 }}
                transition={{ duration: 1 }}
                className="absolute top-[200px] transform -translate-x-1/2"
              >
                <Image
                  src="/box2.png"
                  alt="蓋"
                  width={256}
                  height={256}
                  className="mx-auto"
                />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 送信後に表示するメッセージ */}
      {isSubmitted && (
        <div className="mt-4 text-center">
          <p className="text-base sm:text-lg mb-4">
            嫌な記憶が勝手に出てこないように<br />記憶を箱にしまいましょう。
          </p>
          {!isBoxClosed && !isAnimating && (
            <button
              onClick={handleStore}
              className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
            >
              記憶を箱にしまう
            </button>
          )}
        </div>
      )}

      {/* 蓋が閉まった後のボタン */}
      {isBoxClosed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-4 text-center"
        >
          <button
            onClick={handleContinue}
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
          >
            続ける
          </button>
        </motion.div>
      )}

      {/* isSubmittedがfalseのときだけメッセージを表示 */}
      {!isSubmitted && (
        <p className="text-center text-base sm:text-lg max-w-md mt-4 mb-2 sm:mb-6">
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
    </div>
  );
};

export default Step1;

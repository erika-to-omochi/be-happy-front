'use client';

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
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
      {/* タイトル部分 */}
      <h1 className="fixed top-0 left-0 w-full text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center mt-32">
        STEP 1
      </h1>

      <div className="relative flex justify-center w-full h-auto mb-1 mt-20">
        {!isSubmitted ? (
          <Image
            src="/2.png"
            alt="Chamomile"
            layout="responsive"
            width={320}
            height={320}
            className="max-w-[320px] object-cover rounded-lg shadow-lg"
            priority={true}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
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

            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="absolute top-[0px] transform -translate-x-1/2"
            >
              <Image
                src="/box1.png"
                alt="開いた箱"
                width={256}
                height={256}
                className="mx-auto"
                style={{ width: "auto", height: "auto" }}
              />
            </motion.div>

            {isBoxClosed && (
              <motion.div
                initial={{ y: -90 }}
                animate={{ y: -25 }}
                transition={{ duration: 1 }}
                className="absolute top-[0px] transform -translate-x-1/2"
              >
                <Image
                  src="/box2.png"
                  alt="蓋"
                  width={256}
                  height={256}
                  className="mx-auto"
                  style={{ width: "auto", height: "auto" }}
                />
              </motion.div>
            )}

            {!isBoxClosed && !isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-[150px] mt-4 text-center"
              >
                <button
                  onClick={handleStore}
                  className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
                >
                  記憶を箱にしまう
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {isBoxClosed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[150px] mt-4 text-center"
        >
          <button
            onClick={handleContinue}
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
          >
            続ける
          </button>
        </motion.div>
      )}

      {!isSubmitted && (
        <div className="relative w-full max-w-md mt-8">
          <textarea
            value={memory}
            onChange={handleInputChange}
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="あなたが整理したい記憶を、ここに入力してください。"
            rows="4"
          />
        </div>
      )}

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center sm:mt-6 bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
        >
          <span className="mr-2">送信</span>
        </button>
      )}
      <ActionButtons />
    </div>
  );
};

export default Step1;

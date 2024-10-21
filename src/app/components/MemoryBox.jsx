'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MemoryBox = ({
  isSubmitted,
  memory,
  controls,
  isBoxClosed,
  isAnimating,
  handleStore,
  handleContinue,
}) => {
  return (
    <div className="relative flex justify-center w-full h-auto mb-1 mt-20">
      {!isSubmitted ? (
        <div className="max-w-[320px] object-cover rounded-lg shadow-lg flex justify-center items-center">
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* メモリを表示 */}
          <motion.div
            key="memo"
            initial={{ opacity: 1, scale: 1, y: -100 }}
            animate={controls}
            className="text-l sm:text-l bg-white p-4 shadow-lg rounded-md max-w-[12rem] sm:max-w-[16rem] md:max-w-[18rem] lg:max-w-[20rem]"
            style={{
              position: 'absolute',
              top: '30%',
              transform: 'translate(-50%, -50%)',
              height: 'auto',
              maxHeight: '200px',
              overflow: 'hidden',
            }}
          >
            {memory}
          </motion.div>

          {/* 箱の表示 */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="relative mt-48"
          >
            <Image
              src="/box1.png"
              alt="開いた箱"
              width={288} // 適切なサイズを指定
              height={288} // 適切なサイズを指定
              className="mx-auto w-48 sm:w-64 md:w-72"
            />
          </motion.div>

          {/* 蓋の表示 */}
          {isBoxClosed && (
            <motion.div
              initial={{ y: -90 }}
              animate={{ y: -25 }}
              transition={{ duration: 1 }}
              className="absolute top-48 transform -translate-x-1/2"
            >
              <Image
                src="/box2.png"
                alt="蓋"
                width={288} // 適切なサイズを指定
                height={288} // 適切なサイズを指定
                className="mx-auto w-48 sm:w-64 md:w-72 lg:w-80"
              />
            </motion.div>
          )}
        </div>
      )}

      {/* 記憶を箱にしまうボタン - 送信が完了した後に表示 */}
      {!isBoxClosed && !isAnimating && isSubmitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[-64px] w-full flex justify-center"
        >
          <button
            onClick={handleStore}
            className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200"
          >
            記憶を箱にしまう
          </button>
        </motion.div>
      )}

      {/* 続けるボタン - 箱の外に配置 */}
      {isBoxClosed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[-64px] w-full flex justify-center"
        >
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

export default MemoryBox;

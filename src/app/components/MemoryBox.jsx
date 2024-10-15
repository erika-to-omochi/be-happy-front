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
              top: '0%',
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

          {/* 箱の表示 */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <Image
              src="/box1.png"
              alt="開いた箱"
              width={256}
              height={256}
              className="mx-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
          </motion.div>

          {/* 蓋の表示 */}
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
                style={{ width: 'auto', height: 'auto' }}
              />
            </motion.div>
          )}

          {/* 記憶を箱にしまうボタン - 箱の外に配置 */}
          {!isBoxClosed && !isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-[-100px] w-full flex justify-center"
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
              className="absolute bottom-[-100px] w-full flex justify-center"
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
      )}
    </div>
  );
};

export default MemoryBox;

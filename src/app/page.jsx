'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import ActionButtons from './components/ActionButtons';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl lg:text-5xl md:text-5xl sm:text-4xl mb-16 mt-32">May you be happy</h1>
      <div className="flex justify-center">
        <Image
          src="/6.png"
          alt="Chamomile"
          width={320}
          height={320}
          className="sm:w-80 sm:h-80 object-cover mb-8 transition-transform duration-500 hover:rotate-180"
          priority={true}
        />
      </div>

      {/* このアプリでできることの説明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-10 text-center"
      >
        <h2 className="text-2xl font-bold mb-8 mt-8">このアプリでできること</h2>

        {/* 画像と説明のセット */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mt-8 mb-8">
          {/* STEP 1 */}
          <Link href="/box" passHref>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="bg-white/50 p-4 rounded-lg shadow-lg"
            >
              <p className="text-gray-700 text-sm sm:text-lg mb-4">
                1. 嫌な記憶を箱にしまう
              </p>
              <Image
                src="/how-to-1.png"
                alt="Step 1"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </motion.div>
          </Link>

          {/* STEP 2 */}
          <Link href="/personal" passHref>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.7 }}
              className="bg-white/50 p-4 rounded-lg shadow-lg"
            >
              <p className="text-gray-700 text-sm sm:text-lg mb-4">
                2. AIで嫌な記憶をポジティブ変換
              </p>
              <Image
                src="/how-to-2.png"
                alt="Step 2"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-700 text-sm sm:text-lg mt-4 sm:mt-6 text-center max-w-xs sm:max-w-xl">
        カモミールの花言葉は、「逆境に耐える」、<br/>「逆境で生まれる力」、「あなたを癒す」です。<br/>このアプリはあなたの幸せを祈って作りました。
      </p>

      <div className="min-h-[20vh] flex flex-col items-center justify-center p-4">
        <ActionButtons />
      </div>


    </div>
  );
}

export default App;

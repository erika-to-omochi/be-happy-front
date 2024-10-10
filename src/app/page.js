import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPencilAlt, FaMedal, FaLightbulb, FaHandHolding } from "react-icons/fa";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
        May you be happy
      </h1>

      <div className="flex justify-center">
        <Image
          src="/1.png"
          alt="Chamomile Tea"
          width={400}
          height={400}
          className="sm:w-80 sm:h-80 object-cover rounded-lg shadow-lg"
          priority={true}
        />
      </div>

      <p className="text-gray-700 text-sm sm:text-lg mt-4 sm:mt-6 text-center max-w-xs sm:max-w-xl">
        カモミールの花言葉は、「逆境に耐える」、<br/>「逆境で生まれる力」、「あなたを癒す」です。<br/>このアプリはあなたの幸せを祈って作りました。
      </p>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/box">
          <button
            className="flex items-center justify-center bg-[#D5CEC6] p-3 sm:p-4 rounded-full shadow-lg text-sm sm:text-lg hover:bg-[#C0B8AE] transition"
          >
            <FaPencilAlt className="mr-2" />
            しまう
          </button>
        </Link>
        <button
          className="flex items-center justify-center bg-[#D5CEC6] p-3 sm:p-4 rounded-full shadow-lg text-sm sm:text-lg hover:bg-[#C0B8AE] transition"
        >
          <FaMedal className="mr-2" />
          勝つ
        </button>
        <button
          className="flex items-center justify-center bg-[#D5CEC6] p-3 sm:p-4 rounded-full shadow-lg text-sm sm:text-lg hover:bg-[#C0B8AE] transition"
        >
          <FaLightbulb className="mr-2" />
          変換
        </button>
        <button
          className="flex items-center justify-center bg-[#D5CEC6] p-3 sm:p-4 rounded-full shadow-lg text-sm sm:text-lg hover:bg-[#C0B8AE] transition"
        >
          <FaHandHolding className="mr-2" />
          シェア
        </button>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaSmileWink, FaLightbulb, FaHome } from 'react-icons/fa';

const ActionButtons = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[rgba(244,244,242,0.5)] p-4 shadow-lg">
      <div className="grid grid-cols-4 gap-4 text-center">
        <Link href="/" className="flex flex-col items-center justify-center hover:text-[#C0B8AE] transition">
          <FaHome className="text-3xl" />
          <span className="mt-2 text-sm sm:text-lg">ホーム</span>
        </Link>
        <Link href="/indexPage" className="flex flex-col items-center justify-center hover:text-[#C0B8AE] transition">
          <FaLightbulb className="text-3xl" />
          <span className="mt-2 text-sm sm:text-lg">みんなの記憶</span>
        </Link>
        <Link href="/box" className="flex flex-col items-center justify-center hover:text-[#C0B8AE] transition">
          <FaPencilAlt className="text-3xl" />
          <span className="mt-2 text-sm sm:text-lg">記憶をしまう</span>
        </Link>
        <Link href="/myPage" className="flex flex-col items-center justify-center hover:text-[#C0B8AE] transition">
          < FaSmileWink className="text-3xl" />
          <span className="mt-2 text-sm sm:text-lg">マイページ</span>
        </Link>
      </div>
    </div>
  );
};

export default ActionButtons;

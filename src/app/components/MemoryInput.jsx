'use client';

import React from 'react';

const MemoryInput = ({ memory, handleInputChange, handleSubmit }) => {
  return (
    <div className="relative w-full max-w-md mt-8">
      <textarea
        value={memory}
        onChange={handleInputChange}
        className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="あなたが整理したい記憶を、ここに入力してください。"
        rows="4"
      />
      {/* ボタンを中央に配置するためのコンテナ */}
      <div className="flex justify-center sm:mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200 mt-4"
        >
          <span className="m-2">送信</span>
        </button>
      </div>
    </div>
  );
};

export default MemoryInput;
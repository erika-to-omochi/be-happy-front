'use client';

import React, { useEffect, useState } from 'react';

const MemoryInput = ({ memory, handleInputChange, handleSubmit }) => {
  const [name, setName] = useState('ゲスト');

  // ログイン状態に応じて名前を設定
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit({ memory, name: name });
  };

  return (
    <div className="relative w-full max-w-md mt-56">
      {/* 名前入力フィールド */}
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="あなたの名前を入力してください"
        />
      </div>

      {/* 記憶入力フィールド */}
      <textarea
        value={memory}
        onChange={handleInputChange}
        className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="あなたが整理したい記憶を、ここに入力してください。"
        rows="4"
      />

      <div className="flex justify-center sm:mt-6">
        <button
          onClick={handleFormSubmit}
          className="bg-[#D5CEC6] hover:bg-[#C0B8AE] text-gray-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-all duration-200 mt-4"
        >
          <span className="m-2">送信</span>
        </button>
      </div>
    </div>
  );
};

export default MemoryInput;

'use client';

import React, { useEffect, useState } from 'react';

const MemoryInput = ({ memory, handleInputChange, handleSubmit, isLoggedOut }) => {
  const [name, setName] = useState('ゲスト');
  const [error, setError] = useState('');

  // ログイン状態に応じて名前を設定
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, [isLoggedOut]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    localStorage.setItem('name', e.target.value);  // 名前を localStorage に保存
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!memory.trim()) {
      setError('記憶を入力してください');
      return;
    }
    setError('');
    handleSubmit({ memory, name });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[70%]">
      {/* 名前入力フィールド */}
      <div className="mb-4 w-full flex justify-center">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-1/2 p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="名前を入力"
        />
      </div>

      {/* 記憶入力フィールド */}
      <div className="w-full">
        <textarea
          value={memory}
          onChange={handleInputChange}
          className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="あなたが整理したい記憶を、ここに入力してください。"
          rows="6"
        />
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>

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

import React from 'react';
import Image from 'next/image';
import ActionButtons from './components/ActionButtons';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl mb-32">May you be happy</h1>
      <div className="flex justify-center">
        <Image
          src="/6.png"
          alt="Chamomile Tea"
          width={320}
          height={320}
          className="sm:w-80 sm:h-80 object-cover mb-8"
          priority={true}
        />
      </div>

      <p className="text-gray-700 text-sm sm:text-lg mt-4 sm:mt-6 text-center max-w-xs sm:max-w-xl">
        カモミールの花言葉は、「逆境に耐える」、<br/>「逆境で生まれる力」、「あなたを癒す」です。<br/>このアプリはあなたの幸せを祈って作りました。
      </p>

      < ActionButtons />
    </div>
  );
}


export default App;

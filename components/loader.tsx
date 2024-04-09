import Image from 'next/image';
import React from 'react';

const Loader = () => {
  return (
    <div className='w-full h-full flex flex-col place-items-center gap-y-4 pt-10'>
      <div className='w-10 h-10 relative animate-ping'>
        <Image src='/donut_logo.png' alt='donut spinner' fill />
      </div>
    </div>
  );
};

export default Loader;

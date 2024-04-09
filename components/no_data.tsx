import Image from 'next/image';
import React from 'react';

type NoDataProps = {
  label: string;
};
const NoData = ({ label }: NoDataProps) => {
  return (
    <div className='h-full p-20 flex flex-col place-items-center'>
      <div className='relative h-72 w-72'>
        <Image src='/no_data.jpg' fill alt='no data' />
      </div>
      <p className='text-muted-foreground text-sm text-center'>{label}</p>
    </div>
  );
};

export default NoData;

'use client';

import { useRouter } from 'next/navigation';

export default function Home () {
  const router = useRouter();
  function handleClick () {
    router.push('/setup');
  }


  return (
    <main className='flex flex-col items-center'>
      <div className='pt-40'>
        <h1 className='inline-block text-6xl font-black tracking-[-0.4px]'>Welcome to</h1>
        <div className='inline-block bg-black ml-2 pb-1 px-2 rounded-lg'>
          <h1 className='text-6xl font-black tracking-[-0.4px] text-white'>Sixtran</h1>
        </div>
      </div>
      <div className='mt-5 mb-20'>
        <p className='text-xl text-gray-500 font-normal'>Your management suite for Fivetran</p>
      </div>
      <button onClick={handleClick} className='bg-[#06AB78] text-white text-4xl py-2 px-5 rounded-lg font-bold hover:bg-[#059B6C]'>Get started</button>
    </main>
  );
}

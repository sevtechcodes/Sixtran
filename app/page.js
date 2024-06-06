'use client';

import { useRouter } from 'next/navigation';

export default function Home () {
  const router = useRouter();
  function handleClick () {
    router.push('/setup');
  }


  return (
    <main>
      <h1>Welcome to Sixtran</h1>
      <p>Your management suite for Fivetran</p>
      <button onClick={handleClick}>Get started</button>
    </main>
  );
}

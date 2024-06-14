'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CredentialsForm from '../ui/credentials-form';
import { getCookie } from 'cookies-next';


export default function Page (): React.ReactElement {
  const [validCredentials, setValidCredentials] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const cookie = getCookie('user');
    if (cookie) setValidCredentials(true);
  }, []);

  function handleClick (): void {
    router.push('/dashboard');
  }

  return (
    <div className='flex flex-row justify-around pt-40'>
      {validCredentials && <div className='content-center'>
        <button onClick={handleClick}
          className='bg-[#06AB78] text-white text-3xl py-2 px-5 rounded-lg font-bold hover:bg-[#059B6C]'
        >Use existing credentials</button>
      </div>}

      <div className='flex flex-col content-center m-20 content-center'>
        <CredentialsForm />
      </div>
    </div>
  );
}
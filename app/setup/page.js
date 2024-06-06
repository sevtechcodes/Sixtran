'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CredentialsForm from '../ui/credentials-form';


export default function Page () {
  const router = useRouter();
  return (
    <>
      <div>
        <button>Use existing credentials</button>
      </div>

      <div>
        <h3>Update credentials</h3>
        <CredentialsForm />
      </div>
    </>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '../lib/fivetran';
import { setCookie } from 'cookies-next';

interface FormData {
  apiKey: string;
  apiSecret: string;
}

interface ApiResponse {
  status: number;
  body: any;
}

export default function CredentialsForm (): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({apiKey: '', apiSecret: ''});
  const router = useRouter();

  function handleChange (event: any): void {
    const {name, value} = event.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  }

  async function handleSubmit (event: any): Promise<void> {
    event.preventDefault();
    if (formData.apiKey.trim().length === 0 || formData.apiSecret.trim().length === 0) {
      return;
    }
		
    const response: ApiResponse | void = await apiCall('account/info', formData.apiKey, formData.apiSecret);

    if (response && 'status' in response && response.status === 200) {
      setCookie('user',  JSON.stringify({fivetranApiKey: formData.apiKey, fivetranApiSecret: formData.apiSecret}));
      router.push('/dashboard');
    }

  }

  return (
    <div className=''>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input name='apiKey' type='text' value={formData.apiKey} onChange={handleChange} placeholder='Fill in API Key'
          className='border mt-10 border-black rounded px-2'
        ></input>
        <input name='apiSecret' type='text' value={formData.apiSecret} onChange={handleChange} placeholder='Fill in API Secret'
          className='border mt-10 border-black rounded px-2'
        ></input>
        <button type='submit'
          className='mt-10 bg-black text-white text-2xl py-1 px-3 rounded-lg font-bold  hover:bg-[#5C5B61]'
        >Update credentials</button>
      </form>
    </ div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '../lib/fivetran';
import { setCookie } from 'cookies-next';


export default function CredentialsForm () {
  const [formData, setFormData] = useState({apiKey: '', apiSecret: ''});
  const router = useRouter();



  function handleChange (event) {
    const {name, value} = event.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  }

  async function handleSubmit (event) {
    event.preventDefault();
    if (formData.apiKey.trim().length === 0 || formData.apiSecret.trim().length === 0) {
      return;
    }

    const response = await apiCall('account/info', formData.apiKey, formData.apiSecret);

    if (response.status === 200) {
      setValidCredentials(true);
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
          className='mt-10 bg-black text-white text-2xl py-1 px-3 rounded-lg font-bold'
        >Update credentials</button>
      </form>
    </ div>
  );
}
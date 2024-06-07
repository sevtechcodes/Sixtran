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
        <input name='apiKey' type='text' value={formData.apiKey} onChange={handleChange} placeholder='Fill in API Key'></input>
        <input name='apiSecret' type='text' value={formData.apiSecret} onChange={handleChange} placeholder='Fill in API Secret'></input>
        <button type='submit'>Get started</button>
      </form>
    </ div>
  );
}
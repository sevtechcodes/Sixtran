'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '../lib/fivetran';
import { useCookies } from 'next-client-cookies';

export default function CredentialsForm () {
  const [formData, setFormData] = useState({apiKey: '', apiSecret: ''});
  const [validCredentials, setValidCredentials] = useState(false);
  const router = useRouter();
  const cookies = useCookies();
  const cookie = cookies.get('user');
  console.log('effect');
  console.log(cookie);
  
  useEffect(() => {
  }, []);

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
      cookies.set('user',  JSON.stringify({fivetranApiKey: formData.apiKey, fivetranApiSecret: formData.apiSecret}));
      // router.push('/dashboard');
    }

  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name='apiKey' type='text' value={formData.apiKey} onChange={handleChange} placeholder='Fill in API Key'></input>
        <input name='apiSecret' type='text' value={formData.apiSecret} onChange={handleChange} placeholder='Fill in API Secret'></input>
        <button type='submit'>Get started</button>
      </form>
    </>
  );
}
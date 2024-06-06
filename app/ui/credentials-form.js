'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '../lib/fivetran';


export default function CredentialsForm () {
  const [formData, setFormData] = useState({apiKey: '', apiSecret: ''});
  const [validCredentials, setValidCredentials] = useState(false);
  const router = useRouter();

  function handleChange (event) {
    const {name, value} = event.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  }

  async function handleSubmit (event) {
    event.preventDefault();
    const response = await apiCall('account/info', formData.apiKey, formData.apiSecret);
    if (response.status === 200) {
      setValidCredentials(true);

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
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function CredentialsForm () {
  const [formData, setFormData] = useState({apiKey: '', apiSecret: ''});
  const router = useRouter();

  function handleChange (event) {
    const {name, value} = event.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  }

  function handleSubmit (event) {
    event.preventDefault();
    router.push('/dashboard');
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
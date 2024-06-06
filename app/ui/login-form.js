'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginForm () {
  const [email, setEmail] = useState('');
  const router = useRouter();

  function handleChange (event) {
    setEmail(event.target.value);
  }

  function handleSubmit (event) {
    event.preventDefault();
    router.push(`/setup?email=${email}`);
  }

  return (
    <>
      <h3>To get started please fill in your email:</h3>
      <form onSubmit={handleSubmit}>
        <input type='email' value={email} onChange={handleChange}></input>
        <button type='submit'>Get started</button>
      </form>
    </>
  );
}
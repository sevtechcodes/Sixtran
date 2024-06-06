'use client';

import { useState } from "react";

export default function LoginForm () {
  
  const [email, setEmail] = useState('');

  function handleChange (event) {
    setEmail(event.target.value)
  }

  function handleSubmit (event) {
    event.preventDefault()
    console.log(email);
  }

  return (
    <>
      <h3>To get started please fill in your email:</h3>
      <form onSubmit={handleSubmit}>
        <input type='email' value={email} onChange={handleChange}></input>
        <button type='submit'>Get started</button>
      </form>
    </>
  )
}
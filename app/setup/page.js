'use client';

import { useRouter } from 'next/navigation';

export default function Page () {
  const router = useRouter();
  const email = router.query;
  // check if email exists in db


  return (
    <>
      <div>
        <button>Use existing credentials</button>
      </div>

      <div>
        <h3>Update credentials</h3>
        <form>
          <input type='text' placeholder="New API Key"></input>
          <input type='text' placeholder="New API Secret"></input>
          <button type='submit'>Submit</button>
        </form>

      </div>
    </>
  );
}
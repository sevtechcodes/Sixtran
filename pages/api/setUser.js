import { serialize } from 'cookie';

export default function handler (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, fivetranApiKey, fivetranApiSecret } = req.body;


  res.setHeader('Set-Cookie', [
    serialize('user', {email, fivetranApiKey, fivetranApiSecret}, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7
    })
  ]);

  res.status(200).json({ message: 'User information saved' });
}

import { Inter } from 'next/font/google';
import { CookiesProvider } from 'next-client-cookies/server';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sixtran',
  description: 'Make Fivetran easier and cheaper.',
};

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider className={inter.className}>{children}</CookiesProvider>
      </body>
    </html>
  );
}

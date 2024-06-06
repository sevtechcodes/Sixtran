import { Inter } from 'next/font/google';
import { ApolloWrapper } from './ApolloWrapper';

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
        <ApolloWrapper className={inter.className}>{children}</ApolloWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { AuthContextProvider, ChakraContextProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VerdeApp',
  description: 'The chat application in the greenest way possible',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ChakraContextProvider>{children}</ChakraContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}

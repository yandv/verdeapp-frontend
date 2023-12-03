// app/providers.tsx
'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

import { useState } from 'react';

export function ChakraContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}

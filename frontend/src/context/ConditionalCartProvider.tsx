import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { CartProvider } from './CartContext';

interface ConditionalCartProviderProps {
  children: ReactNode;
}

export const ConditionalCartProvider: React.FC<ConditionalCartProviderProps> = ({ children }) => {
  const router = useRouter();
  // During SSR/SSG, always wrap with CartProvider to prevent context errors
  if (typeof window === 'undefined') {
    return <CartProvider>{children}</CartProvider>;
  }
  const isAdminPage = router.pathname.startsWith('/admin');
  if (isAdminPage) {
    return <>{children}</>;
  }
  return <CartProvider>{children}</CartProvider>;
};

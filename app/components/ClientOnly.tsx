'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly wrapper component
 * 
 * Prevents hydration mismatches caused by browser extensions
 * (like crypto wallets) that inject styles into the DOM.
 * 
 * Children are only rendered after the component mounts on the client,
 * avoiding server/client HTML mismatches.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
}

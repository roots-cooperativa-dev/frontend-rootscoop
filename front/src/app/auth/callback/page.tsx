// src/app/auth/callback/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token) {
      console.log(token, userId)
      // Redirige a la página principal o dashboard
      router.push('/');
    }
  }, [searchParams, router]);

  return <p>Procesando autenticación...</p>;
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/src/context/authContext';
import { getUserById } from '@/src/services/auth';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { saveUserData } = useAuthContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const accessToken = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (accessToken && userId) {
      hasRun.current = true;

      const fetchUserData = async () => {
        try {
          const data = await getUserById(userId, accessToken);
          
          saveUserData({
            user: { id: userId, name: data.name, email: data.email },
            accessToken: accessToken,
            isAuth: true,
          });

          router.push('/');
        } catch (error) {
          console.error("Error al obtener datos adicionales del usuario:", error);
        }
      };

      fetchUserData();
    }
  }, [searchParams, router, saveUserData]);

  return <p>Procesando autenticación...</p>;
}

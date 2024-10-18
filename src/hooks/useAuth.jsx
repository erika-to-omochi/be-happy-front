'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
}

export default useAuth;

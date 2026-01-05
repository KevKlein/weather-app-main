import { useEffect, useMemo } from 'react';
import { defaultUnits } from '../constants';


function useVerifyToken(setUserInfo) {
    const noUser = useMemo(() => ({
        username: null,
        favorites: [],
        units: defaultUnits
    }), []);
    console.log('noUser: ', noUser);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('token');
        setUserInfo(noUser);
        return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:4004/api/auth/verify', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          // remove invalid token
          localStorage.removeItem('token');
          setUserInfo(noUser);
          return;
        }

        const data = await res.json();
        if (data && data.valid) {
          setUserInfo(data.user ?? noUser);
        } else {
          setUserInfo(noUser);
          localStorage.removeItem('token');
        }
      } catch (err) {
        if (err.name === 'AbortError') return; // normal on unmount
        console.error('Token verification failed:', err);
        setUserInfo(noUser);
      }
    })();

    return () => controller.abort();
  }, [setUserInfo]);
}

export default useVerifyToken;

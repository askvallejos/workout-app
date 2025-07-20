import { useEffect, useRef } from 'react';

export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = async (): Promise<void> => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (error) {
      console.warn('Wake Lock failed:', error);
    }
  };

  const releaseWakeLock = async (): Promise<void> => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (error) {
      console.warn('Wake Lock release failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return { requestWakeLock, releaseWakeLock };
};
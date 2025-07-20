import { useState, useEffect, useCallback } from 'react';
import { playBeep } from '../utils/sound';
import { useWakeLock } from './useWakeLock';

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  startTimer: (duration: number) => void;
  stopTimer: () => void;
  addTime: (seconds: number) => void;
  progress: number;
}

export const useTimer = (): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const startTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    setTotalTime(duration);
    setIsRunning(true);
    requestWakeLock();
  }, [requestWakeLock]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalTime(0);
    releaseWakeLock();
  }, [releaseWakeLock]);

  const addTime = useCallback((seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
    setTotalTime(prev => prev + seconds);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            releaseWakeLock();
            playBeep();
            
            // Send notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Rest time finished!', {
                body: 'Ready for your next set',
                icon: '/vite.svg'
              });
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, releaseWakeLock]);

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    addTime,
    progress
  };
};
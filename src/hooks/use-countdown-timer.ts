"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useCountdownTimer({
  initialSeconds,
  autoStart = true,
  onExpire,
}: {
  initialSeconds: number;
  autoStart?: boolean;
  onExpire?: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onExpire]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(
    (newSeconds?: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
      setSecondsLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
    },
    [initialSeconds]
  );

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
  };
}


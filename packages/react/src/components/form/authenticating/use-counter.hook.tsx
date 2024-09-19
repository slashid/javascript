import { useState, useEffect } from "react";

export const TIME_MS = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
};

export type Props = {
  timeoutMs: number;
  tickMs: number;
};

export function useCounter({ timeoutMs, tickMs }: Props) {
  const [remainingTime, setRemainingTime] = useState(timeoutMs);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - tickMs;
        return newTime > 0 ? newTime : 0;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [timeoutMs, tickMs]);

  return remainingTime;
}

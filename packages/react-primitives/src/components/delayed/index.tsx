import { useState, useEffect, type ReactNode } from "react";

type Props = {
  delayMs: number;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Delayed({ delayMs, children, fallback }: Props) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return <>{render ? children : fallback ?? null}</>;
}

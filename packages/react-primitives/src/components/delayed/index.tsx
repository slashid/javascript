import { useState, useEffect, type ReactNode } from "react";

type Props = {
  /** Period of time, after which the component will render its children */
  delayMs: number;
  children: ReactNode;
  /** Optional fallback component rendered initially, replaced by children after the delay */
  fallback?: ReactNode;
  /** Optional CSS class name for the wrapper */
  className?: string;
};

/**
 * Utility component used to render its children after specified period of time
 */
export function Delayed({ delayMs, children, fallback, className }: Props) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return (
    <div className={className}>{render ? children : fallback ?? null}</div>
  );
}

import { useCallback, type ReactNode } from "react";
import { TIME_MS, useCounter } from "../../hooks";

type Props = {
  /** Period of time, after which the component will render its children */
  delayMs: number;
  children: ReactNode;
  /** Optional fallback component rendered initially, replaced by children after the delay */
  fallback?:
    | ReactNode
    | (({ secondsRemaining }: { secondsRemaining: number }) => ReactNode);
  /** Optional CSS class name for the wrapper */
  className?: string;
};

/**
 * Utility component used to render its children after specified period of time
 */
export function Delayed({ delayMs, children, fallback, className }: Props) {
  const counter = useCounter({ timeoutMs: delayMs, tickMs: TIME_MS.second });
  const secondsRemaining = Math.ceil(counter / TIME_MS.second);
  const render = secondsRemaining < 1;

  const renderFallback = useCallback(() => {
    if (!fallback) return null;

    if (typeof fallback === "function") {
      return fallback({ secondsRemaining });
    }

    return fallback;
  }, [fallback, secondsRemaining]);

  return (
    <div className={className}>{render ? children : renderFallback()}</div>
  );
}

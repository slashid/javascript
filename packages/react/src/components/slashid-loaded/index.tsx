import { ReactNode } from "react";
import { useSlashID } from "../../hooks/use-slash-id";

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Conditional rendering helper
 *
 * Acts as a guard for SlashID core SDK dependent operations. Can optionally render a fallback component while the SDK is loading.
 */
export const SlashIDLoaded = ({ fallback, children }: Props) => {
  const { isLoading } = useSlashID();

  if (isLoading) {
    if (!fallback) return null;

    return <>{fallback};</>;
  }

  return <>{children}</>;
};

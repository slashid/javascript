import { ComponentProps } from "react";
import { Button } from "../button";

type Props = {
  variant: ComponentProps<typeof Button>["variant"];
  label: string;
  hasError: boolean;
  isActive: boolean;
  loading: boolean;
  onClick: () => void;
  className?: string;
};

export const ActionButton = ({
  variant,
  label,
  hasError,
  isActive,
  loading,
  onClick,
  className,
}: Props) => (
  <Button
    className={className}
    variant={variant}
    loading={loading && isActive}
    disabled={loading && !isActive}
    onClick={onClick}
  >
    {hasError && isActive ? "Try again" : label}
  </Button>
);

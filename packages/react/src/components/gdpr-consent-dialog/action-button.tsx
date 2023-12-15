import { ComponentProps } from "react";
import { Button } from "@slashid/react-primitives";

type Props = {
  variant: ComponentProps<typeof Button>["variant"];
  label: string;
  hasError: boolean;
  isActive: boolean;
  loading: boolean;
  onClick: () => void;
  testId?: ComponentProps<typeof Button>["testId"];
  className?: string;
};

export const ActionButton = ({
  testId,
  variant,
  label,
  hasError,
  isActive,
  loading,
  onClick,
  className,
}: Props) => (
  <Button
    testId={testId}
    className={className}
    variant={variant}
    loading={loading && isActive}
    disabled={loading && !isActive}
    onClick={onClick}
  >
    {hasError && isActive ? "Try again" : label}
  </Button>
);

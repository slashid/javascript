import { ReactNode } from "react";
import { clsx } from "clsx";
import * as styles from "./button.css";

type Props = {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
};

export const Button: React.FC<Props> = ({
  children,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={clsx("sid-button", styles.button, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

import { clsx } from "clsx";
import * as styles from "./spinner.css";
import { ReactNode } from "react";
import BlueBackground from "./bg-blue.svg";
import RedBackground from "./bg-red.svg";

type Variant = "blue" | "red";

type Props = {
  className?: string;
  variant?: Variant;
  children: ReactNode;
};

const BACKGROUND_MAP: Record<Variant, string> = {
  blue: BlueBackground,
  red: RedBackground,
};

export const Circle: React.FC<Props> = ({
  children,
  className,
  variant = "blue",
}) => (
  <div
    className={clsx(styles.background, className)}
    style={{
      backgroundImage: `url(${BACKGROUND_MAP[variant]})`,
    }}
  >
    {children}
  </div>
);

import { clsx } from "clsx";
import { ReactNode } from "react";
import * as styles from "./circle.css";

type Variant = "blue" | "red";

type Props = {
  className?: string;
  variant?: Variant;
  children: ReactNode;
};

export const Circle: React.FC<Props> = ({
  children,
  className,
  variant = "blue",
}) => (
  <div className={clsx(styles.background, className)}>
    <div className={styles.outerCircleVariants[variant]} />
    <div className={styles.middleCircleVariants[variant]} />
    <div className={styles.innerCircleVariants[variant]} />
    <div className={styles.content}>{children}</div>
  </div>
);

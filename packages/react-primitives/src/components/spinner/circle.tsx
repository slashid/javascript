import { clsx } from "clsx";
import { ReactNode } from "react";
import * as styles from "./circle.css";

type Variant = "blue" | "red" | "primary";

type Props = {
  className?: string;
  variant?: Variant;
  shouldAnimate?: boolean;
  children: ReactNode;
};

export const Circle: React.FC<Props> = ({
  children,
  className,
  variant = "blue",
  shouldAnimate = true,
}) => (
  <div className={clsx(styles.background, className)}>
    <div
      className={clsx(styles.outerCircleVariants[variant], {
        [styles.outerCircleWithAnimation]: shouldAnimate,
      })}
    />
    <div
      className={clsx(styles.middleCircleVariants[variant], {
        [styles.middleCircleWithAnimation]: shouldAnimate,
      })}
    />
    <div
      className={clsx(styles.innerCircleVariants[variant], {
        [styles.innerCircleWithAnimation]: shouldAnimate,
      })}
    />
    <div className={styles.content}>{children}</div>
  </div>
);

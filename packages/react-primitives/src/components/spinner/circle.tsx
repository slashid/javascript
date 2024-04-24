import { clsx } from "clsx";
import { ReactNode } from "react";
import * as styles from "./circle.css";

type Variant = "blue" | "red" | "primary";

type Props = {
  className?: string;
  variant?: Variant;
  shouldAnimate?: boolean;
  children: ReactNode;
  testId?: string;
};

export const Circle: React.FC<Props> = ({
  children,
  className,
  variant = "blue",
  shouldAnimate = true,
  testId,
}) => (
  <div className={clsx(styles.background, className)} data-testid={testId}>
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

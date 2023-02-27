import * as styles from "./stack.css";
import { clsx } from "clsx";
import { sprinkles, Sprinkles } from "../../theme/sprinkles.css";
import { CSSProperties } from "react";

type Props = {
  variant?: styles.StackVariants;
  space?: Sprinkles["gap"];
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

export const Stack = (props: Props) => (
  <div
    className={clsx(
      "sid-stack",
      styles.stack(props.variant),
      sprinkles({ gap: props.space || "2" }),
      props.className
    )}
    style={props.style}
  >
    {props.children}
  </div>
);

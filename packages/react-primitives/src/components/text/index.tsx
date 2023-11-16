import { clsx } from "clsx";
import * as styles from "./text.css";

export type TextKeys = Record<string, string>;

export type TextVariants = styles.TextVariants;

type Props<Keys extends TextKeys> = {
  t: keyof Keys;
  children?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: styles.TextVariants;
  className?: string;
};

/**
 * Given a record of text keys, returns a component that renders the text based on the key.
 * Can be wrapped in a higher order component to provide the text keys.
 */
export function Text<Keys extends TextKeys>({
  t,
  as,
  variant,
  className,
  children,
  text,
}: Props<Keys> & { text: Keys }) {
  const Component = as ? as : "p";

  return (
    <Component
      className={clsx(
        "sid-text",
        `sid-text--${as}`,
        styles.text(variant),
        className
      )}
    >
      {text[t]}
      {children ? children : null}
    </Component>
  );
}

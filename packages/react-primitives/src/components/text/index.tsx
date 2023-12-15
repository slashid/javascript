import { clsx } from "clsx";
import * as styles from "./text.css";
import { useText } from "./use-text";
import { TextConfig } from "./types";

export type Props<TC extends TextConfig> = {
  t: keyof TC;
  children?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: styles.TextVariants;
  className?: string;
};

type InternalProps = Props<TextConfig>;

/**
 * Basic text component, used to display text in the application.
 * In order to get type safe text, you need to provide a TextConfig type.
 * The intent is that the actual text keys & values are provided by the consuming application.
 * Check the <Text> component in the @slashid/react package for more information.
 */
export const Text: React.FC<InternalProps> = ({
  as,
  t,
  variant,
  className,
  children,
}) => {
  const text = useText();
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
};

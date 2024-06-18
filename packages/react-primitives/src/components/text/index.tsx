import { clsx } from "clsx";
import * as styles from "./text.css";
import { useText } from "./use-text";
import { TextConfig } from "./types";
import { interpolate } from "./interpolation";

export type Props<TC extends TextConfig> = {
  t: keyof TC;
  children?: React.ReactNode;
  tokens?: Record<string, string>;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: styles.TextVariants;
  className?: string;
};

type InternalProps = Props<TextConfig>;

/**
 * Basic text component, used to display text in the application.
 * In order to get type safe text, you need to provide a TextConfig type.
 * Text will be interpolated - i.e. any {{key}} will be replaced with the value that matches the key in the provided tokens prop.
 *
 * The intent is that the actual text keys & values are provided by the consuming application.
 *
 * @example
 * Check the <Text> component in the @slashid/react package for more information.
 */
export const Text: React.FC<InternalProps> = ({
  as,
  t,
  tokens,
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
        `sid-text--${Component}`,
        styles.text(variant),
        className
      )}
    >
      {tokens ? interpolate(text[t], tokens) : text[t]}
      {children ? children : null}
    </Component>
  );
};

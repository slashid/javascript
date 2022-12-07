import { clsx } from "clsx";
import { useConfiguration } from "../../hooks/use-configuration";
import { TextConfigKey } from "./constants";
import * as styles from "./text.css";

type Props = {
  t: TextConfigKey;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: styles.TextVariants;
  className?: string;
};

export const Text: React.FC<Props> = ({ as, t, variant, className }) => {
  const { text } = useConfiguration();
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
    </Component>
  );
};

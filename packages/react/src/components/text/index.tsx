import { useConfiguration } from "../../hooks/use-configuration";
import { TextConfigKey } from "./constants";
import * as styles from "./text.css";

type Props = {
  t: TextConfigKey;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: styles.TextVariants;
};

export const Text: React.FC<Props> = ({ as, t, variant }) => {
  const { text } = useConfiguration();
  const Component = as ? as : "p";

  return <Component className={styles.text(variant)}>{text[t]}</Component>;
};

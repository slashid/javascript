import { Text } from "../text";
import * as styles from "./footer.css";

export const Footer = () => {
  return (
    <Text
      className={styles.footer}
      t="footer.branding"
      variant={{ size: "xs", weight: "semibold" }}
    />
  );
};

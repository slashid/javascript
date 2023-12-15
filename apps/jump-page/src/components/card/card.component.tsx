import { useAppContext } from "../app/app.context";
import { Text } from "../text";
import * as styles from "./card.css";

export type Props = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};

function DefaultHeader() {
  const { logo } = useAppContext();

  return <div className={styles.logo}>{logo}</div>;
}

function DefaultFooter() {
  return (
    <Text
      t="footer.text"
      variant={{
        size: "xs",
        weight: "semibold",
        color: "placeholder",
      }}
    />
  );
}

export function Card({
  children,
  header = <DefaultHeader />,
  footer = <DefaultFooter />,
}: Props) {
  return (
    <article className={styles.card}>
      {header && <header className={styles.header}>{header}</header>}
      <div>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
}

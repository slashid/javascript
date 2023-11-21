import * as styles from "./card.css";

export type Props = {
  children: React.ReactNode;
};

export function Card({ children }: Props) {
  return <article className={styles.card}>{children}</article>;
}

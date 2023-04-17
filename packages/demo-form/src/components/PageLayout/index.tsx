import { ReactNode } from "react";

import styles from "./PageLayout.module.css";

type Props = {
  title: string;
  text: ReactNode;
  children?: ReactNode;
  docsUrl?: string;
};

export function PageLayout({ title, text, children, docsUrl }: Props) {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h1>{title}</h1>
        <p>{text}</p>
      </section>
      <section className={styles.section}>{children}</section>
      <footer className={styles.section}>
        {docsUrl ? (
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Read the docs
          </a>
        ) : null}
      </footer>
    </main>
  );
}

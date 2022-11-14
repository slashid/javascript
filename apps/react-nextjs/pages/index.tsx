import Head from "next/head";
import { SlashIDForm } from "../components/SlashIDForm";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>/id | Next.js</title>
        <meta name="description" content="/id Next.js demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className={styles.form}>
          <SlashIDForm />
        </div>

        <p className={styles.docs}>
          <a href="https://developer.slashid.dev/">Read the docs</a>
        </p>
      </main>
    </div>
  );
}

export default Home;

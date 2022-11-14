import { useSlashID } from "@slashid/react";
import Head from "next/head";
import { Profile } from "../components/Profile";
import { SlashIDForm } from "../components/SlashIDForm";
import styles from "../styles/Home.module.css";

function Home() {
  const { user } = useSlashID();

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

        {user ? (
          <Profile />
        ) : (
          <div className={styles.form}>
            <SlashIDForm />
          </div>
        )}

        <p className={styles.docs}>
          <a href="https://developer.slashid.dev/">Read the docs</a>
        </p>
      </main>
    </div>
  );
}

export default Home;

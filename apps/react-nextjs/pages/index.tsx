import Head from "next/head";
import Link from "next/link";
import styles from "./index.module.css";

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

        <h2>Explore the components:</h2>

        <p className={styles.docs}>
          <Link href="/form">{`<Form />`}</Link>
          <br />
          <Link href="/mfa">{`<MultiFactorAuth />`}</Link>
          <br />
          <Link href="/step-up-auth">{`<StepUpAuth />`}</Link>
        </p>

        <p className={styles.docs}>
          <a href="https://developer.slashid.dev/">Read the docs</a>
        </p>
      </main>
    </div>
  );
}

export default Home;

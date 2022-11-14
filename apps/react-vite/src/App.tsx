import { useSlashID } from "@slashid/react";
import { Profile, SlashIDForm } from "demo-form";
import styles from "./app.module.css";

function App() {
  const { user } = useSlashID();

  return (
    <div className="App">
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://vitejs.dev/">Vite!</a>
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

export default App;

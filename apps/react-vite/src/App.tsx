import { useSlashID, Groups } from "@slashid/react";
import { Profile, SlashIDForm } from "demo-form";
import { useCallback } from "react";
import styles from "./app.module.css";

function App() {
  const { user } = useSlashID();
  const isMemberOfGroupA = useCallback((groups: string[]) => {
    console.log({ groups });
    return groups.includes("groupa");
  }, []);

  return (
    <div className="App">
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://vitejs.dev/">Vite!</a>
        </h1>

        <Groups belongsTo={isMemberOfGroupA}>
          Only renders if member of groupa
        </Groups>

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

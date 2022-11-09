import { useSlashID } from "@slashid/react";
import { useCallback } from "react";
import "./App.css";

function App() {
  const { user, logIn, logOut } = useSlashID();

  const handleClick = useCallback(async () => {
    if (user) {
      await logOut();
    } else {
      await logIn({
        handle: {
          type: import.meta.env.VITE_IDENTIFIER_TYPE,
          value: import.meta.env.VITE_IDENTIFIER_VALUE,
        },
        factor: { method: import.meta.env.VITE_AUTH_METHOD },
      });
    }
  }, [logIn, logOut, user]);

  return (
    <div className="App">
      <h1>/id React SDK</h1>
      <div className="card">
        <button onClick={handleClick}>{user ? "Log out" : "Log in"}</button>
        <p>
          <code>{user && user.token}</code>
        </p>
      </div>
      <p className="read-the-docs">
        <a href="https://developer.slashid.dev/">Read the docs</a>
      </p>
    </div>
  );
}

export default App;

import { useSlashID } from "@slashid/react";
import "./App.css";

function App() {
  const { user, login } = useSlashID();

  return (
    <div className="App">
      <h1>/id React SDK</h1>
      <div className="card">
        <button
          onClick={() =>
            login({
              factor: {
                type: import.meta.env.VITE_IDENTIFIER_TYPE,
                value: import.meta.env.VITE_IDENTIFIER_VALUE,
              },
              options: { method: import.meta.env.VITE_AUTH_METHOD },
            })
          }
        >
          Log in
        </button>
        <p>
          <code>{user && user.token}</code>
        </p>
      </div>
      <p className="read-the-docs">TODO /id Developer Docs link here</p>
    </div>
  );
}

export default App;

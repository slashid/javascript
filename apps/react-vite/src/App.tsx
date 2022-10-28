import { useSlashID } from "@slashid/react";
import "./App.css";

function App() {
  const { user, logIn } = useSlashID();

  return (
    <div className="App">
      <h1>/id React SDK</h1>
      <div className="card">
        <button
          onClick={() =>
            logIn({
              handle: {
                type: import.meta.env.VITE_IDENTIFIER_TYPE,
                value: import.meta.env.VITE_IDENTIFIER_VALUE,
              },
              factor: { method: import.meta.env.VITE_AUTH_METHOD },
            })
          }
        >
          Log in
        </button>
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

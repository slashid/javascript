import { type MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import {
  useSlashID,
  LoggedIn,
  LoggedOut
} from "@slashid/remix";
import { useCallback } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { logOut, isAuthenticated } = useSlashID();
  const navigate = useNavigate()

  const login = useCallback(() => {
    navigate("/login")
  }, [])

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        background: "grey",
      }}
    >
      <h1>Welcome to Remix</h1>
      <LoggedIn>
        You are logged in
        <button onClick={logOut}>Log out</button>
      </LoggedIn>
      <LoggedOut>
        You are logged out
        <button onClick={login}>
          Log in
        </button>
      </LoggedOut>
      <br />
      <br />
      <h2>
        Navigation
      </h2>
      <ul>
        <li>
          <Link to="/protected">
            Protected page {isAuthenticated ? "" : "(requires login)"}
          </Link>
        </li>
        <li>
          <Link to="/public">Public page</Link>
        </li>
      </ul>
    </div>
  );
}

import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ConfigurationProvider, Form, LoggedIn, LoggedOut, type Factor, useSlashID } from "@slashid/remix";
import "@slashid/react/style.css"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const factors: Factor[] = [{ method: "email_link" }];

export default function Index() {
  const { logOut } = useSlashID()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", background: "grey" }}>
      <h1>Welcome to Remix</h1>
      <LoggedIn>
        You are logged in
        <button onClick={logOut}>
          Log out
        </button>
      </LoggedIn>
      <LoggedOut>
        You are logged out
        <div style={{ width: "500px" }}>
          <ConfigurationProvider factors={factors}>
            <Form />
          </ConfigurationProvider>
        </div>
      </LoggedOut>
      <ul>
        <li>
          <Link
            to="/secure"
          >
            Secure page
          </Link>
        </li>
        <li>
        <Link
            to="/insecure"
          >
            Insecure page
          </Link>
        </li>
      </ul>
    </div>
  );
}

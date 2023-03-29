import type { LinksFunction } from "@remix-run/node";
import { LoggedOut, LoggedIn, Form, useSlashID } from "@slashid/react";

import slashIDstyles from "@slashid/react/style.css";
import profileStyles from "demo-form/style.css";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slashIDstyles },
  { rel: "stylesheet", href: profileStyles },
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useSlashID();

  useEffect(() => {
    if (user) {
      navigate("./profile");
    }
  }, [user]);

  return (
    <div className="index">
      <LoggedOut>
        <div className="formWrapper">
          <Form />
        </div>
      </LoggedOut>
    </div>
  );
}

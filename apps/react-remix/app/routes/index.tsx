import type { LinksFunction } from "@remix-run/node";
import { LoggedOut, LoggedIn, Form } from "@slashid/react";
import { Storage } from '~/storage';

import slashIDstyles from "@slashid/react/style.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slashIDstyles },
];

export default function Index() {
  return (
    <div className="index">
      <LoggedOut>
        <div className="formWrapper">
          <Form />
        </div>
      </LoggedOut>
      <LoggedIn>
        <Storage />
      </LoggedIn>
    </div>
  );
}

import type { LinksFunction } from "@remix-run/node";
import { Form, GDPRConsentDialog, LoggedIn, LoggedOut } from "@slashid/react";
import { Profile } from "demo-form";

import slashIDstyles from "@slashid/react/style.css";
import profileStyles from "demo-form/style.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slashIDstyles },
  { rel: "stylesheet", href: profileStyles },
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
        <Profile />
      </LoggedIn>
      <GDPRConsentDialog />
    </div>
  );
}

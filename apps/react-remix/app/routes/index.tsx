import { Form, GDPRConsentDialog, LoggedIn, LoggedOut } from "@slashid/react";
import { Profile } from "demo-form";

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

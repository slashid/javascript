import { Button } from "../button";
import { LinkButton } from "../button/link-button";
import { Text } from "../text";
import { Google } from "../icon/google";
import { InitialState } from "./flow";
import { GB_FLAG, Input, PhoneInput } from "../input";
import { useState } from "react";
import { Flag } from "country-list-with-dial-code-and-flag/dist/types";

type Props = {
  flowState: InitialState;
};

export const Initial: React.FC<Props> = ({ flowState }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flag, setFlag] = useState<Flag>(GB_FLAG);

  return (
    <form
      data-testid="sid-form-initial-state"
      onSubmit={(e) => {
        e.preventDefault();
        flowState.logIn({
          factor: {
            method: "email_link",
          },
          handle: { type: "email_address", value: "ivan@slashid.dev" },
        });
      }}
    >
      <Text as="h1" t="initial.title" />
      <button data-testid="sid-form-initial-submit-button" type="submit">
        Log in
      </button>
      <Button className="custom-css" onClick={() => console.log("click")}>
        Primary
      </Button>
      <Button variant="secondary" onClick={() => console.log("click")}>
        Secondary
      </Button>
      <Button
        icon={<Google />}
        variant="secondary"
        onClick={() => console.log("click")}
      >
        Sign in with Google
      </Button>
      <LinkButton onClick={() => console.log("click")}>Link button</LinkButton>
      <Input
        id="test"
        name="test"
        label="Test input"
        placeholder="Write something"
        value={email}
        onChange={(value) => setEmail(value)}
      />
      <PhoneInput
        id="phone"
        name="phone"
        label="Phone input"
        placeholder="Write something"
        value={phone}
        onChange={(value) => setPhone(value)}
        flag={flag}
        onFlagChange={setFlag}
      />
    </form>
  );
};

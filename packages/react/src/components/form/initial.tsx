import { Button } from "../button";
import { LinkButton } from "../button/link-button";
import { Text } from "../text";
import { Google } from "../icon/google";
import { InitialState } from "./flow";

type Props = {
  flowState: InitialState;
};

export const Initial: React.FC<Props> = ({ flowState }) => {
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
    </form>
  );
};

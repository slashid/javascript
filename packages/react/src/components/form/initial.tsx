import { Button } from "../button";
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
      <h1>initial form</h1>
      <button data-testid="sid-form-initial-submit-button" type="submit">
        Log in
      </button>
      <Button className="custom-css" onClick={() => console.log("click")}>
        Delete me
      </Button>
    </form>
  );
};

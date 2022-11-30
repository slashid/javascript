import { styles } from "./form.css";
import { themeClass } from "../../theme/theme.css";
import { useFlowState } from "./useFlowState";

export const Form = () => {
  const flowState = useFlowState();

  return (
    <div className={themeClass}>
      <div className={styles.form}>Form</div>
      <p>Flow state: {flowState.status}</p>
      {flowState.status === "initial" ? (
        <form>
          <h1>initial form</h1>
          <button
            onClick={() =>
              flowState.logIn({
                factor: {
                  method: "email_link",
                },
                handle: { type: "email_address", value: "ivan@slashid.dev" },
              })
            }
          >
            Log in
          </button>
        </form>
      ) : null}
    </div>
  );
};

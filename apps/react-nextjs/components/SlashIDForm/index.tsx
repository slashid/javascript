import { useEffect, useReducer } from "react";
import { initialState, reducer } from "./state";
import css from "./slashidform.module.css";
import { IdentifierDropdown } from "./IdentifierDropdown";
import { HandleInput } from "./HandleInput";
import { AuthMethodDropdown } from "./AuthMethodDropdown";
import Button from "../Button";
import { useSlashID } from "@slashid/react";
import { PersonHandleType } from "@slashid/slashid";
import Logo from "../Icons/Logo";

export const SlashIDForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { logIn } = useSlashID();

  useEffect(() => {
    const performAuth = async () => {
      const handle = {
        type: state.handleType as unknown as PersonHandleType,
        value: state.handleValue,
      };
      const factor = {
        method: state.authMethod!,
      };
      try {
        await logIn({
          handle,
          factor,
        });
        dispatch({ type: "COMPLETE_AUTH" });
      } catch (e) {
        dispatch({ type: "FAIL_AUTH" });
      }
    };

    if (state.status === "AUTHENTICATING") {
      performAuth();
    }
  }, [
    logIn,
    state.authMethod,
    state.handleType,
    state.handleValue,
    state.status,
  ]);

  return (
    <div className={css.host}>
      <div className={css.content}>
        <div className={css.header}>
          <i className={css.logo}>
            <Logo />
          </i>
        </div>

        {state.status === "INITIAL" && (
          <form
            className={css.form}
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: "START_AUTH" });
            }}
          >
            <IdentifierDropdown dispatch={dispatch} />
            <HandleInput dispatch={dispatch} handleType={state.handleType} />
            <AuthMethodDropdown
              dispatch={dispatch}
              authMethod={state.authMethod}
              handleType={state.handleType}
            />
            <div className={css.controls}>
              <Button
                htmlType="submit"
                label="Log in"
                isDisabled={!state.canSubmit}
              />
            </div>
          </form>
        )}

        {state.status === "AUTHENTICATING" && <div>Auth</div>}
      </div>
    </div>
  );
};

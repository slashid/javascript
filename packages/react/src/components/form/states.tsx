import clsx from "clsx";
import * as styles from "./form.css";
import { AuthenticatingProps, Authenticating as AuthenticatingState } from "./authenticating";

export const Authenticating = (props: AuthenticatingProps) => {
  return (
    <div className={clsx("sid-form", styles.form)}>
      <AuthenticatingState flowState={props.flowState} />
    </div>
  )
}
import clsx from "clsx";
import * as styles from "./form.css";
import { AuthenticatingProps, Authenticating as AuthenticatingState } from "./authenticating";
import { ConfigurationProvider } from "../../context/config-context";

export const Authenticating = (props: AuthenticatingProps) => {
  return (
    <div className={clsx("sid-form", styles.form)}>
      <ConfigurationProvider>
        <AuthenticatingState flowState={props.flowState} />
      </ConfigurationProvider>
    </div>
  )
}
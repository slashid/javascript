/**
 * This module contains standalone exports for individual states of the React form i.e.
 * error, authenticating, success, etc.
 *
 * The use case is for rendering these states elsewhere - building a WYSIWYG customisation
 * editor, for example - without needing to interact with the form state in the regular way.
 */

import clsx from "clsx";
import * as styles from "./form.css";
import {
  AuthenticatingImplementation,
  AuthenticatingProps,
} from "./authenticating";

export const Authenticating = (props: AuthenticatingProps) => {
  return (
    <div className={clsx("sid-form", styles.form)}>
      <AuthenticatingImplementation flowState={props.flowState} />
    </div>
  );
};

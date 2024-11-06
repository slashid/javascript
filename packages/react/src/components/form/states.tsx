/**
 * This module contains standalone exports for individual states of the React form i.e.
 * error, authenticating, success, etc.
 *
 * The use case is for rendering these states elsewhere - building a WYSIWYG customisation
 * editor, for example - without needing to interact with the form state in the regular way.
 */

import {
  AuthenticatingImplementation,
  AuthenticatingProps,
} from "./authenticating";
import { Card } from "@slashid/react-primitives";

export const Authenticating = (props: AuthenticatingProps) => {
  return (
    <Card className="sid-form">
      <AuthenticatingImplementation flowState={props.flowState} />
    </Card>
  );
};

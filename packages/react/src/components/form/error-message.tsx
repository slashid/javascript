import { ValidationError } from "../../domain/types";
import * as styles from "./error-message.css";

type ErrorMessageProps = {
  error: ValidationError;
};

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <span data-testid="sid-form-error-message" className={styles.errorMessage}>
      {error.message}
    </span>
  );
};

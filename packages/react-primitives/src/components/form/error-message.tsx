import { useForm } from "../../hooks/use-form";
import * as styles from "./error-message.css";

type ErrorMessageProps = {
  name: string;
};

export const ErrorMessage = ({ name }: ErrorMessageProps) => {
  const { errors } = useForm();
  const error = errors[name]

  if (!error) {
    return null
  }

  return (
    <span data-testid="sid-form-error-message" className={styles.errorMessage}>
      {error.message}
    </span>
  );
};

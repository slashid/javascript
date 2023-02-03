import { ValidationError } from "../../domain/types";

type ErrorMessageProps = {
  error: ValidationError;
};

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return <div>{error.message}</div>;
};

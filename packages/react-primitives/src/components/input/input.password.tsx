import { BaseInput, BaseInputProps } from "./input.base";

export type PasswordInputProps = Omit<BaseInputProps, "type">;

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  // TODO add the eye icon to toggle between show password and hide password states
  // TODO add the error prop to show the error state (red border)
  return <BaseInput {...props} type={"password"} />;
};

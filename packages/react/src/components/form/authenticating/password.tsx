import { Props } from "./authenticating.types";

// special case handling for password fields
export const PasswordState = (props: Props) => {
  console.log({ props });
  return <div>password</div>;
};

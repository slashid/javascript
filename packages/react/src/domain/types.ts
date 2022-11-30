import { Factor, User } from "@slashid/slashid";

export interface Handle {
  type: "email_address" | "phone_number";
  value: string;
}

export interface LoginOptions {
  handle: Handle;
  factor: Factor;
}

export type LogIn = (options: LoginOptions) => Promise<User | undefined>;
export type Retry = () => void;

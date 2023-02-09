import { Factor, User } from "@slashid/slashid";

export type HandleType = "email_address" | "phone_number";

export interface Handle {
  type: HandleType;
  value: string;
}

export interface LoginOptions {
  handle?: Handle;
  factor: Factor;
}

export type FactorOIDC = Extract<Factor, { method: "oidc" }>;

export function isFactorOidc(factor: Factor): factor is FactorOIDC {
  return factor.method === "oidc";
}

export type LogIn = (options: LoginOptions) => Promise<User | undefined>;
export type Retry = () => void;
export type Cancel = () => void;

export type ValidationError = {
  message: string;
};

export type Validator<T = unknown> = (value: T) => ValidationError | undefined;

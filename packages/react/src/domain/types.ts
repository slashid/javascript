import { Factor, SlashID, User } from "@slashid/slashid";

export type HandleType = "email_address" | "phone_number";

export interface Handle {
  type: HandleType;
  value: string;
}

export interface LoginConfiguration {
  handle?: Handle;
  factor: Factor;
}

interface LoginMiddlewareContext {
  user: User
  sid: SlashID
}

export type LoginMiddleware = (context: LoginMiddlewareContext) => Promise<User>

export interface LoginOptions {
  middleware?: LoginMiddleware | LoginMiddleware[]
}

export type FactorOIDC = Extract<Factor, { method: "oidc" }>;

export type LogIn = (config: LoginConfiguration, options?: LoginOptions) => Promise<User | undefined>;
export type MFA = (config: LoginConfiguration, options?: LoginOptions) => Promise<User | undefined>;
export type Retry = () => void;
export type Cancel = () => void;

export type ValidationError = {
  message: string;
};

export type Validator<T = unknown> = (value: T) => ValidationError | undefined;

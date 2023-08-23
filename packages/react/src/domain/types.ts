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

export interface LoginMiddlewareContext {
  user: User;
  sid: SlashID;
}

export type LoginMiddleware = (
  context: LoginMiddlewareContext
) => Promise<User>;

export interface LoginOptions {
  middleware?: LoginMiddleware | LoginMiddleware[];
}

export type FactorOIDC = Extract<Factor, { method: "oidc" }>;

export type FactorOTP = Extract<
  Factor,
  { method: "otp_via_email" } | { method: "otp_via_sms" }
>;

/**
 * This makes it possible to add a label to the configured OIDC factors.
 * This is useful when you want to change the default display (capitalized provider name).
 */
export type FactorLabeledOIDC = FactorOIDC & { label?: string };

/**
 * All factors that can be configured for usage in our UI components.
 */
export type FactorConfiguration =
  | Exclude<Factor, FactorOIDC>
  | FactorLabeledOIDC;

export type LogIn = (
  config: LoginConfiguration,
  options?: LoginOptions
) => Promise<User | undefined>;

export type MFA = (
  config: LoginConfiguration,
  options?: LoginOptions
) => Promise<User | undefined>;

export type Retry = () => void;
export type Cancel = () => void;

export type ValidationError = {
  message: string;
};

export type Validator<T = unknown> = (value: T) => ValidationError | undefined;

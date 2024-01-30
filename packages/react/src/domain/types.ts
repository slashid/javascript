import { Factor, RecoverableFactor, SlashID, User } from "@slashid/slashid";
import { ReactNode } from "react";

const handleTypes = ["email_address", "phone_number"] as const;
export type HandleType = (typeof handleTypes)[number];

export interface Handle {
  type: HandleType;
  value: string;
}

export const isHandle = (obj: unknown): obj is Handle => {
  if (!obj) return false;
  if (Array.isArray(obj)) return false;
  if (typeof obj !== "object") return false;

  const { type, value } = obj as Handle;
  if (!handleTypes.includes(type)) return false;

  return typeof value === "string";
};

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

export type FactorSAML = Extract<Factor, { method: "saml" }>;

export type FactorNonOIDC = Exclude<
  FactorConfiguration,
  FactorOIDC | FactorLabeledOIDC
>;
export type FactorSSO = FactorLabeledOIDC | FactorCustomizableSAML;

export type FactorPassword = Extract<Factor, { method: "password" }>;

export type FactorNonSSO = Exclude<FactorConfiguration, FactorSSO>;

export type FactorOTPEmail = Extract<Factor, { method: "otp_via_email" }>;

export type FactorOTPSms = Extract<Factor, { method: "otp_via_sms" }>;

export type FactorOTP = FactorOTPEmail | FactorOTPSms;

export type FactorEmailLink = Extract<Factor, { method: "email_link" }>;

export type FactorSmsLink = Extract<Factor, { method: "sms_link" }>;

/**
 * This makes it possible to add a label to the configured OIDC factors.
 * This is useful when you want to change the default display (capitalized provider name).
 */
export type FactorLabeledOIDC = FactorOIDC & { label?: string };

/**
 * SAML integration requires a label as we don't have a predefined list of providers.
 * You can also add a custom logo for a given provider.
 */
export type FactorCustomizableSAML = FactorSAML & {
  label?: string;
  logo?: string | ReactNode;
};

/**
 * All factors that can be configured for usage in our UI components.
 */
export type FactorConfiguration =
  | Exclude<Factor, FactorOIDC | FactorSAML>
  | FactorLabeledOIDC
  | FactorCustomizableSAML;

export type LogIn = (
  config: LoginConfiguration,
  options?: LoginOptions
) => Promise<User | undefined>;

export type MFA = (
  config: LoginConfiguration,
  options?: LoginOptions
) => Promise<User | undefined>;

export type Recover = (config: {
  handle: Handle;
  factor: RecoverableFactor;
}) => Promise<void>;

export type Retry = () => void;
export type Cancel = () => void;

export type ValidationError = {
  message: string;
};

export type Validator<T = unknown> = (value: T) => ValidationError | undefined;

export type MaybeArray<T> = T | T[];

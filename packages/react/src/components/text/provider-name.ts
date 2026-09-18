import { OAuthProvider } from "@slashid/slashid";
import { FactorCustomizableSAML, FactorLabeledOIDC } from "../../domain/types";
import { TEXT, TextConfig } from "./constants";

type ProviderTextKey = `provider.${OAuthProvider}` | "provider.saml";

// Fails to compile when the core SDK adds a provider without a default in TEXT.
TEXT satisfies Record<ProviderTextKey, string>;

export function getProviderTextKey(provider: OAuthProvider): ProviderTextKey {
  return `provider.${provider}`;
}

export function getProviderName(
  text: TextConfig,
  factor: FactorLabeledOIDC | FactorCustomizableSAML
): string {
  if (factor.label) return factor.label;

  if (factor.method === "saml") return text["provider.saml"];

  const provider = factor.options?.provider;
  if (!provider) return "";

  return text[getProviderTextKey(provider)] ?? provider;
}

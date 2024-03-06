import { DynamicFlow } from "./components/dynamic-flow";
import { Form } from "./components/form";
import { Slot } from "./components/slot";
import { GDPRConsentDialog } from "./components/gdpr-consent-dialog";
import { Groups } from "./components/groups";
import { LoggedIn } from "./components/logged-in";
import { LoggedOut } from "./components/logged-out";
import { MultiFactorAuth } from "./components/multi-factor-auth";
import { OrganizationSwitcher } from "./components/organization-switcher";
import { SlashIDLoaded } from "./components/slashid-loaded";
import { StepUpAuth } from "./components/step-up-auth";
import {
  ConfigurationContext,
  ConfigurationProvider,
} from "./context/config-context";
import {
  SlashIDContext,
  type ISlashIDContext,
  SlashIDProvider,
  SlashIDProviderProps,
} from "./context/slash-id-context";
import { useGDPRConsent } from "./hooks/use-gdpr-consent";
import { useOrganizations } from "./hooks/use-organizations";
import { useSlashID, type UseSlashID } from "./hooks/use-slash-id";
import {
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
} from "./middleware";
import { sanitiseCssVariableCustomisationConfig, type CssVariable, type CssVariableConfig } from "./utils/customisation";
import * as validation from "./utils/css-validation";

const customisation = {
  sanitiseCssVariableCustomisationConfig,
  ...validation
}

/**
 * TODO: think about code splitting
 */
export {
  ConfigurationContext,
  ConfigurationProvider,
  DynamicFlow,
  Form,
  GDPRConsentDialog,
  Groups,
  LoggedIn,
  LoggedOut,
  MultiFactorAuth,
  OrganizationSwitcher,
  Slot,
  type ISlashIDContext,
  SlashIDContext,
  SlashIDLoaded,
  SlashIDProvider,
  StepUpAuth,
  useGDPRConsent,
  useOrganizations,
  type UseSlashID,
  useSlashID,
  type CssVariable,
  type CssVariableConfig,
  customisation,

  // middleware
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
  type SlashIDProviderProps,
};

export { ServerThemeRoot } from "@slashid/react-primitives";

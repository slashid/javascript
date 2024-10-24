import { DynamicFlow } from "./components/dynamic-flow";
import {
  Onboarding,
  OnboardingProps,
  OnboardingStep,
  OnboardingStepProps,
  useOnboarding,
  OnboardingActions,
  OnboardingForm,
  OnboardingSuccess,
} from "./components/onboarding";
import { UncontrolledInput } from "@slashid/react-primitives";
import { Text } from "./components/text";
import { Authenticating, Form } from "./components/form";
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
import {
  sanitiseCssVariableCustomisationConfig,
  type CssVariable,
  type CssVariableConfig,
  getGoogleFontImports,
} from "./utils/customisation";
import * as validation from "./utils/css-validation";

import type { LoginConfiguration } from "./domain/types";

const Customisation = {
  sanitiseCssVariableCustomisationConfig,
  getGoogleFontImports,
  ...validation,
};

const FormState = {
  Authenticating,
};

/**
 * TODO: think about code splitting
 */
export {
  ConfigurationContext,
  ConfigurationProvider,
  DynamicFlow,
  // TODO remove - Unum demo
  Onboarding,
  type OnboardingProps,
  OnboardingStep,
  type OnboardingStepProps,
  useOnboarding,
  OnboardingActions,
  OnboardingForm,
  OnboardingSuccess,
  UncontrolledInput,
  Text,
  // end Unum demo
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
  Customisation,

  // raw states
  FormState,

  // middleware
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
  type SlashIDProviderProps,
  type LoginConfiguration,
};

export { ServerThemeRoot } from "@slashid/react-primitives";

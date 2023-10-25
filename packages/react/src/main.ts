import { DynamicFlow } from "./components/dynamic-flow";
import { Form, FormErrorState } from "./components/form";
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
import { SlashIDContext, SlashIDProvider } from "./context/slash-id-context";
import { useGDPRConsent } from "./hooks/use-gdpr-consent";
import { useOrganizations } from "./hooks/use-organizations";
import { useSlashID } from "./hooks/use-slash-id";
import {
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
} from "./middleware";

/**
 * TODO: think about code splitting
 */
export {
  ConfigurationContext,
  ConfigurationProvider,
  DynamicFlow,
  Form,
  FormErrorState,
  GDPRConsentDialog,
  Groups,
  LoggedIn,
  LoggedOut,
  MultiFactorAuth,
  OrganizationSwitcher,
  Slot,
  SlashIDContext,
  SlashIDLoaded,
  SlashIDProvider,
  StepUpAuth,
  useGDPRConsent,
  useOrganizations,
  useSlashID,

  // middleware
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
};

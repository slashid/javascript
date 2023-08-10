import { SlashIDContext, SlashIDProvider } from "./context/slash-id-context";
import {
  ConfigurationContext,
  ConfigurationProvider,
} from "./context/config-context";
import { LoggedIn } from "./components/logged-in";
import { LoggedOut } from "./components/logged-out";
import { Groups } from "./components/groups";
import { Form } from "./components/form";
import { MultiFactorAuth } from "./components/multi-factor-auth";
import { StepUpAuth } from "./components/step-up-auth";
import { SlashIDLoaded } from "./components/loaded";
import { useSlashID } from "./hooks/use-slash-id";
import { DynamicFlow } from "./components/dynamic-flow";
import { useOrganizations } from "./hooks/use-organizations";
import { OrganizationSwitcher } from './components/organization-switcher'

/**
 * TODO: think about code splitting
 */
export {
  SlashIDContext,
  SlashIDProvider,
  SlashIDLoaded,
  ConfigurationContext,
  ConfigurationProvider,
  LoggedIn,
  LoggedOut,
  Groups,
  Form,
  MultiFactorAuth,
  StepUpAuth,
  DynamicFlow,
  useSlashID,
  useOrganizations,
  OrganizationSwitcher
};

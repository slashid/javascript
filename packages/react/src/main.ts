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
import { useSlashID } from "./hooks/use-slash-id";

/**
 * TODO: think about code splitting
 */
export {
  SlashIDContext,
  SlashIDProvider,
  ConfigurationContext,
  ConfigurationProvider,
  LoggedIn,
  LoggedOut,
  Groups,
  Form,
  MultiFactorAuth,
  useSlashID,
};

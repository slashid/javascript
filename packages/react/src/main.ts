import { SlashIDContext, SlashIDProvider } from "./context/slash-id-context";
import {
  ConfigurationContext,
  ConfigurationProvider,
} from "./context/config-context";
import { LoggedIn } from "./components/logged-in";
import { LoggedOut } from "./components/logged-out";
import { Form } from "./components/form";
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
  Form,
  useSlashID,
};

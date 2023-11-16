import { ThemeRoot, ThemeProps } from "./components/theme-root";
import { Button } from "./components/button";
import { LinkButton } from "./components/button/link-button";
import { Input, PhoneInput, Flag } from "./components/input";
import { Divider } from "./components/divider";
import { Accordion } from "./components/accordion";
import { Dialog, DialogProps } from "./components/dialog";
import { Switch } from "./components/switch";
import { Spinner } from "./components/spinner/spinner";
import { Circle } from "./components/spinner/circle";

export {
  ThemeRoot,
  Button,
  LinkButton,
  Input,
  PhoneInput,
  Divider,
  Accordion,
  Dialog,
  Switch,
  Spinner,
  Circle,
};

export * from "./components/icon";

export type { ThemeProps, DialogProps, Flag };

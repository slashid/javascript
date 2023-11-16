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
import { Stack } from "./components/stack";
import { Banner } from "./components/banner";
import { Dropdown } from "./components/dropdown";
import { Tabs } from "./components/tabs";
import { Teleport } from "./components/teleport";
import { Text, Props as TextProps } from "./components/text";
import { TextContext, TextProvider } from "./components/text/text-context";

// components
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
  Stack,
  Banner,
  Dropdown,
  Tabs,
  Teleport,
  Text,
};

// context
export { TextContext, TextProvider };

// icons
export * from "./components/icon";

// types
export type { ThemeProps, DialogProps, TextProps, Flag };

import { createBentoProvider } from "@buildo/bento-design-system";
import "@buildo/bento-design-system/lib/index.css";
import "./theme.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import { config } from "./config";

export const DesignSystemProvider = createBentoProvider({
  ...config,
  navigation: {
    activeVisualElement: {
      lineColor: "brandPrimary",
      lineHeight: {
        medium: 2,
        large: 2,
      },
    },
  },
});

export {
  AreaLoader,
  Banner,
  Bleed,
  Body,
  Box,
  Button,
  ButtonLink,
  Card,
  CheckboxField,
  CheckboxGroupField,
  Chip,
  Column,
  Columns,
  ContentBlock,
  Display,
  Divider,
  Feedback,
  Field,
  FileUploaderField,
  Form,
  FormRow,
  FormSection,
  IconButton,
  Inline,
  InlineLoader,
  Inset,
  Headline,
  Menu,
  Modal,
  Navigation,
  NumberField,
  IconChevronLeft,
  IconClose,
  IconMinus,
  IconPlus,
  IconPositive,
  IconNegative,
  IllustrationDesktop,
  IllustrationSmartphone,
  ReadOnlyField,
  SelectField,
  Stack,
  Table,
  TextField,
  Title,
  tableColumn,
  unsafeLocalizedString,
  Tiles,
  TextArea,
} from "@buildo/bento-design-system";

export * from "./Icons";
export { Logo } from "./Logo/Logo";

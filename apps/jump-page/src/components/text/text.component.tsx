import { Text as BaseText, type TextProps } from "@slashid/react-primitives";
import type { TranslationKeys } from "../../domain/i18n";

type Props = TextProps<Record<TranslationKeys, string>>;

export const Text: React.FC<Props> = (props) => {
  return <BaseText {...props} />;
};

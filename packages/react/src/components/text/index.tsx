import { Text as BaseText, TextProps } from "@slashid/react-primitives";
import { TextConfig } from "./constants";

type Props = TextProps<TextConfig>;

export const Text: React.FC<Props> = (props) => {
  return <BaseText {...props} />;
};

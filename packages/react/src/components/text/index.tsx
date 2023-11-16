import { Text as InnerText, TextVariants } from "@slashid/react-primitives";
import { useConfiguration } from "../../hooks/use-configuration";
import { TextConfigKey } from "./constants";

type Props = {
  t: TextConfigKey;
  children?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  variant?: TextVariants;
  className?: string;
};

export const Text: React.FC<Props> = ({
  as,
  t,
  variant,
  className,
  children,
}) => {
  const { text } = useConfiguration();

  return (
    <InnerText
      as={as}
      t={t}
      variant={variant}
      className={className}
      text={text}
    >
      {children}
    </InnerText>
  );
};

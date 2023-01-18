import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { ConfigurationProvider } from "../../context/config-context";

import { Form as BaseForm, Props } from "./form";

// @ts-expect-error
import { theme, factors, text, logo } from "./demo/config";
import classes from "./demo/vars.module.css";

/**
 * Default configuration provider - used internally
 */
export const Form: React.FC<Props> = ({ className }) => {
  return (
    <ConfigurationProvider theme={theme} factors={factors} text={text} logo={logo}>
      <BaseForm className={`${className} ${classes.branding}`} />
    </ConfigurationProvider>
  );
};

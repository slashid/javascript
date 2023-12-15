import { Stack } from "@slashid/react-primitives";
import clsx from "clsx";
import * as styles from "./header.css";

type Props = {
  logo: JSX.Element;
};

export const Header = (props: Props) => (
  <Stack variant={{ direction: "horizontal" }} className={clsx(styles.header)}>
    {props.logo}
  </Stack>
);

import { useContext } from "react";
import { SlashIDContext } from "../../../context/slash-id-context";

export function useOrgSwitchingContext() {
  const { __orgSwitchingContext } = useContext(SlashIDContext);

  return __orgSwitchingContext;
}

import { useMemo } from "react";
import { hasSSOAndNonSSOFactors } from "../../../domain/handles";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Divider as PrimitiveDivider } from "@slashid/react-primitives";

export const Divider = () => {
  const { factors, text } = useConfiguration();

  const shouldRenderDivider = useMemo(
    () => hasSSOAndNonSSOFactors(factors),
    [factors]
  );

  return (
    <>
      {shouldRenderDivider && <PrimitiveDivider>{text["initial.divider"]}</PrimitiveDivider>}
    </>
  );
};
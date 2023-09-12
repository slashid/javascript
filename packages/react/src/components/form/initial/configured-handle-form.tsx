import { Factor } from "@slashid/slashid";
import { Handle, HandleType } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { sprinkles } from "../../../theme/sprinkles.css";
import { Divider } from "../../divider";
import { Tabs } from "../../tabs";
import { HandleForm } from "./handle-form";
import { useMemo } from "react";
import {
  getHandleTypes,
  hasOidcAndNonOidcFactors,
  isFactorOidc,
  resolveLastHandleValue,
} from "../../../domain/handles";

export const TAB_NAME = {
  email: "email",
  phone: "phone",
};

export const tabIDByHandle: Record<HandleType, string> = {
  phone_number: TAB_NAME.phone,
  email_address: TAB_NAME.email,
};

type Props = {
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  lastHandle?: Handle;
};

// renders a form with variable form fields to enter handles based on the configured factors
export const ConfiguredHandleForm = ({ handleSubmit, lastHandle }: Props) => {
  const { factors, text } = useConfiguration();

  const nonOidcFactors: Factor[] = useMemo(
    () => factors.filter((f) => !isFactorOidc(f)),
    [factors]
  );

  const shouldRenderDivider = useMemo(
    () => hasOidcAndNonOidcFactors(factors),
    [factors]
  );

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  if (nonOidcFactors.length === 0) {
    return null;
  }

  if (handleTypes.length === 1) {
    return (
      <>
        <HandleForm
          handleSubmit={handleSubmit}
          factors={factors}
          handleType={handleTypes[0]}
          defaultValue={resolveLastHandleValue(lastHandle, handleTypes[0])}
        />
        {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
      </>
    );
  }

  return (
    <>
      <Tabs
        className={sprinkles({ marginY: "6" })}
        defaultValue={tabIDByHandle[lastHandle?.type ?? "email_address"]}
        tabs={[
          {
            id: TAB_NAME.email,
            title: text["initial.handle.email"],
            content: (
              <HandleForm
                handleSubmit={handleSubmit}
                factors={factors}
                handleType="email_address"
                defaultValue={resolveLastHandleValue(
                  lastHandle,
                  "email_address"
                )}
              />
            ),
          },
          {
            id: TAB_NAME.phone,
            title: text["initial.handle.phone"],
            content: (
              <HandleForm
                handleSubmit={handleSubmit}
                factors={factors}
                handleType="phone_number"
                defaultValue={resolveLastHandleValue(
                  lastHandle,
                  "phone_number"
                )}
              />
            ),
          },
        ]}
      />
      {shouldRenderDivider ? (
        <Divider>{text["initial.divider"]}</Divider>
      ) : null}
    </>
  );
};

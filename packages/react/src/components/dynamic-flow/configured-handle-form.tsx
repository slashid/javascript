import { useMemo } from "react";
import { Factor } from "@slashid/slashid";
import { Divider, Tabs, sprinkles } from "@slashid/react-primitives";

import { Handle, HandleType } from "../../domain/types";
import { useConfiguration } from "../../hooks/use-configuration";
import { HandleForm } from "./handle-form";
import {
  getHandleTypes,
  hasSSOAndNonSSOFactors,
  isFactorOidc,
  resolveLastHandleValue,
} from "../../domain/handles";

export const TAB_NAME = {
  email: "email",
  phone: "phone",
  username: "username",
};

export const tabIDByHandle: Record<HandleType, string> = {
  phone_number: TAB_NAME.phone,
  email_address: TAB_NAME.email,
  username: TAB_NAME.username,
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
    () => hasSSOAndNonSSOFactors(factors),
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
        testId="sid-handle-type-tabs"
        className={sprinkles({ marginY: "6" })}
        defaultValue={tabIDByHandle[lastHandle?.type ?? "email_address"]}
        tabs={[
          ...(handleTypes.includes("email_address")
            ? [
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
              ]
            : []),
          ...(handleTypes.includes("phone_number")
            ? [
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
              ]
            : []),

          ...(handleTypes.includes("username")
            ? [
                {
                  id: TAB_NAME.username,
                  title: text["initial.handle.username"],
                  content: (
                    <HandleForm
                      handleSubmit={handleSubmit}
                      factors={factors}
                      handleType="username"
                      defaultValue={resolveLastHandleValue(
                        lastHandle,
                        "username"
                      )}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
      {shouldRenderDivider ? (
        <Divider>{text["initial.divider"]}</Divider>
      ) : null}
    </>
  );
};

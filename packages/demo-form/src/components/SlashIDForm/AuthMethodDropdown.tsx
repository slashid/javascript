import { useSlashID } from "@slashid/react";
import { PersonHandleType } from "@slashid/slashid";
import { Dispatch, useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { Action, AuthMethod, HandleType } from "./state";

const filterOutOptions = (
  identifier: HandleType | undefined,
  options: string[] | undefined
) => {
  if (!options) {
    return;
  }

  if (identifier === "email_address") {
    return options.filter((option) => option !== "webauthn_via_email");
  }

  if (identifier === "phone_number") {
    return options.filter((option) => option !== "webauthn_via_sms");
  }
};

type Props = {
  dispatch: Dispatch<Action>;
  handleType: HandleType;
  authMethod: AuthMethod | undefined;
};

export const AuthMethodDropdown: React.FC<Props> = ({
  dispatch,
  handleType,
  authMethod,
}) => {
  const { sid } = useSlashID();
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [isLoadingDropdownOptions, setIsLoadingDropdownOptions] =
    useState(false);

  useEffect(() => {
    if (!sid) {
      return;
    }

    const getAvailableMethods = async (handleType: HandleType) => {
      const methods = await sid.getAvailableAuthenticationMethods(
        handleType as unknown as PersonHandleType
      );
      setDropdownOptions(methods);
      setIsLoadingDropdownOptions(false);

      if (methods.length) {
        dispatch({ type: "SET_AUTH_METHOD", payload: methods[0] });
      }
    };

    setIsLoadingDropdownOptions(true);
    getAvailableMethods(handleType);
  }, [sid, handleType, dispatch]);

  return (
    <Dropdown
      changeChosenOption={(option) =>
        dispatch({ type: "SET_AUTH_METHOD", payload: option as AuthMethod })
      }
      chosenOption={authMethod}
      options={filterOutOptions(handleType, dropdownOptions)}
      label="Authentication method"
      optionPlaceholder={
        isLoadingDropdownOptions
          ? "Loading authentication methods"
          : "Select an authentication method"
      }
    />
  );
};

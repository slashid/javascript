import { Dispatch, useCallback, useState } from "react";
import Dropdown from "../Dropdown";
import { Action, HandleType } from "./state";

type Props = {
  dispatch: Dispatch<Action>;
};

export const IdentifierDropdown: React.FC<Props> = ({ dispatch }) => {
  const [identifierType, setIdentifierType] =
    useState<HandleType>("email_address");
  const identifierOptions = ["email_address", "phone_number"];

  const handleChange = useCallback(
    (identifier: HandleType) => {
      setIdentifierType(identifier);
      dispatch({
        type: "SET_HANDLE_TYPE",
        payload: identifier,
      });
    },
    [dispatch]
  );

  return (
    <Dropdown
      changeChosenOption={(e) => handleChange(e as HandleType)}
      chosenOption={identifierType}
      options={identifierOptions}
      label="Identifier type"
      optionPlaceholder="Select an identifier type"
    />
  );
};

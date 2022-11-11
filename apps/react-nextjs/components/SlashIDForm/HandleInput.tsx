import { Dispatch, useState } from "react";
import Input from "../Input";
import PhoneNumberInput from "../PhoneNumberInput";
import { Action, HandleType } from "./state";

type Props = {
  dispatch: Dispatch<Action>;
  handleType: HandleType;
};

export const HandleInput: React.FC<Props> = ({ dispatch, handleType }) => {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <>
      {handleType === "email_address" && (
        <Input
          label="Email address"
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => dispatch({ type: "SET_HANDLE", payload: inputValue })}
          placeholder="Insert your email address"
          value={inputValue}
        />
      )}

      {handleType === "phone_number" && (
        <PhoneNumberInput
          label="Phone number"
          onChange={setInputValue}
          onBlur={() => dispatch({ type: "SET_HANDLE", payload: inputValue })}
          placeholder="Insert your phone number"
          value={inputValue}
        />
      )}
    </>
  );
};

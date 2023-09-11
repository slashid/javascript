import { clsx } from "clsx";
import {
  ChangeEvent,
  ClipboardEventHandler,
  FocusEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import * as styles from "./otp-input.css";

type Props = {
  /** Callback to be called when the OTP value changes */
  onChange: (otp: string) => void;
  /** Value of the OTP input */
  value?: string;
  /** Number of OTP inputs to be rendered */
  numInputs?: number;
  /** Whether the first input should be auto focused */
  shouldAutoFocus?: boolean;
  /** The type that will be passed to the input being rendered */
  inputType?: "text" | "number";
};

/**
 * OTP input component that handles OTP codes.
 */
export const OtpInput = ({
  onChange,
  value = "",
  numInputs = 4,
  shouldAutoFocus = false,
  inputType = "text",
}: Props) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const getOTPValue = () => (value ? value.toString().split("") : []);

  const isInputNum = inputType === "number";

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  const isInputTypeValid = (value: string) => {
    return isInputNum ? !isNaN(Number(value)) : typeof value === "string";
  };

  const isInputValueValid = (value: string) => {
    return isInputTypeValid(value) && value.trim().length === 1;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
      focusInput(activeInput + 1);
    }
  };

  /**
   * Spreads the OTP value across the inputs.
   */
  const spreadOTPInputValue = (value: string) => {
    const otp = getOTPValue();
    let nextActiveInput = activeInput;

    // Get value in an array of max size (num of inputs - current position)
    const valueArray = value.slice(0, numInputs - activeInput).split("");

    // Skip operation if the values contain non-numeric values for number inputs
    if (isInputNum && valueArray.some((value) => isNaN(Number(value)))) {
      return;
    }

    // Insert data from focused input onwards
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && valueArray.length > 0) {
        otp[pos] = valueArray.shift() ?? "";
        nextActiveInput++;
      }
    }

    focusInput(nextActiveInput);
    handleOTPChange(otp);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const isTypeValid = isInputTypeValid(value);

    if (!isTypeValid) {
      // Clear the input if it's not valid type because firefox allows
      // pasting non-numeric characters in a number type input
      event.target.value = "";
      return;
    }

    // Spread the input across the inputs only for autofill
    if (value.length === numInputs) {
      spreadOTPInputValue(value);
    }
  };

  const handleFocus =
    (event: FocusEvent<HTMLInputElement, Element>) => (index: number) => {
      setActiveInput(index);
      event.target.select();
    };

  const handleBlur = () => {
    setActiveInput(activeInput - 1);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const otp = getOTPValue();
    if ([event.code, event.key].includes("Backspace")) {
      event.preventDefault();
      changeCodeAtFocus("");
      focusInput(activeInput - 1);
    } else if (event.code === "Delete") {
      event.preventDefault();
      changeCodeAtFocus("");
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      focusInput(activeInput - 1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      focusInput(activeInput + 1);
    }
    // React does not trigger onChange when the same value is entered
    // again. So we need to focus the next input manually in this case.
    else if (event.key === otp[activeInput]) {
      event.preventDefault();
      focusInput(activeInput + 1);
    } else if (
      event.code === "Spacebar" ||
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      event.preventDefault();
    }
  };

  const focusInput = (index: number) => {
    const activeInput = Math.max(Math.min(numInputs - 1, index), 0);

    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus();
      inputRefs.current[activeInput]?.select();
      setActiveInput(activeInput);
    }
  };

  const changeCodeAtFocus = (value: string) => {
    const otp = getOTPValue();
    otp[activeInput] = value[0];
    handleOTPChange(otp);
  };

  const handleOTPChange = (otp: Array<string>) => {
    onChange(otp.join(""));
  };

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();

    const value = event.clipboardData?.getData("text/plain");
    spreadOTPInputValue(value);
  };

  return (
    <div className={clsx("sid-otp-input", styles.container)}>
      {Array.from({ length: numInputs }, (_, index) => index).map((index) => (
        <input
          key={index}
          className={styles.otpInput}
          // enable autofill only on the first input
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={index === 0 ? numInputs : 1}
          autoFocus={index === 0 && shouldAutoFocus}
          type="text"
          inputMode={isInputNum ? "numeric" : "text"}
          aria-label={`Please enter OTP ${isInputNum ? "digit" : "character"} ${
            index + 1
          }`}
          value={getOTPValue()[index] ?? ""}
          ref={(element) => (inputRefs.current[index] = element)}
          onChange={handleChange}
          onFocus={(event) => handleFocus(event)(index)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInputChange}
        />
      ))}
    </div>
  );
};

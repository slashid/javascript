import { useState, useEffect } from "react";
import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import { BackButton, Prompt } from "./authenticating.components";
import { Text } from "../../text";
import { TextConfigKey } from "../../text/constants";
import { TotpKeyGenerated } from "@slashid/slashid";
import { Loader } from "./icons";
import { Input } from "../../../../../react-primitives/src/components/input";

type FormState =
  | "initial"
  | "registerAuthenticator"
  | "input"
  | "saveRecoveryCodes";

function getTextKeys(flowState: Props["flowState"], formState: FormState) {
  const TEXT_KEYS: Record<
    FormState,
    Record<"title" | "message", TextConfigKey>
  > = {
    initial: {
      title: "",
      message: "",
    },
    registerAuthenticator: {
      title: "authenticating.registerAuthenticator.totp.title",
      message: "authenticating.registerAuthenticator.totp.message",
    },
  };

  return TEXT_KEYS[formState];
}

export function TOTPState({ flowState }: Props) {
  const { text } = useConfiguration();
  const { sid } = useSlashID();
  const { values, registerField, registerSubmit, setError, clearError } =
    useForm();
  const [formState, setFormState] = useState<FormState>("initial");
  const [keyGeneratedEvent, setKeyGeneratedEvent] =
    useState<TotpKeyGenerated>();
  const [showRegisterURI, setShowRegisterURI] = useState(false);

  const { title, message } = getTextKeys(flowState, formState);

  useEffect(() => {
    const handler = (e: TotpKeyGenerated) => {
      console.log("totpKeyGenerated", e);
      setKeyGeneratedEvent(e);
      setFormState("registerAuthenticator");
    };
    sid?.subscribe("totpKeyGenerated", handler);

    return sid?.unsubscribe("totpKeyGenerated", handler);
  }, [sid]);

  useEffect(() => {
    const handler = () => {
      console.log("totpCodeRequested");
      setFormState("input");
    };
    sid?.subscribe("totpCodeRequested", handler);

    return sid?.unsubscribe("totpCodeRequested", handler);
  }, [sid]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {formState === "initial" && <Loader />}
      {formState === "registerAuthenticator" && (
        <>
          <img
            src={`data:image/png;base64, ${keyGeneratedEvent?.qrCode}`}
            alt="QR Code"
          />
          <Prompt
            prompt="authenticating.registerAuthenticator.totp.prompt"
            cta="authenticating.registerAuthenticator.totp.cta"
            onClick={() => setShowRegisterURI(true)}
          />
          {showRegisterURI && keyGeneratedEvent?.uri}
        </>
      )}
    </>
  );
}

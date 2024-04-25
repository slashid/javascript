import { Button, sprinkles, ReadOnlyField } from "@slashid/react-primitives";
import { DownloadCodes } from "./download-codes";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "@slashid/react-primitives";

export interface StoreRecoveryCodesState {
  status: "storeRecoveryCodes";
  context: {
    recoveryCodes: string[];
  };
  confirm: () => void;
}

type Props = {
  flowState: StoreRecoveryCodesState;
};

export function StoreRecoveryCodes({ flowState }: Props) {
  const { text } = useConfiguration();

  return (
    <>
      <Text
        as="h1"
        t="authenticating.saveRecoveryCodes.totp.title"
        variant={{ size: "2xl-title", weight: "bold" }}
      />
      <Text
        t="authenticating.saveRecoveryCodes.totp.message"
        variant={{ color: "contrast", weight: "semibold" }}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          flowState.confirm();
        }}
      >
        <ReadOnlyField
          id="recoveryCodes"
          as="textarea"
          value={flowState.context.recoveryCodes.join(
            String.fromCharCode(13, 10)
          )}
          rows={8}
          copy
          className={sprinkles({
            marginTop: "12",
          })}
        />
        <DownloadCodes codes={flowState.context.recoveryCodes} />
        <Button
          className={sprinkles({
            marginTop: "2",
          })}
          type="submit"
          variant="primary"
          testId="sid-form-authenticating-submit-button"
        >
          {text["authenticating.continue"]}
        </Button>
      </form>
    </>
  );
}

import { Button, sprinkles, ReadOnlyField } from "@slashid/react-primitives";
import { DownloadCodes } from "./download-codes";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "@slashid/react-primitives";
import * as styles from "./store-recovery-codes.css";

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

function getFieldValueFromCodes(codes: string[]): string {
  const newLine = String.fromCharCode(13, 10);

  return codes.join(newLine);
}

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
          as="div"
          value={getFieldValueFromCodes(flowState.context.recoveryCodes)}
          copy
          className={styles.recoveryCodes}
          fieldClassName={styles.recoveryCodesField}
        />
        <DownloadCodes codes={flowState.context.recoveryCodes} />
        <Button
          className={sprinkles({
            marginTop: "2",
          })}
          type="submit"
          variant="primary"
          testId="sid-form-recovery-codes-submit-button"
        >
          {text["authenticating.continue"]}
        </Button>
      </form>
    </>
  );
}

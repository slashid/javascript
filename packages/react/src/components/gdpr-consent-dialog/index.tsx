import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { Accordion } from "../accordion";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Switch } from "../switch";
import { Text } from "../text";
import * as styles from "./style.css";
import { publicVariables } from "../../theme/theme.css";

type Props = {
  /** Custom class name */
  className?: string;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when user accepts */
  onSuccess?: () => void;
  /** Callback when user rejects */
  onError?: () => void;
  /**
   * The modality of the dialog.
   * When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   * When set to `false`, interaction with outside elements will be enabled and all content will be visible to screen readers.
   */
  modal?: boolean;
  // TODO: customised text
};

/**
 * GDPR Dialog component to handle user consent for cookies
 * TODO: add more detailed description
 */
export const GDPRConsentDialog = ({
  className,
  onSuccess,
  onError,
  defaultOpen = false,
  modal = true,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const close = () => setOpen(false);

  const reset = () => {
    setHasError(false);
    setIsCustomizing(false);
  };

  const handleSave = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      handleAccept();
    } catch (error) {
      console.error(error);
      setHasError(true);
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    close();
    onSuccess?.();
    // TODO: add accept logic
  };

  const handleReject = () => {
    close();
    onError?.();
    // TODO: add reject logic
  };

  const handleCustomize = () => {
    setIsCustomizing(true);
  };

  useEffect(() => {
    if (!open) {
      // Reset state when dialog is closed
      reset();
    }
  }, [open]);

  return (
    <Dialog
      className={clsx(styles.dialog, className)}
      modal={modal}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="neutralMd" className={styles.dialogTrigger}>
          <Cookie />
        </Button>
      }
      icon={<Cookie fill={publicVariables.color.primary} />}
    >
      <div className={styles.title}>
        <Text t="gdpr.dialog.title" variant={{ weight: "bold" }} />
        <Text
          t="gdpr.dialog.subtitle"
          variant={{ weight: "semibold", color: "contrast" }}
        />
      </div>
      {isCustomizing && (
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <Accordion
              itemClassName={styles.accordionItem}
              items={[
                {
                  value: "1",
                  icon: <Switch blocked />,
                  trigger: (
                    <Text
                      className={styles.accordionTrigger}
                      t="gdpr.consent.necessary.title"
                      variant={{ weight: "semibold" }}
                    />
                  ),
                  content: (
                    <Text
                      className={styles.accordionContent}
                      t="gdpr.consent.necessary.description"
                      variant={{ size: "sm", color: "contrast" }}
                    />
                  ),
                },
                {
                  value: "2",
                  icon: <Switch disabled={isLoading} />,
                  trigger: (
                    <Text
                      className={styles.accordionTrigger}
                      t="gdpr.consent.analytics.title"
                      variant={{ weight: "semibold" }}
                    />
                  ),
                  content: (
                    <Text
                      className={styles.accordionContent}
                      t="gdpr.consent.analytics.description"
                      variant={{ size: "sm", color: "contrast" }}
                    />
                  ),
                },
                {
                  value: "3",
                  icon: <Switch disabled={isLoading} />,
                  trigger: (
                    <Text
                      className={styles.accordionTrigger}
                      t="gdpr.consent.marketing.title"
                      variant={{ weight: "semibold" }}
                    />
                  ),
                  content: (
                    <Text
                      className={styles.accordionContent}
                      t="gdpr.consent.marketing.description"
                      variant={{ size: "sm", color: "contrast" }}
                    />
                  ),
                },
              ]}
            />
            {hasError && (
              <div className={styles.errorWrapper}>
                <Text
                  t="gdpr.dialog.error.title"
                  variant={{
                    weight: "semibold",
                    color: "contrast",
                  }}
                />
                <Text
                  t="gdpr.dialog.error.subtitle"
                  variant={{ weight: "semibold", color: "tertiary" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.footer}>
        {isCustomizing && (
          <Button
            variant="neutralMd"
            loading={isLoading}
            onClick={handleSave}
            className={styles.saveButton}
          >
            {hasError ? "Try again" : "Save settings"}
          </Button>
        )}
        <Button
          variant="secondaryMd"
          onClick={handleAccept}
          disabled={isLoading}
        >
          Accept all
        </Button>
        {!isCustomizing && (
          <>
            <Button variant="secondaryMd" onClick={handleReject}>
              Reject all
            </Button>
            <Button variant="ghostMd" onClick={handleCustomize}>
              Customize
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
};

import { clsx } from "clsx";
import { useState } from "react";
import { Accordion } from "../accordion";
import { Button } from "../button";
import { Dialog } from "../dialog";
import { Cookie } from "../icon/cookie";
import { Switch } from "../switch";
import { Text } from "../text";
import * as styles from "./style.css";

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

  const handleAccept = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleReject = () => {
    setOpen(false);
    onError?.();
  };

  return (
    <Dialog
      className={clsx(styles.dialog, className)}
      modal={modal}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className={styles.dialogTrigger}>
          <Cookie />
        </button>
      }
      icon={<Cookie />}
    >
      <div className={styles.title}>
        <Text t="gdpr.dialog.title" variant={{ weight: "bold" }} />
        <Text
          t="gdpr.dialog.subtitle"
          variant={{ weight: "semibold", color: "contrast" }}
        />
      </div>
      <div className={styles.content}>
        <Accordion
          items={[
            {
              value: "1",
              icon: <Switch blocked />,
              trigger: (
                <Text
                  className={styles.trigger}
                  t="gdpr.consent.necessary.title"
                  variant={{ weight: "semibold" }}
                />
              ),
              content: (
                <Text
                  t="gdpr.consent.necessary.description"
                  variant={{ size: "sm", color: "contrast" }}
                />
              ),
            },
            {
              value: "2",
              icon: <Switch />,
              trigger: (
                <Text
                  className={styles.trigger}
                  t="gdpr.consent.analytics.title"
                  variant={{ weight: "semibold" }}
                />
              ),
              content: (
                <Text
                  t="gdpr.consent.analytics.description"
                  variant={{ size: "sm", color: "contrast" }}
                />
              ),
            },
            {
              value: "3",
              icon: <Switch />,
              trigger: (
                <Text
                  className={styles.trigger}
                  t="gdpr.consent.marketing.title"
                  variant={{ weight: "semibold" }}
                />
              ),
              content: (
                <Text
                  t="gdpr.consent.marketing.description"
                  variant={{ size: "sm", color: "contrast" }}
                />
              ),
            },
          ]}
        />
      </div>
      <div className={styles.footer}>
        <Button variant="primary" onClick={handleAccept}>
          Accept
        </Button>
        <Button variant="secondary" onClick={handleReject}>
          Reject
        </Button>
      </div>
    </Dialog>
  );
};

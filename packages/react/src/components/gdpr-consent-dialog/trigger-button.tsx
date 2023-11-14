import React, { forwardRef } from 'react'
import { Button } from "@slashid/react-primitives";
import { Teleport } from '../teleport'
import { clsx } from "clsx";
import { Cookie } from "../icon/cookie";
import * as styles from "./style.css";

interface TriggerButtonProps {
  buttonClassName?: string
}

export const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(({ buttonClassName, ...props }, ref) => (
  <Teleport to="sid-cookie-button">
    <Button
      {...props}
      ref={ref}
      testId="sid-gdpr-consent-dialog-trigger"
      variant="neutralMd"
      className={clsx(
        "sid-gdpr-consent-dialog-trigger",
        styles.dialogTrigger,
        buttonClassName
      )}
    >
      <Cookie />
    </Button>
  </Teleport>
))

TriggerButton.displayName = "TriggerButton"
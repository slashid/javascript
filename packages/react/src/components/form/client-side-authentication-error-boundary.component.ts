import { SlashID, __INTERNAL_ONLY, errors } from "@slashid/slashid";
import { Component, ReactNode } from "react";

interface Props {
  sid?: SlashID
  children: ReactNode
}

export class ClientSideAuthenticationErrorBoundary extends Component<Props, any, any> {

  public async componentDidCatch(error: Error) {
    if (!this.props.sid) return
    if (errors.isResponseError(error)) return
    if (errors.isRateLimitError(error)) return

    const internal = __INTERNAL_ONLY(this.props.sid)
    internal.publish("clientSideError", undefined)
  }

  public render() {
    return (
      this.props.children
    );
  }
}
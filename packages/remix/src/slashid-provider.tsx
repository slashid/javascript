import {
  SlashIDProvider as ReactSlashIDProvider,
  SlashIDProviderProps,
} from "@slashid/react";

export type RemixSlashIDProviderOptions = Omit<
  SlashIDProviderProps,
  "tokenStorage"
>;

export const SlashIDProvider = ({
  children,
  ...props
}: RemixSlashIDProviderOptions) => {
  return (
    <ReactSlashIDProvider {...props} tokenStorage="cookie">
      {children}
    </ReactSlashIDProvider>
  );
};

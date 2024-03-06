import {
  pxSanitiser,
  hexSanitiser,
  fontFamilySanitiser,
  exactMatchSanitiser,
  displayValues,
} from "./css-sanitisation";
import { toEntries } from "./object";

const cssVariables = [
  "--sid-form-logo-margin-bottom",
  "--sid-form-logo-width",
  "--sid-form-border-radius",
  "--sid-form-button-primary-color",
  "--sid-form-button-border-radius",
  "--sid-form-sso-margin-top",
  "--sid-form-font-family",
  "--sid-form-color-foreground",
  "--sid-form-divider-display",
  "--sid-input-border-radius",
  "--sid-input-border-color",
  "--sid-input-label-color",
] as const;

const permittedCssVariables = new Set(cssVariables);

type CssVariable = (typeof cssVariables)[number];
type CssVariableConfig = Partial<Record<CssVariable, string | number>>;

const sanitisers: Record<
  CssVariable,
  (input: string | number | (string | number)[]) => string | number | null
> = {
  "--sid-form-logo-margin-bottom": pxSanitiser,
  "--sid-form-logo-width": pxSanitiser,
  "--sid-form-border-radius": pxSanitiser,
  "--sid-form-button-primary-color": hexSanitiser,
  "--sid-form-button-border-radius": pxSanitiser,
  "--sid-form-sso-margin-top": pxSanitiser,
  "--sid-form-font-family": fontFamilySanitiser,
  "--sid-form-color-foreground": hexSanitiser,
  "--sid-form-divider-display": exactMatchSanitiser(displayValues),
  "--sid-input-border-radius": pxSanitiser,
  "--sid-input-border-color": hexSanitiser,
  "--sid-input-label-color": hexSanitiser,
};

export const sanitiseCssVariableCustomisationConfig = (
  config: CssVariableConfig
): CssVariableConfig => {
  return toEntries(config)
    .filter((entry): entry is [CssVariable, string | number | undefined] =>
      permittedCssVariables.has(entry[0])
    )
    .reduce<Partial<CssVariableConfig>>((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      const sanitisedValue = sanitisers[key](value);

      if (sanitisedValue === null) return acc;

      acc[key] = sanitisedValue;

      return acc;
    }, {});
};

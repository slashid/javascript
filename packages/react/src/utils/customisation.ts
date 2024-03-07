import {
  pxSanitiser,
  hexSanitiser,
  fontFamilySanitiser,
  exactMatchSanitiser,
  displayValues,
  fontFamilyRegExp,
  googleFonts,
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

export type CssVariable = (typeof cssVariables)[number];
export type CssVariableConfig = Partial<
  Record<CssVariable, string | number | (string | number)[]>
>;

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
  // @ts-expect-error TODO fix this as CSS vars cannot be arrays
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

export const getGoogleFontImports = (fontFamily: string) => {
  const fonts = fontFamily.toString().match(fontFamilyRegExp);

  if (!fonts) return [];

  const sanitisedFonts = fonts.map((font) =>
    font.replaceAll(",", "").replaceAll(`'`, "").replaceAll(`"`, "").trim()
  );

  const googleFontUrls = sanitisedFonts
    .filter((font) => googleFonts.has(font))
    .map((font) => {
      const urlFontName = font.replace(" ", "+");
      return `<link href="https://fonts.googleapis.com/css2?family=${urlFontName}:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">`;
    });

  if (!googleFontUrls.length) return [];

  return [
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    ...googleFontUrls,
  ];
};

import {
  pxSanitiser,
  hexSanitiser,
  fontFamilySanitiser,
  fontFamilyRegExp,
  googleFonts,
} from "./css-sanitisation";
import { toEntries } from "./object";

import { ThemePublicVars, themeVarNames } from "@slashid/react-primitives";

const permittedCssVariables = new Set(themeVarNames);

export type CssVariable = ThemePublicVars;

export type CssVariableConfig = Partial<
  Record<ThemePublicVars, string | number>
>;

// TODO extend with the settings exposed from the console
const sanitisers: Partial<
  Record<
    ThemePublicVars,
    (input: string | number | (string | number)[]) => string | number | null
  >
> = {
  "--sid-color-primary": hexSanitiser,
  "--sid-font-family": fontFamilySanitiser,
  "--sid-form-logo-width": pxSanitiser,
  "--sid-form-border-radius": pxSanitiser,
  "--sid-button-border-radius": pxSanitiser,
  "--sid-color-foreground": hexSanitiser,
  "--sid-input-border-radius": pxSanitiser,
  "--sid-input-border-color": hexSanitiser,
  "--sid-input-label-color": hexSanitiser,
};

export const sanitiseCssVariableCustomisationConfig = (
  config: CssVariableConfig
): CssVariableConfig => {
  return toEntries(config)
    .filter((entry) => permittedCssVariables.has(entry[0]))
    .reduce<Partial<CssVariableConfig>>((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      // @ts-ignore
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
    ...googleFontUrls.join("\n"),
  ];
};

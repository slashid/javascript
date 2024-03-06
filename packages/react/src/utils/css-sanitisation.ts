export const pixelValueRegExp = /([0-9]+)px/;
export const hexValueRegExp = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/;
export const fontFamilyRegExp = /(?:['"]?([\\\w\d\- ]+)['"]?(?:,\s*)?)/g;
export const displayValues = ["flex", "none"];
export const supportedFonts = ["Inter", "Open Sans", "sans-serif"];

export const parseAndAssertMatch = (
  input: string | number,
  regexp: RegExp
): string | null => {
  const parsed = input.toString().match(regexp);
  if (!parsed) return null;

  const [match] = parsed;

  const valid = regexp.test(match);
  if (!valid) return null;

  return match;
};

export const pxSanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  if (Array.isArray(input)) return null;

  return parseAndAssertMatch(input, pixelValueRegExp);
};

export const hexSanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  if (Array.isArray(input)) return null;

  return parseAndAssertMatch(input, hexValueRegExp);
};

export const exactMatchSanitiser =
  (values: any[]) =>
  (input: string | number | (string | number)[]): string | number | null => {
    if (Array.isArray(input)) return null;

    const match = values.some((value) => value === input);

    if (!match) return null;

    return input;
  };

export const filterDisallowedFonts = (fonts: string[]): string[] => {
  return fonts
    .map((font) => font.replaceAll(', ', '').trim())
    .filter((font) => {
      for (const fontName of supportedFonts) {
        if (font === fontName) return true;
        if (font === `'${fontName}'`) return true;
        if (font === `"${fontName}"`) return true;
      }

    return false;
  });
}

export const fontFamilySanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  const fonts = input.toString().match(fontFamilyRegExp);

  if (!fonts) return null;

  const allowedFonts = filterDisallowedFonts(fonts)
  if (!allowedFonts.length) return null;

  return allowedFonts.join(",");
};

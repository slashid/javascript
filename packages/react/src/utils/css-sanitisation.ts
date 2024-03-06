export const pixelValueRegexp = /([0-9]+)px/;
export const hexValueRegexp = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/;
export const fontFamilyRegexp = /(?:['"]?([\\\w\d\- ]+)['"]?(?:,\s*)?)/g;
export const displayValues = ["flex", "none"];
export const fontValues = ["Inter", "Open Sans", "sans-serif"];

export const parseAndAssertMatch = (
  input: string | number,
  regexp: RegExp
): string | null => {
  const parsed = input.toString().match(regexp);
  if (!parsed) return null;

  const [match] = parsed;

  const valid = pixelValueRegexp.test(match);
  if (!valid) return null;

  return match;
};

export const pxSanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  if (Array.isArray(input)) return null;

  return parseAndAssertMatch(input, pixelValueRegexp);
};

export const hexSanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  if (Array.isArray(input)) return null;

  return parseAndAssertMatch(input, hexValueRegexp);
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
      for (const fontName of fontValues) {
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
  const fonts = input.toString().match(fontFamilyRegexp);

  if (!fonts) return null;

  const allowedFonts = filterDisallowedFonts(fonts)
  if (!allowedFonts.length) return null;

  return allowedFonts.join(",");
};

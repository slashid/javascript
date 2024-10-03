export const pixelValueRegExp = /([0-9]+)px$/;
export const hexValueRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const rgbaValueRegExp =
  /^rgba\(\s*(25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|\d{1,2})\s*,\s*(0(\.\d+)?|1(\.0)?)\s*\)$/;
export const fontFamilyRegExp = /(?:['"]?([\\\w\d\- ]+)['"]?(?:,\s*)?)/g;
export const displayValues = ["flex", "none"];
export const googleFonts = new Set(["Open Sans", "Inter"]);
export const supportedFonts = ["sans-serif", ...googleFonts];

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

export const rgbaSanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  if (Array.isArray(input)) return null;

  return parseAndAssertMatch(input, rgbaValueRegExp);
};

export const exactMatchSanitiser =
  <T extends string | number>(values: T[]) =>
  (input: T): T | null => {
    if (Array.isArray(input)) return null;

    const match = values.some((value) => value === input);

    if (!match) return null;

    return input;
  };

export const filterDisallowedFonts = (fonts: string[]): string[] => {
  return fonts
    .map((font) => font.replaceAll(",", "").trim())
    .filter((font) => {
      for (const fontName of supportedFonts) {
        if (font === fontName) return true;
        if (font === `'${fontName}'`) return true;
        if (font === `"${fontName}"`) return true;
      }

      return false;
    });
};

export const fontFamilySanitiser = (
  input: string | number | (string | number)[]
): string | number | null => {
  const fonts = input.toString().match(fontFamilyRegExp);

  if (!fonts) return null;

  const allowedFonts = filterDisallowedFonts(fonts);
  if (!allowedFonts.length) return null;

  return allowedFonts.join(", ");
};

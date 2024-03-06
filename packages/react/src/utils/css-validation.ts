import {
  filterDisallowedFonts,
  fontFamilyRegexp,
  hexValueRegexp,
  pixelValueRegexp,
} from "./css-sanitisation";

export const validate = (input: string | number, regexp: RegExp): boolean => {
  const parsed = input.toString().match(regexp);
  if (!parsed) return false;

  const [match] = parsed;

  const valid = pixelValueRegexp.test(match);
  if (!valid) return false;

  return true;
};

export const pxValidator = (input: string | number): boolean =>
  validate(input, pixelValueRegexp);

export const hexValidator = (input: string | number): boolean =>
  validate(input, hexValueRegexp);

export const exactValidator =
  (values: any[]) =>
  (input: string | number): boolean => {
    if (Array.isArray(input)) return false;

    const match = values.some((value) => value === input);

    if (!match) return false;

    return true;
  };

export const fontFamilyValidator = (
  input: string | number | (string | number)[]
): boolean => {
  const fonts = input.toString().match(fontFamilyRegexp);
  if (!fonts) return false;

  const allowedFonts = filterDisallowedFonts(fonts);
  if (!allowedFonts.length) return false;

  return true;
};

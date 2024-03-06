import {
  filterDisallowedFonts,
  fontFamilyRegExp,
  hexValueRegExp,
  pixelValueRegExp,
  supportedFonts
} from "./css-sanitisation";

export {
  fontFamilyRegExp,
  hexValueRegExp,
  pixelValueRegExp,
  supportedFonts
}

export const validate = (input: string | number, regexp: RegExp): boolean => {
  const parsed = input.toString().match(regexp);
  if (!parsed) return false;

  const [match] = parsed;

  const valid = pixelValueRegExp.test(match);
  if (!valid) return false;

  return true;
};

export const pxValidator = (input: string | number): boolean =>
  validate(input, pixelValueRegExp);

export const hexValidator = (input: string | number): boolean =>
  validate(input, hexValueRegExp);

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
  const fonts = input.toString().match(fontFamilyRegExp);
  if (!fonts) return false;

  const allowedFonts = filterDisallowedFonts(fonts);
  if (!allowedFonts.length) return false;

  return true;
};

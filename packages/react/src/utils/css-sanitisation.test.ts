import {
  pxSanitiser,
  hexSanitiser,
  fontFamilySanitiser,
} from "./css-sanitisation";

describe("pxSanitiser", () => {
  it("should return null for array input", () => {
    const input = ["10px", "20px", "30px"];
    const result = pxSanitiser(input);
    expect(result).toBeNull();
  });

  it("should return the input value if it matches the pixel value regex", () => {
    const input = "10px";
    const result = pxSanitiser(input);
    expect(result).toBe(input);
  });

  it("should return null if the input does not match the pixel value regex", () => {
    const input = "10em";
    const result = pxSanitiser(input);
    expect(result).toBeNull();
  });

  it("should return null if the input has extra characters", () => {
    const input = "10px12313212";
    const result = pxSanitiser(input);
    expect(result).toBeNull();
  });
});

describe("hexSanitiser", () => {
  it("should return null for array input", () => {
    const input = ["#000000", "#ffffff", "#ff0000"];
    const result = hexSanitiser(input);
    expect(result).toBeNull();
  });

  it("should return the input value if it matches the hex value regex", () => {
    const input = "#00ff00";
    const result = hexSanitiser(input);
    expect(result).toBe(input);
  });

  it("should return the input value case insensitive", () => {
    const input = "#fafafa";
    const inputCaps = "#FAFAFA";
    const result = hexSanitiser(input);
    const resultCaps = hexSanitiser(inputCaps);
    expect(result).toBe(input);
    expect(resultCaps).toBe(inputCaps);
  });

  it("should return null if the input does not match the hex value regex", () => {
    const input = "#1234567";
    const result = hexSanitiser(input);
    expect(result).toBeNull();
  });
});

describe("fontFamilySanitiser", () => {
  it("should return the input value if it is a string containing the whitelisted fonts", () => {
    const input = "Inter, sans-serif";
    const result = fontFamilySanitiser(input);
    expect(result).toBe(input);
  });

  it("should return null if the input does not match the font value regex", () => {
    const input = "Arial123";
    const result = fontFamilySanitiser(input);
    expect(result).toBeNull();
  });

  it("should filter out the unsupported fonts", () => {
    const input = "Inter, Arial, sans-serif";
    const result = fontFamilySanitiser(input);
    expect(result).toBe("Inter, sans-serif");
  });
});

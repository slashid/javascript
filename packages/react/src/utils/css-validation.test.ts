import { hexValidator, fontFamilyValidator } from "./css-validation";

describe("hexValidator", () => {
  it("should return true for valid hex values", () => {
    expect(hexValidator("#000000")).toBe(true);
    expect(hexValidator("#FFFFFF")).toBe(true);
    expect(hexValidator("#123456")).toBe(true);
    expect(hexValidator("#fafaaf")).toBe(true);
  });

  it("should return false for invalid hex values", () => {
    expect(hexValidator("#GHIJKL")).toBe(false);
    expect(hexValidator("#123MKO")).toBe(false);
    expect(hexValidator("123456")).toBe(false);
  });
});

describe("fontFamilyValidator", () => {
  it("should return true for valid font families", () => {
    expect(fontFamilyValidator("Inter")).toBe(true);
    expect(fontFamilyValidator('"Open Sans"')).toBe(true);
    expect(fontFamilyValidator("sans-serif")).toBe(true);
    expect(fontFamilyValidator("Inter, sans-serif")).toBe(true);
  });

  it("should return false for invalid font families", () => {
    expect(fontFamilyValidator("sans-seri")).toBe(false);
    expect(fontFamilyValidator("Inter, sans-seri")).toBe(false);
    expect(fontFamilyValidator("InvalidFont")).toBe(false);
    expect(fontFamilyValidator("123456")).toBe(false);
  });
});

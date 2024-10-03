import {
  hexValidator,
  fontFamilyValidator,
  rgbaValidator,
} from "./css-validation";

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

describe("rgbaValidator", () => {
  it.each([
    "rgba(0, 0, 0, 0)",
    "rgba(255, 255, 255, 1)",
    "rgba(255, 255, 255, 0.5)",
    "rgba(255, 255, 255, 0.1)",
  ])("should return true for valid rgba value: %s", (rgbaValue) => {
    expect(rgbaValidator(rgbaValue)).toBe(true);
  });

  it.each([
    "rgba(0, 0, 0, 1.1)",
    "rgba(0, 0, 0, -0.1)",
    "rgba(0, 0, 0, 2)",
    "rgba(0, 0, 0, 0.0.1)",
    "rgba(0, 0, 0, 0.1.0)",
    "rgba(0, 0, 0, 0.1.1)",
    "rgba(0, 0, 0,",
  ])("should return false for invalid rgba value: %s", (rgbaValue) => {
    expect(rgbaValidator(rgbaValue)).toBe(false);
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

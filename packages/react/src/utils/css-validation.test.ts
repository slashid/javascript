import { hexValidator } from "./css-validation";

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

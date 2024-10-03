import { sanitiseCssVariableCustomisationConfig } from "./customisation";

describe("sanitiseCssVariableCustomisationConfig", () => {
  it("should accept both rgba and hex values for theme colours", () => {
    const theme = {
      "--sid-color-primary": "#000000",
      "--sid-color-primary-hover": "rgba(0, 0, 0, 0.5)",
    };

    expect(sanitiseCssVariableCustomisationConfig(theme)).toEqual(theme);
  });
});

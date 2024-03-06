import { toEntries } from "./object"

const cssVariables = [
  "--sid-form-logo-margin-bottom",
  "--sid-form-logo-width",
  "--sid-form-border-radius",
  "--sid-form-button-primary-color",
  "--sid-form-button-border-radius",
  "--sid-form-sso-margin-top",
  "--sid-form-font-family",
  "--sid-form-color-foreground",
  "--sid-form-divider-display",
  "--sid-input-border-radius",
  "--sid-input-border-color",
  "--sid-input-label-color"
] as const

const permittedCssVariables = new Set(cssVariables)

type CssVariable = typeof cssVariables[number]

type CssVariableConfig = Partial<Record<CssVariable, string | number>>

const validators: Record<CssVariable, (input: string | number) => string | number | null> = {
  "--sid-form-logo-margin-bottom": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-logo-width": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-border-radius": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-button-primary-color": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-button-border-radius": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-sso-margin-top": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-font-family": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-color-foreground": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-form-divider-display": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-input-border-radius": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-input-border-color": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  },
  "--sid-input-label-color": function (input: string | number): string | number | null {
    throw new Error("Function not implemented.");
  }
}

export const sanitiseCssVariableCustomisationConfig = (config: CssVariableConfig): CssVariableConfig => {
  return toEntries(config)
    .filter((entry): entry is [CssVariable, string | number | undefined] => permittedCssVariables.has(entry[0]))
    .reduce<Partial<CssVariableConfig>>((acc, [key, value]) => {
      if (value === undefined) {
        return acc
      }

      const result = validators[key](value)

      if (result === null) return acc

      acc[key] = value

      return acc
    }, {})
};

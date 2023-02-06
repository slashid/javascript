import {
  useState,
  useCallback,
  useMemo,
  createContext,
  ReactNode,
  ChangeEventHandler,
} from "react";
import { Validator, ValidationError } from "../domain/types";

type FormStatus = "valid" | "invalid";

type RegisterFieldFn = (
  fieldName: string,
  validator?: Validator
) => ChangeEventHandler<HTMLInputElement>;

type RegisterSubmitFn = (
  onSubmit: React.FormEventHandler<HTMLFormElement>
) => React.FormEventHandler<HTMLFormElement>;

export interface IFormContext {
  registerField: RegisterFieldFn;
  registerSubmit: RegisterSubmitFn;
  values: Record<string, string>;
  status: FormStatus;
}

const initialContextValues: IFormContext = {
  registerField: () => () => {
    return null;
  },
  registerSubmit: () => () => {
    return null;
  },
  values: {},
  status: "valid",
};

export const FormContext = createContext<IFormContext>(initialContextValues);

type FormProviderProps = {
  children?: ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const [status, setStatus] = useState<FormStatus>("valid");
  const [values, setValues] = useState<Record<string, string>>({});
  const [validators, setValidators] = useState<
    Record<string, Validator<string>>
  >({});
  const [errors, setErrors] = useState<Record<string, ValidationError>>({});

  const registerField = useCallback<RegisterFieldFn>(
    (fieldName, validator) => {
      if (validator) {
        setValidators((v) => ({ ...v, [fieldName]: validator }));
      }

      return (e) => {
        setValues((v) => ({ ...v, [fieldName]: e.currentTarget.value }));
        if (validator && status === "invalid") {
          setErrors({});
        }
      };
    },
    [status, setValidators]
  );

  const registerSubmit = useCallback<RegisterSubmitFn>(
    (onSubmit) => {
      return (e) => {
        e.preventDefault();

        Object.entries(values).forEach(([fieldName, value]) => {
          if (fieldName in validators) {
            const validate = validators[fieldName];
            const error = validate(value);
            if (error) {
              setErrors((e) => ({ ...e, [fieldName]: error }));
            }
          }
        });

        if (Object.keys(errors)) {
          setStatus("invalid");
          return;
        }

        onSubmit(e);
      };
    },
    [values, validators, errors]
  );

  const value = useMemo<IFormContext>(
    () => ({
      registerField,
      registerSubmit,
      values,
      status,
    }),
    [registerField, registerSubmit, status, values]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

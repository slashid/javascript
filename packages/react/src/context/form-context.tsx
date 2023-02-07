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
  validator?: Validator<string>
) => ChangeEventHandler<HTMLInputElement>;

type RegisterSubmitFn = (
  onSubmit: React.FormEventHandler<HTMLFormElement>
) => React.FormEventHandler<HTMLFormElement>;

export interface IFormContext {
  registerField: RegisterFieldFn;
  registerSubmit: RegisterSubmitFn;
  resetForm: () => void;
  values: Record<string, string>;
  errors: Record<string, ValidationError>;
  status: FormStatus;
}

const initialContextValues: IFormContext = {
  registerField: () => () => {
    return null;
  },
  registerSubmit: () => () => {
    return null;
  },
  resetForm: () => {
    return null;
  },
  values: {},
  errors: {},
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
      if (values[fieldName] === undefined) {
        setValues((v) => ({ ...v, [fieldName]: "" }));
      }

      if (!validators[fieldName] && validator) {
        setValidators((v) => ({ ...v, [fieldName]: validator }));
      }

      return (e) => {
        setValues((v) => ({ ...v, [fieldName]: e.target.value }));
        if (validator && status === "invalid") {
          setStatus("valid");
          setErrors({});
        }
      };
    },
    [status, setValidators, values, validators]
  );

  const registerSubmit = useCallback<RegisterSubmitFn>(
    (onSubmit) => {
      return (e) => {
        e.preventDefault();

        let hasError = false;

        Object.entries(values).forEach(([fieldName, value]) => {
          if (fieldName in validators) {
            const validate = validators[fieldName];
            const error = validate(value);
            if (error) {
              hasError = true;
              setErrors((e) => ({ ...e, [fieldName]: error }));
            }
          }
        });

        if (hasError) {
          setStatus("invalid");
          return;
        }

        onSubmit(e);
      };
    },
    [values, validators]
  );

  const resetForm = useCallback(() => {
    setValues({});
    setErrors({});
    setValidators({});
    setStatus("valid");
  }, [setValues, setErrors, setValidators, setStatus]);

  const value = useMemo<IFormContext>(
    () => ({
      registerField,
      registerSubmit,
      resetForm,
      values,
      status,
      errors,
    }),
    [registerField, registerSubmit, status, values, errors, resetForm]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

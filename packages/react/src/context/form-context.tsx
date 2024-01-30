import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  ReactNode,
  ChangeEventHandler,
} from "react";
import { Validator, ValidationError } from "../domain/types";

export type FormStatus = "valid" | "invalid";

type RegisteredFieldOptions = {
  defaultValue?: string;
  validator?: Validator<string>;
};

type RegisterFieldFn = (
  fieldName: string,
  opts: RegisteredFieldOptions
) => ChangeEventHandler<HTMLInputElement>;

type RegisterSubmitFn = (
  onSubmit: React.FormEventHandler<HTMLFormElement>
) => React.FormEventHandler<HTMLFormElement>;

type SetErrorFn = (fieldName: string, error: ValidationError) => void;
type HasErrorFn = (fieldName: string) => boolean;
type ClearErrorFn = (fieldName: string) => void;

export interface IFormContext {
  registerField: RegisterFieldFn;
  registerSubmit: RegisterSubmitFn;
  resetForm: () => void;
  setError: SetErrorFn;
  hasError: HasErrorFn;
  clearError: ClearErrorFn;
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
  setError: () => null,
  hasError: () => false,
  clearError: () => null,
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
  const [errors, setErrors] = useState<Record<string, ValidationError>>({});

  const registeredFields = useRef<Record<string, RegisteredFieldOptions>>({});

  const registerField = useCallback<RegisterFieldFn>(
    (fieldName, { validator, defaultValue } = {}) => {
      if (!Object.keys(registeredFields.current).includes(fieldName)) {
        registeredFields.current[fieldName] = {
          defaultValue: defaultValue,
          validator: validator,
        };
      }

      return (e) => {
        setValues((v) => ({ ...v, [fieldName]: e.target.value }));
        if (validator && status === "invalid") {
          setStatus("valid");
          setErrors({});
        }
      };
    },
    [status]
  );

  useEffect(() => {
    Object.entries(registeredFields.current).forEach(
      ([field, { defaultValue }]) => {
        if (defaultValue && values[field] === undefined) {
          setValues((v) => ({ ...v, [field]: defaultValue }));
        }
      }
    );
  }, [values]);

  const registerSubmit = useCallback<RegisterSubmitFn>(
    (onSubmit) => {
      return (e) => {
        e.preventDefault();

        let hasError = false;

        Object.entries(registeredFields.current).forEach(
          ([fieldName, { validator }]) => {
            const value = values[fieldName];

            if (validator) {
              const error = validator(value);
              if (error) {
                hasError = true;
                setErrors((e) => ({ ...e, [fieldName]: error }));
              }
            }
          }
        );

        if (hasError) {
          setStatus("invalid");
          return;
        }

        onSubmit(e);
      };
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues({});
    setErrors({});
    setStatus("valid");
    registeredFields.current = {};
  }, [setValues, setErrors, setStatus]);

  // used to set errors from the outside
  const setError = useCallback<SetErrorFn>((fieldName, error) => {
    setErrors((e) => ({ ...e, [fieldName]: error }));
  }, []);

  const hasError = useCallback<HasErrorFn>(
    (fieldName) => {
      return Boolean(errors[fieldName]);
    },
    [errors]
  );

  const clearError = useCallback<ClearErrorFn>((fieldName) => {
    setErrors((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...rest } = { ...e };
      return rest;
    });
  }, []);

  const value = useMemo<IFormContext>(
    () => ({
      registerField,
      registerSubmit,
      resetForm,
      setError,
      hasError,
      clearError,
      values,
      status,
      errors,
    }),
    [
      registerField,
      registerSubmit,
      resetForm,
      setError,
      hasError,
      clearError,
      values,
      status,
      errors,
    ]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

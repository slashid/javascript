import { useContext } from "react";
import { FormContext } from "../context/form-context";

export const useForm = () => useContext(FormContext);

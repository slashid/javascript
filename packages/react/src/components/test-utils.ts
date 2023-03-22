import { screen, fireEvent } from "@testing-library/react";
import { TEXT } from "./text/constants";

export const inputEmail = (
  value: string,
  inputPlaceholder: string = TEXT["initial.handle.phone.email"]
) => {
  const input = screen.getByPlaceholderText(inputPlaceholder);
  fireEvent.change(input, { target: { value } });
};

export const inputPhone = (
  value: string,
  inputPlaceholder: string = TEXT["initial.handle.phone.placeholder"]
) => {
  const input = screen.getByPlaceholderText(inputPlaceholder);
  fireEvent.change(input, { target: { value } });
};

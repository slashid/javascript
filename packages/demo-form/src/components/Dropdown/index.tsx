import { FC, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import parseOptionString from "../../helpers/parseOptionString";

import ChevronDown from "../Icons/ChevronDown";
import ChevronUp from "../Icons/ChevronUp";

import css from "./dropdown.module.css";
import Checkmark from "../Icons/Checkmark";

interface Props {
  changeChosenOption: (option: string) => void;
  chosenOption?: string;
  isSmall?: boolean;
  label: string;
  optionPlaceholder: string;
  options: undefined | string[];
}

const Dropdown: FC<Props> = ({
  changeChosenOption,
  chosenOption,
  isSmall,
  label,
  optionPlaceholder,
  options,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={`${css.host} ${isSmall ? css.small : ""}`}>
      <DropdownMenu.Root onOpenChange={(open) => setIsDropdownOpen(open)}>
        <p className={css.label}>{label}</p>

        <DropdownMenu.Trigger asChild disabled={options === undefined}>
          <div
            className={`${css.dropdownTrigger} ${
              isDropdownOpen ? css.open : ""
            }`}
            tabIndex={1}
          >
            <span
              className={`${css.chosenOption} ${
                !chosenOption ? css.placeholder : ""
              }`}
            >
              {chosenOption
                ? parseOptionString(chosenOption)
                : optionPlaceholder}
            </span>
            <i className={css.chevron}>
              {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </i>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={10}
          className={`${css.optionsContainer} ${
            isDropdownOpen ? css.open : ""
          }`}
        >
          {options?.map((option, key) => {
            return (
              <DropdownMenu.Item
                tabIndex={key + 1}
                onSelect={() => changeChosenOption(option)}
                key={key}
                className={`${css.option} ${
                  option === chosenOption ? css.selected : ""
                }`}
              >
                {option === chosenOption && (
                  <i className={css.checkmark}>
                    <Checkmark />
                  </i>
                )}
                {parseOptionString(option)}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default Dropdown;

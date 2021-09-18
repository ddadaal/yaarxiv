import React, { useState, useEffect } from "react";
import { ButtonInput } from "./ButtonInput";
import { Search } from "grommet-icons";
import { BoxProps, Keyboard } from "grommet";

interface Props {
  initialText: string;
  onConfirm: (value: string) => void;
  boxProps?: BoxProps;
}

export const SearchBar: React.FC<Props> = ({ initialText, onConfirm, boxProps }) => {
  const [value, setValue] = useState(initialText);

  useEffect(() => {
    setValue(initialText);
  }, [initialText]);

  return (
    <Keyboard onEnter={() => onConfirm(value)}>
      <ButtonInput
        value={value}
        onChange={setValue}
        onConfirm={onConfirm}
        boxProps={boxProps}
      >
        <Search />
      </ButtonInput>
    </Keyboard>
  );
};

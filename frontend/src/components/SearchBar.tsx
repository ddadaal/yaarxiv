import React, { useState, useEffect } from "react";
import { ButtonInput } from "./ButtonInput";
import { Search } from "grommet-icons";

interface Props {
  initialText: string;
  onConfirm: (value: string) => void;
}

export const SearchBar: React.FC<Props> = ({ initialText, onConfirm }) => {
  const [value, setValue] = useState(initialText);

  useEffect(() => {
    setValue(initialText);
  }, [initialText]);

  return (
    <ButtonInput
      value={value}
      onChange={setValue}
      onConfirm={onConfirm}
    >
      <Search />
    </ButtonInput>
  );
};

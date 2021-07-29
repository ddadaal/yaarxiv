import { Box, CheckBox, TextInput } from "grommet";
import React from "react";

export interface CheckboxInputValue {
  value: string;
  checked: boolean;
}

interface Props {
  value?: CheckboxInputValue;
  onChange?: (value: CheckboxInputValue) => void;

  checkboxLabel?: React.ReactNode;
}

export const CheckboxInput: React.FC<Props> = ({
  value = { value: "", checked: false }, onChange,
  checkboxLabel,
}) => {
  return (
    <Box direction="row" align="center" gap="medium">
      <Box flex>
        <TextInput
          value={value.value}
          onChange={(e) => onChange?.({  ...value, value: e.target.value })}
        />
      </Box>
      <Box>
        <CheckBox
          checked={value.checked}
          onChange={(e) => onChange?.({ ...value, checked: e.target.checked })}
          label={checkboxLabel}
        />
      </Box>
    </Box>
  );
};

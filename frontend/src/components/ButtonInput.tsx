import React, {  } from "react";
import { TextInput, Box, Button } from "grommet";

interface Props {
  value: string;
  onChange?: (newValue: string) => void;
  onConfirm?: (value: string) => void;
}

export const ButtonInput: React.FC<Props> = ({
  value,
  onConfirm,
  onChange,
  children,
}) => {
  return (
    <Box
      width="medium"
      direction="row"
      align="center"
      round="small"
      border
    >
      <TextInput
        plain
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Button margin="xsmall" onClick={() => onConfirm?.(value)}>
        {children}
      </Button>
    </Box>
  );

};

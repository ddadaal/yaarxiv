import React from "react";
import { TextInput, Box, Button, TextInputProps, Keyboard } from "grommet";

interface Props extends TextInputProps {
  value: string;
  onChange?: (newValue: string) => void;
  onConfirm?: (value: string) => void;
}

export const ButtonInput: React.FC<Props> = ({
  value,
  onConfirm,
  onChange,
  children,
  ...rest
}) => {

  const confirm = () => {
    onConfirm?.(value);
  };

  return (
    <Keyboard onEnter={confirm}>
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
          {...rest}
        />
        <Button margin="xsmall" onClick={confirm}>
          {children}
        </Button>
      </Box>
    </Keyboard>
  );

};

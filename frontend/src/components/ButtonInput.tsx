import React from "react";
import { TextInput, Box, Button, Keyboard, BoxProps } from "grommet";

interface Props {
  value: string;
  onChange?: (newValue: string) => void;
  onConfirm?: (value: string) => void;
  boxProps?: BoxProps;
}

export const ButtonInput: React.FC<Props> = ({
  value,
  onConfirm,
  onChange,
  children,
  boxProps,
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
        {...boxProps}
      >
        <TextInput
          plain
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <Button margin="xsmall" onClick={confirm}>
          {children}
        </Button>
      </Box>
    </Keyboard>
  );

};

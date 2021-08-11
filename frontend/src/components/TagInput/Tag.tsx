import { Box, Text, Button, BoxProps } from "grommet";
import { FormClose } from "grommet-icons";
import React from "react";

interface Props {
  onRemove?: () => void;
  disabled?: boolean;
  boxProps?: BoxProps;
}

export const Tag: React.FC<Props> = ({
  children,
  onRemove,
  disabled = false,
  boxProps,
}) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={"xsmall"}
      margin={"xsmall"}
      round="small"
      {...boxProps}
    >
      <Text size="small" margin={{ right: "xsmall" }}>
        {children}
      </Text>
      {onRemove && <FormClose size="small" color="white" />}
    </Box>
  );

  if (onRemove) {
    return <Button disabled={disabled} onClick={onRemove}>{tag}</Button>;
  }
  return tag;
};


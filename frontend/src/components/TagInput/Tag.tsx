import { Box, Text, Button } from "grommet";
import { FormClose } from "grommet-icons";
import React from "react";

interface Props {
  onRemove: () => void;
  disabled?: boolean;
}

export const Tag: React.FC<Props> = ({ children, onRemove, disabled = false  }) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ horizontal: "xsmall", vertical: "xxsmall" }}
      margin={"xxsmall"}
      round="medium"
    >
      <Text size="xsmall" margin={{ right: "xxsmall" }}>
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


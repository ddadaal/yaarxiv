import { Box, Text, BoxProps, Anchor } from "grommet";
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
  return (
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
      {onRemove && (
        <Anchor onClick={() => !disabled && onRemove()}>
          <FormClose
            size="small" color="white"
            onClick={() => !disabled && onRemove()}
          />
        </Anchor>
      )}
    </Box>
  );
};


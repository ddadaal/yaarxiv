import React from "react";
import { BoxProps, Box, Heading } from "grommet";

interface Props extends BoxProps {
}

export const Section: React.FC<Props> = ({
  children,
  // elevation = "small",
  // border = "all",
  gap = "small",
  pad = "small",
  ...rest
}) => {
  return (
    <Box
      gap={gap}
      // border={border}
      pad={pad} {...rest}
    >
      {children}
    </Box>
  );
};

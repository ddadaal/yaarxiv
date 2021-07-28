import React from "react";

import { Box, BoxProps } from "grommet";

interface ListItemProps extends BoxProps {
  index: number;
}

export const ListItem: React.FC<ListItemProps> = (props) => (
  <Box
    as="li"
    border={props.index ? "bottom" : "horizontal"}
    pad="small"
    direction="row"
    hoverIndicator
    {...props}

  />
);


export const List: React.FC<BoxProps> = (props) => (
  <Box
    as="ul"
    margin="none"
    pad="none"
    {...props}
  />
);

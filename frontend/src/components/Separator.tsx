import React from "react";
import { Box } from "grommet";
import styled from "styled-components";

interface Props {
  side: "vertical" | "horizontal";
}

export const Separator: React.FC<Props> = ({ side }) => {
  return (
    <Box as="hr" border={{ side , size: "small", color: "light-1" }} />
  );
};

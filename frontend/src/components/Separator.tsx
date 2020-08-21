import React from "react";
import { Box } from "grommet";
import styled from "styled-components";

const Hr = styled.hr`
  border-top: 1px solid ${(props) => props.theme.global.colors["light-2"]};
  width: 100%;
`;

export const Separator: React.FC = (props) => {
  return (
    // <Box border={{ side: "bottom", size: "small", color: "light-1" }} />
    <Hr />
  );
};

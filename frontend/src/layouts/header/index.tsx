import React from "react";
import { Header as GrommetHeader, Box, BoxProps } from "grommet";
import { AnchorLink } from "src/components/AnchorLink";
import styled from "styled-components";
import { MainNav } from "./MainNav";
import { HeaderLogo } from "src/layouts/header/HeaderLogo";

const FlexAnchorLink = styled(AnchorLink)`
  display: flex;
`;

interface Props {
  width: BoxProps["width"];
}

export const Header: React.FC<Props> = ({ width }) => {
  return (
    <GrommetHeader
      background="background"
      pad="small"
      border={{ side: "bottom" }}
      align="center"
      justify="center"
      height="xxsmall"
    >
      <Box width={width}>
        <Box fill direction="row" justify="between" align="stretch">
          <Box height="32px" direction="column" justify="center">
            <FlexAnchorLink href="/">
              <HeaderLogo height="32px" />
            </FlexAnchorLink>
          </Box>
          <Box direction="row" align="center" gap="small">
            <MainNav />
          </Box>
        </Box>
      </Box>
    </GrommetHeader>
  );
};

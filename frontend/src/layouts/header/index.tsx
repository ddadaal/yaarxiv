import React from "react";
import { Header as GrommetHeader, Box, BoxProps } from "grommet";
import { AnchorLink } from "src/components/AnchorLink";
import { Logo } from "src/components/Logo";
import styled from "styled-components";
import { MainNav } from "./MainNav";

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
          <Box width="xsmall" direction="column" justify="center">
            <FlexAnchorLink href="/">
              <Logo />
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

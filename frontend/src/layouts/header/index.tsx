import React from "react";
import { Header as GrommetHeader, Box, Avatar, Anchor, Nav } from "grommet";
import { UserIndicator } from "./UserIndicator";
import { AnchorLink } from "src/components/AnchorLink";
import { Logo } from "src/components/Logo";
import styled from "styled-components";

const FlexAnchorLink = styled(AnchorLink)`
  display: flex;
`;

export const Header: React.FC = (props) => {
  return (
    <GrommetHeader
      background="background"
      pad="small"
      elevation="small"
      border={{ side: "bottom" }}
      justify="between"
      align="stretch"
    >
      <Box direction="column" justify="center">
        <FlexAnchorLink href="/">
          <Logo style={{ maxHeight: "32px" }} />
        </FlexAnchorLink>
      </Box>
      <Box direction="row" align="center" gap="small">
        <UserIndicator />
      </Box>
    </GrommetHeader>
  );
};

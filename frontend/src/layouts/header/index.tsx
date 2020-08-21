import React from "react";
import { Header as GrommetHeader, Box, Avatar, Anchor, Nav } from "grommet";
import { UserIndicator } from "./UserIndicator";
import { AnchorLink } from "src/components/AnchorLink";


export const Header: React.FC = (props) => {
  return (
    <GrommetHeader
      background="background-contrast"
      pad="medium"
      // elevation="small"
      border={{ side: "bottom" }}
    >
      <Box direction="row" align="center" gap="small">
        {/* <Avatar src={gravatarSrc} /> */}
        <AnchorLink href="/">
          yaarxiv
        </AnchorLink>
      </Box>
      <Box direction="row" align="center" gap="small">
        {/* <LanguageSelector /> */}
        <UserIndicator />
      </Box>
    </GrommetHeader>
  );
};

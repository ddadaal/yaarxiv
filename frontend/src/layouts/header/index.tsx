import React from "react";
import { Header as GrommetHeader, Box, Avatar, Anchor, Nav } from "grommet";
import { lang } from "src/i18n";
import { LanguageSelector } from "./LanguageSelector";
import { UserIndicator } from "./UserIndicator";
import { AnchorLink } from "src/components/AnchorLink";


export const Header: React.FC = (props) => {
  return (
    <GrommetHeader background="dark-1" pad="small">
      <Box direction="row" align="center" gap="small">
        {/* <Avatar src={gravatarSrc} /> */}
        <AnchorLink color="white" href="/">
          yaarxiv
        </AnchorLink>
      </Box>
      <Box direction="row" align="center" gap="small">
        <UserIndicator />
        {/* <LanguageSelector /> */}
      </Box>
    </GrommetHeader>
  );
};

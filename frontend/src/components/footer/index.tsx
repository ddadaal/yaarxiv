import React from "react";
import { Text, Footer as GrommotFooter } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

const root = lang.footer;

export const Footer: React.FC = () => {
  return (
    <GrommotFooter background="light-4" justify="center" pad="small">
      <Text textAlign="center" size="small">
        © 2020 <LocalizedString id={root.copyright} />
      </Text>
    </GrommotFooter>
  );
};

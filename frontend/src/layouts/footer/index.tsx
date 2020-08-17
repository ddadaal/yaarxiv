import React from "react";
import { Text, Footer as GrommotFooter, Anchor, Box } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang, useI18nStore, allLanguages } from "src/i18n";

const root = lang.footer;

const I18nColumn: React.FC = () => {
  const i18nStore = useI18nStore();

  return (
    <Text textAlign="center" size="small">
      {allLanguages.map((i) => (
        <Anchor
          margin={"small"}
          onClick={() => i18nStore.changeLanguage(i.id)}
          key={i.name}
          disabled={i18nStore.currentLanguage.id === i.id}
        >
          {i.name}
        </Anchor>
      ))}
    </Text>
  );
};

export const Footer: React.FC = () => {
  return (
    <GrommotFooter background="light-4" justify="center" pad="small">
      <Box>
        <I18nColumn />
      </Box>
      <Box>
        <Text textAlign="center" size="small">
        © 2020 <LocalizedString id={root.copyright} />
        </Text>
      </Box>
    </GrommotFooter>

  );
};

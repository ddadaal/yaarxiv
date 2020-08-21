import React from "react";
import { Text, Footer as GrommotFooter, Anchor, Box, Button } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang, useI18nStore, allLanguages } from "src/i18n";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { Sun, Moon } from "grommet-icons";

const root = lang.footer;

const LanguageSwitcher: React.FC = () => {
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

  const { theme, changeTheme } = useStore(ThemeStore);

  return (
    <GrommotFooter
      background="background-contrast"
      justify="center" pad="small" border={{ side: "top" }}
    >
      <Box>
        <LanguageSwitcher />
      </Box>
      <Box>
        <Text textAlign="center" size="small">
        © 2020 <LocalizedString id={root.copyright} />
        </Text>
      </Box>
      <Box alignSelf="end">
        <Button onClick={changeTheme}>
          {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
      </Box>
    </GrommotFooter>

  );
};

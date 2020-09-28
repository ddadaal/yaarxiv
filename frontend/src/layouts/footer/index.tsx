import React from "react";
import { Text, Footer as GrommotFooter, Anchor, Box, Button } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang, useI18nStore, languageNames, saveLanguageToCookie } from "src/i18n";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { Moon, Sun } from "grommet-icons";

const root = lang.footer;

const LanguageSwitcher: React.FC = () => {
  const i18nStore = useI18nStore();

  const onClick = (id: string) => () =>  {
    saveLanguageToCookie(id);
    i18nStore.changeLanguage(id);
  };

  return (
    <Text textAlign="center" size="small">
      {Object.keys(languageNames).map((id) => (
        <Anchor
          margin={"small"}
          onClick={onClick(id)}
          key={id}
          disabled={i18nStore.currentLanguage.id === id}
        >
          {languageNames[id]}
        </Anchor>
      ))}
    </Text>
  );
};

const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useStore(ThemeStore);

  const switchTheme = () => changeTheme(theme === "light" ? "dark" : "light");

  return (
    <Button onClick={switchTheme}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};

export const Footer: React.FC = () => {

  return (
    <GrommotFooter
      background="background"
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
        <ThemeSwitcher />
      </Box>
    </GrommotFooter>

  );
};

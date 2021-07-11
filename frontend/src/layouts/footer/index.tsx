import React from "react";
import { Text, Footer as GrommotFooter, Anchor, Box, Button } from "grommet";
import { languageProps, saveLanguageToCookie, Localized, useI18n } from "src/i18n";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { Moon, Sun } from "grommet-icons";

const LanguageSwitcher: React.FC = () => {
  const i18nStore = useI18n();

  const onClick = (id: string) => () =>  {
    saveLanguageToCookie(id);
    i18nStore.setLanguageById(id);
  };

  return (
    <Text textAlign="center" size="small">
      {Object.keys(languageProps).map((id) => (
        <Anchor
          margin={"small"}
          onClick={onClick(id)}
          key={id}
          disabled={i18nStore.currentLanguage.id === id}
        >
          {languageProps[id].name}
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
          © 2020 <Localized id="footer.copyright" />
        </Text>
      </Box>
      <Box alignSelf="end">
        <ThemeSwitcher />
      </Box>
    </GrommotFooter>

  );
};

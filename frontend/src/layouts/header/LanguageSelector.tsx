import React from "react";
import { useI18nStore, allLanguages } from "src/i18n";
import { Menu } from "grommet";
import { Globe } from "grommet-icons";

export function LanguageSelector() {
  const i18nStore = useI18nStore();

  const { currentLanguage, changeLanguage } = i18nStore;

  const menus = React.useMemo(() =>
    allLanguages
      .map((x) => ({
        label: x.name,
        onClick: () => changeLanguage(x.id),
      })), [currentLanguage]);

  return (
    <Menu
      label={<span><Globe /></span>}
      items={menus}
    />
  );
}

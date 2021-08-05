import { useI18n } from "src/i18n";

interface Props {
  info: {
    cnTitle?: string;
    enTitle?: string;
  }
}

export const ArticleTitleOfLang: React.FC<Props> = ({ info: { cnTitle, enTitle } }) => {
  const i18n = useI18n();

  const child = cnTitle
    ? enTitle
      ? i18n.currentLanguage.id === "cn"
        ? cnTitle : enTitle
      : cnTitle
    : enTitle
      ? enTitle
      : undefined;

  return <>{child}</>;
};


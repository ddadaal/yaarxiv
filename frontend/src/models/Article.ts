import { useI18n } from "src/i18n";
import { ArticleInfoI18nPart, Author } from "yaarxiv-api/api/article/models";

export function useLocalizedArticleInfo(info: ArticleInfoI18nPart) {
  const { currentLanguage: { id } } = useI18n();

  function extract(lang: "cn" | "en") {
    return {
      lang,
      title: info[lang+"Title"]! as string,
      keywords: info[lang+"Keywords"]! as string[],
    };
  }

  if (id === "cn") {
    if (info.cnTitle) {
      return {
        main: extract("cn"),
        alt: info.enTitle
          ? extract("en")
          : undefined,
      };
    } else {
      return {
        main: extract("en"),
        alt: undefined,
      };
    }
  } else {
    if (info.enTitle) {
      return {
        main: extract("en"),
        alt: info.cnTitle
          ? extract("cn")
          : undefined,
      };
    } else {
      return {
        main: extract("cn"),
        alt: undefined,
      };
    }

  }


}

export function authorEquals(a1: Author, a2: Author) {
  return a1.name === a2.name && a1.affiliation === a2.affiliation;
}

import { ArticleInfoI18nPart } from "yaarxiv-api/api/article/models";

export function articleInfoMultiLangPartToLangMap(info: ArticleInfoI18nPart) {
  return {
    cn: { title: info.cnTitle, keywords: info.cnKeywords },
    en: { title: info.enTitle, keywords: info.enKeywords },
  };
}

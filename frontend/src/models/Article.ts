import { ArticleInfoI18nPart } from "yaarxiv-api/api/article/models";

export function articleInfoMultiLangPartToLangMap({
  cnKeywords, cnTitle,
  enKeywords, enTitle,
}: ArticleInfoI18nPart) {
  return {
    cn: cnTitle ? { title: cnTitle ?? "", keywords: cnKeywords ?? []} : undefined,
    en: enTitle ? { title: enTitle, keywords: enKeywords ?? []} : undefined,
  };
}

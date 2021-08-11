import { ArticleInfoI18nPart, Author } from "yaarxiv-api/api/article/models";

export function articleInfoMultiLangPartToLangMap({
  cnKeywords, cnTitle,
  enKeywords, enTitle,
}: ArticleInfoI18nPart) {
  return {
    cn: cnTitle ? { title: cnTitle ?? "", keywords: cnKeywords ?? []} : undefined,
    en: enTitle ? { title: enTitle, keywords: enKeywords ?? []} : undefined,
  };
}

export function authorEquals(a1: Author, a2: Author) {
  return a1.name === a2.name && a1.affiliation === a2.affiliation;
}

import type { ArticleInfoMultiLangPart } from "yaarxiv-api/api/article/models";

export function articleInfoMultiLangPartToLangMap(info: ArticleInfoMultiLangPart) {
  return {
    cn: "cnTitle" in info
      ? { title: info.cnTitle, keywords: info.cnKeywords } : undefined,
    en: "enTitle" in info
      ? { title: info.enTitle, keywords: info.enKeywords } : undefined,
  };
}

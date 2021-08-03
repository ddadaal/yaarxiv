export function articleInfoMultiLangPartToLangMap(info: {
  cnTitle?: string;
  enTitle?: string;
  cnKeywords?: string[];
  enKeywords?: string[];
}) {
  return {
    cn: { title: info.cnTitle, keywords: info.cnKeywords },
    en: { title: info.enTitle, keywords: info.enKeywords },
  };
}

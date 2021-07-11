import { parseCookies, setCookie } from "nookies";
import { languageDictionary, createI18n, TextIdFromLangDict } from "react-typed-i18n";
import { Awaited } from "yaarxiv-api/api/utils/schema";

const en = () => import("./en").then((x) => x.default);
const cn = () => import("./cn").then((x) => x.default);

export const languages = languageDictionary({ cn, en });

export const { Localized, Provider, useI18n, id, prefix } = createI18n(languages);

export type Id = TextIdFromLangDict<typeof languages>;

export type Definitions = Awaited<ReturnType<typeof cn>>;


export const languageProps = {
  cn: {
    name: "简体中文",
    langStrings: ["cn", "zh-CN", "zh"],
    detailedId: "zh-CN",
  },
  en: {
    name: "English",
    langStrings: ["en", "en-US"],
    detailedId: "en-US",
  },
};

const LANG_STORAGE_KEY = "simstate-i18n-lang";
const COOKIE_PATH = "/";

type Ctx = Parameters<typeof parseCookies>[0];

export function getCookieLanguage(ctx?: Ctx): keyof typeof languages {
  const cookie = parseCookies(ctx)[LANG_STORAGE_KEY];

  return (cookie in languages) ? cookie as keyof typeof languages : "cn";
}

export function saveLanguageToCookie(language: string) {
  setCookie(null, LANG_STORAGE_KEY, language, {
    maxAge: 30 * 24 * 60 * 60,
    path: COOKIE_PATH,
  });
}

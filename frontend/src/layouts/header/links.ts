import { lang } from "src/i18n";

export type TLink = {
  mode?: "startsWith" | "exact";
  textId: string;
  href?: string;
  onClick?: () => void;
};

const root = lang.header;

export const commonLinks = [
  { href: "/", textId: root.home, mode: "exact" },
  { href: "/search", textId: root.search, mode: "startsWith" },
  // { href: "/about", textId: root.about, mode: "startsWith" },
] as TLink[];

export const userLinks = [
  { href: "/upload", textId: root.upload, mode: "startsWith" },
  { href: "/dashboard", textId: root.dashboard, mode: "startsWith" },
] as TLink[];

export const adminLinks = [
  { href: "/admin/articles", textId: root.admin.articles, mode: "startsWith" },
  { href: "/admin/users", textId: root.admin.users, mode: "startsWith" },
] as TLink[];

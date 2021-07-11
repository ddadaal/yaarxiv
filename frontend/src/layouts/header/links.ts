import type { UrlObject } from "url";
import type { Id } from "src/i18n";

export type TLink = {
  mode?: "startsWith" | "exact";
  textId: Id;
  href?: string | UrlObject;
  onClick?: () => void;
};

export const commonLinks = [
  { href: "/", textId: "header.home", mode: "exact" },
  { href: "/search", textId: "header.search", mode: "startsWith" },
  // { href: "/about", textId: "header.about, mode: "startsWith" },
] as TLink[];

export const userLinks = [
  { href: "/upload", textId: "header.upload", mode: "startsWith" },
  { href: "/dashboard", textId: "header.dashboard", mode: "startsWith" },
] as TLink[];

export const adminLinks = [
  { href: "/admin/articles", textId: "header.admin.articles", mode: "startsWith" },
  { href: "/admin/users", textId: "header.admin.users", mode: "startsWith" },
] as TLink[];

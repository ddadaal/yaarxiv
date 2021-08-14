import urljoin from "url-join";
import { config } from "@/core/config";

export function getUrlFromTemplate(template: string, parameter?: string) {
  const base = config.frontendUrl;

  const pathname = template.replace("{}", parameter ?? "");

  return urljoin(base, pathname);

}

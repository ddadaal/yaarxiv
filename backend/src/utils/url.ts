import urljoin from "url-join";
import { config } from "@/utils/config";

export function getUrlFromTemplate(template: string, parameter?: string) {
  const base = config.frontendUrl;

  const pathname = template.replace("{}", parameter ?? "");

  return urljoin(base, pathname);

}

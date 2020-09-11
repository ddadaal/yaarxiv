import { config } from "src/utils/config";
import urljoin from "url-join";

export function getStaticFileUrl(path: string) {
  return urljoin(config.staticRoot, path);
}

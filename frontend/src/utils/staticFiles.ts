import { config } from "src/utils/config";
import urljoin from "url-join";

export function getServerStaticFileUrl(path: string) {
  return urljoin(config.serverStaticFileRoot, path);
}

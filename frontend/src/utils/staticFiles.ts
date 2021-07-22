import urljoin from "url-join";
import { config } from "./config";

export function getStaticFileUrl(path: string) {
  return urljoin(
    config.staticFileRoot,
    path
  );
}

export function basename(path: string) {
  const parts = path.split(/[\/\\]/);
  return parts[parts.length - 1];
}

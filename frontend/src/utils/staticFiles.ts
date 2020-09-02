import urljoin from "url-join";

export function getStaticFileUrl(path: string) {
  return urljoin(process.env.NEXT_PUBLIC_STATIC_ROOT as string, path);
}

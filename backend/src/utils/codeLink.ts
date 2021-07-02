import createHttpError from "http-errors";
import { ACCEPTABLE_CODE_SITES, getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";



export function validateCodeLink(codeLink?: string) {
  if (codeLink) {
    const link = getCodeLinkInfo(codeLink);
    if (!link) {
      throw createHttpError(400, `
      codeLink is not valid.
      Should be a link to repo in sites ${Object.values(ACCEPTABLE_CODE_SITES).join(", ")}
      `);
    }
  }
}

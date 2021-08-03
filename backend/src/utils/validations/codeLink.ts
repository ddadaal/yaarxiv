import createHttpError from "fastify-error";
import { ACCEPTABLE_CODE_SITES, getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";

const CodeLinkValidationError = createHttpError("YAARXIV_BAD_CODELINK", `
  codeLink is not valid.
  Should be a link to repo in sites ${Object.values(ACCEPTABLE_CODE_SITES).join(", ")}
`, 400);

export function validateCodeLink(codeLink?: string) {
  if (codeLink) {
    const link = getCodeLinkInfo(codeLink);
    if (!link) {
      throw new CodeLinkValidationError();
    }
  }
}

import createError from "fastify-error";
import { validateArticleInfoI18nConstraints as doValidation } from "yaarxiv-api/api/article/models";

const ArticleInfoI18nConstraintsViolationError = createError("YAARXIV_ARTICLEINFO_I18N_CONSTRAINTS", `
  You must at least fill in title and keywords of one language. You must fill both title and keywords for one language.
`, 400);

export function validateArticleInfoI18nConstraints(info: {
  cnTitle?: string;
  cnKeywords?: string[];
  enTitle?: string;
  enKeywords?: string[];
}) {
  if (!doValidation(info)) {
    throw new ArticleInfoI18nConstraintsViolationError();
  }
}

import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/upload";
import { validateCodeLink } from "@/utils/validations/codeLink";
import { Reference } from "@mikro-orm/core";
import { toRef } from "@/utils/orm";
import { validateFileToken } from "@/utils/validations/fileToken";
import { validateArticleInfoI18nConstraints } from "@/utils/validations/articleInfo";

export const uploadArticleRoute = route(
  api, "UploadArticleSchema",
  async (req) => {
    const { pdfToken, codeLink, ...rest } = req.body;

    validateArticleInfoI18nConstraints(rest);

    const pdf = await validateFileToken(req.em, pdfToken);

    // validate the repo link
    if (codeLink) {
      validateCodeLink(req.body.codeLink);
    }

    const createTime = new Date();

    const article = new Article({
      createTime: createTime,
      lastUpdateTime: createTime,
      owner: req.dbUserRef(),
    });

    const rev = new ArticleRevision({
      pdf: Reference.create(pdf),
      article,
      codeLink,
      revisionNumber: 1,
      category: "",
      time: createTime,
      ...rest,
    });

    article.revisions.add(rev);
    article.latestRevision = toRef(rev);

    await req.em.persistAndFlush(article);

    return { 201: { id: article.id } };

  });

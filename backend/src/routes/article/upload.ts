import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/upload";
import { validateCodeLink } from "@/utils/validations/codeLink";
import { Reference } from "@mikro-orm/core";
import { toRef } from "@/utils/orm";
import { validateFileToken } from "@/utils/validations/fileToken";
import { validateArticleInfoI18nConstraints } from "@/utils/validations/articleInfo";
import path from "path";
import { getPathForArticleFile } from "@/utils/articleFiles";

export const uploadArticleRoute = route(
  api, "UploadArticleSchema",
  async (req, fastify) => {
    const { pdfToken, codeLink, ...rest } = req.body;

    validateArticleInfoI18nConstraints(rest);

    if (codeLink) {
      validateCodeLink(req.body.codeLink);
    }

    const pdf = await validateFileToken(req.em, pdfToken);

    // validate the repo link


    const user = req.dbUserRef();

    const createTime = new Date();

    const article = new Article({
      createTime: createTime,
      lastUpdateTime: createTime,
      owner: user,
    });

    const rev = new ArticleRevision({
      script: Reference.create(pdf),
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

    // move the file to /{user.id}/{article.id}/
    const filename = path.basename(pdf.filePath);
    const newPath = getPathForArticleFile(article, filename);

    await fastify.storage.moveFile(pdf.filePath, newPath);

    pdf.filePath = newPath;

    await req.em.flush();

    return { 201: { id: article.id } };

  });

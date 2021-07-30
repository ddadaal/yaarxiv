import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { UploadedFile } from "@/entities/UploadedFile";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/upload";
import createError from "http-errors";
import { validateCodeLink } from "@/utils/codeLink";
import { Reference } from "@mikro-orm/core";
import { toRef } from "@/utils/orm";

export const uploadArticleRoute = route(
  api, "UploadArticleSchema",
  async (req) => {
    // validate the pdfToken first.
    const pdfRepo = req.em.getRepository(UploadedFile);

    const { pdfToken, codeLink, ...rest } = req.body;

    const pdf = await pdfRepo.findOne(pdfToken);
    if (!pdf) {
      throw createError(400, "PDF token is invalid.");
    }

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

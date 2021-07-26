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
    const pdf = await pdfRepo.findOne(req.body.pdfToken);
    if (!pdf) {
      throw createError(400, "PDF token is invalid.");
    }

    // validate the repo link
    if (req.body.codeLink) {
      validateCodeLink(req.body.codeLink);
    }

    const createTime = new Date();

    const article = new Article({
      createTime: createTime,
      lastUpdateTime: createTime,
      owner: req.dbUserRef(),
    });

    const rev = new ArticleRevision({
      abstract: req.body.abstract,
      authors: req.body.authors.map((x) => ({ name: x })),
      category: "",
      keywords: req.body.keywords,
      pdf: Reference.create(pdf),
      revisionNumber: 1,
      title: req.body.title,
      time: createTime,
      codeLink: req.body.codeLink,
      article,
    });

    article.revisions.add(rev);
    article.latestRevision = toRef(rev);

    await req.em.persistAndFlush(article);

    return { 201: { id: article.id } };

  });

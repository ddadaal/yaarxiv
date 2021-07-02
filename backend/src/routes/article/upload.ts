import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { UploadedFile } from "@/entities/UploadedFile";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/article/upload";
import createError from "http-errors";
import { validateCodeLink } from "@/utils/codeLink";
import { Reference } from "@mikro-orm/core";

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

    const rev = new ArticleRevision();
    rev.abstract = req.body.abstract;
    rev.authors = req.body.authors.map((x) => ({ name: x }));
    rev.category = "";
    rev.keywords = req.body.keywords;
    rev.pdf = pdf;
    rev.revisionNumber = 1;
    rev.title = req.body.title;
    rev.time = createTime;
    rev.codeLink = req.body.codeLink;

    const article = new Article();
    article.createTime = createTime;
    article.lastUpdateTime = createTime;
    article.latestRevision = Reference.create(rev);
    article.owner = req.dbUserRef();

    article.revisions.add(rev);

    await req.em.persistAndFlush(article);

    return { 201: { id: article.id } };

  });

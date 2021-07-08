import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { UploadedFile } from "@/entities/UploadedFile";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/update";
import createError from "http-errors";
import { validateCodeLink } from "@/utils/codeLink";
import { Reference } from "@mikro-orm/core";

export const updateArticleRoute = route(
  api, "UpdateArticleSchema",
  async (req) => {
    // validate the pdfToken first.
    let pdf: UploadedFile | null = null;
    if (req.body.pdfToken) {
      const pdfRepo = req.em.getRepository(UploadedFile);
      pdf = await pdfRepo.findOne({ id: req.body.pdfToken });
      if (!pdf) {
        throw createError(400, "PDF token is invalid.");
      }
    }

    if (req.body.codeLink) {
      validateCodeLink(req.body.codeLink);
    }

    const articleRepo = req.em.getRepository(Article);

    const article = await articleRepo.findOne({
      id: req.params.articleId,
    }, {
      populate: ["latestRevision", "latestRevision.pdf"],
    });

    if (!article) {
      return { 404: null };
    }

    if (article.owner.id !== req.userId()) {
      return { 403: null };
    }

    const time = new Date();

    const latestRev = article.latestRevision.getEntity();

    latestRev.latestRevisionOf = undefined;
    await req.em.flush();

    const revNumber = latestRev.revisionNumber + 1;

    const rev = new ArticleRevision();
    rev.abstract = req.body.abstract ?? latestRev.abstract;
    rev.authors = req.body.authors?.map((x) => ({ name: x })) ?? latestRev.authors;
    rev.article = Reference.create(article);
    rev.category = "";
    rev.keywords = req.body.keywords ?? latestRev.keywords;
    rev.pdf = pdf ? Reference.create(pdf) : latestRev.pdf;
    rev.revisionNumber = revNumber;
    rev.title = req.body.title ?? latestRev.title;
    rev.time = time;
    rev.codeLink = req.body.codeLink ?? latestRev.codeLink;

    req.em.persist(rev);


    rev.latestRevisionOf = rev.article;

    await req.em.flush();

    return { 201: { revisionNumber: revNumber } };

  });

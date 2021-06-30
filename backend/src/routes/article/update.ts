import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { PdfUpload } from "@/entities/PdfUpload";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/article/update";
import createError from "http-errors";
import { validateCodeLink } from "@/utils/codeLink";
import { Reference } from "@mikro-orm/core";

export const updateArticleRoute = route(
  api, "UpdateArticleSchema",
  async (req) => {
    // validate the pdfToken first.
    let pdf: PdfUpload | null = null;
    if (req.body.pdfToken) {
      const pdfRepo = req.em.getRepository(PdfUpload);
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
      return { 404: undefined };
    }

    if (article.owner.id !== req.userId()) {
      return { 403: undefined };
    }

    const time = new Date();

    const latestRev = article.latestRevision.getEntity();
    const revNumber = latestRev.revisionNumber + 1;

    const rev = new ArticleRevision();
    rev.abstract = req.body.abstract ?? latestRev.abstract;
    rev.authors = req.body.authors?.map((x) => ({ name: x })) ?? latestRev.authors;
    rev.article = Reference.create(article);
    rev.category = "";
    rev.keywords = req.body.keywords ?? latestRev.keywords;
    rev.pdf = pdf ?? latestRev.pdf;
    rev.revisionNumber = revNumber;
    rev.title = req.body.title ?? latestRev.title;
    rev.time = time;
    rev.codeLink = req.body.codeLink ?? latestRev.codeLink;

    // IdentifiedReference cannot be set to LoadedReference
    article.latestRevision = Reference.create(rev) as any;

    await req.em.flush();

    return { 201: { revisionNumber: revNumber } };

  });

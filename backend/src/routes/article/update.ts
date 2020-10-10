import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { PdfUpload } from "@/entities/PdfUpload";
import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import * as api from "yaarxiv-api/article/update";
import createError from "http-errors";
import { validateCodeLink } from "@/utils/codeLink";

export async function updateArticleRoute(fastify: FastifyInstance) {
  route<api.UpdateArticleSchema>(fastify, api.endpoint, "UpdateArticleSchema", { authOption: true })(
    async (req) => {
      // validate the pdfToken first.
      let pdf: PdfUpload | undefined = undefined;
      if (req.body.pdfToken) {
        const pdfRepo = fastify.orm.getRepository(PdfUpload);
        pdf = await pdfRepo.findOne(req.body.pdfToken);
        if (!pdf) {
          throw createError(400, "PDF token is invalid.");
        }
      }

      if (req.body.codeLink) {
        validateCodeLink(req.body.codeLink);
      }

      const articleRepo = fastify.orm.getRepository(Article);

      const article = await articleRepo.findOne(req.params.articleId);


      if (!article) {
        return { 404: { } };
      }

      if (article.ownerId !== req.userId()) {
        return { 403: { } };
      }

      const revRepo = fastify.orm.getRepository(ArticleRevision);

      const latestRev = await revRepo.findOne({
        articleId: article.id,
        revisionNumber: article.latestRevisionNumber,
      }, { relations: ["pdf"]});

      if (!latestRev) {
        throw createError(500, "Latest revision does not exists.");
      }

      const time = new Date();
      const revNumber = article.latestRevisionNumber + 1;

      const rev = new ArticleRevision();
      rev.abstract = req.body.abstract ?? latestRev.abstract;
      rev.authors = req.body.authors?.map((x) => ({ name: x })) ?? latestRev.authors;
      rev.article = article;
      rev.category = "";
      rev.keywords = req.body.keywords ?? latestRev.keywords;
      rev.pdf = pdf ?? latestRev.pdf;
      rev.revisionNumber = revNumber;
      rev.title = req.body.title ?? latestRev.title;
      rev.time = time;
      rev.codeLink = req.body.codeLink ?? latestRev.codeLink;

      article.latestRevisionNumber = revNumber;

      await fastify.orm.transaction(async (em) => {
        await em.save(article);
        await em.save(rev);
      });

      return { 201: { revisionNumber: revNumber } };

    });
}

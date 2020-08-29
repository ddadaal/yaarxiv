import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { makeError } from "@/utils/error";
import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import * as api from "yaarxiv-api/article/update";

export async function updateArticleRoute(fastify: FastifyInstance) {
  route<api.UpdateArticleSchema>(fastify, api.endpoint, "UpdateArticleSchema", { authOption: true })(
    async (req) => {
      // should validate the pdfToken first.

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
      });

      if (!latestRev) {
        throw makeError(500, "Latest revision does not exists.");
      }

      const time = new Date();
      const revNumber = article.latestRevisionNumber + 1;

      const rev = new ArticleRevision();
      rev.abstract = req.body.abstract ?? latestRev.abstract;
      rev.authors = req.body.authors?.map((x) => ({ name: x })) ?? latestRev.authors;
      rev.article = article;
      rev.category = "";
      rev.keywords = req.body.keywords ?? latestRev.keywords;
      rev.pdfLink = req.body.pdfToken ?? latestRev.pdfLink;
      rev.revisionNumber = revNumber;
      rev.title = req.body.title ?? latestRev.title;
      rev.time = time;

      article.latestRevisionNumber = revNumber;

      await articleRepo.save(article);
      await revRepo.save(rev);

      return { 201: { revisionNumber: revNumber } };

    });
}

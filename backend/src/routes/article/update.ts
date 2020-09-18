import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { PdfUpload } from "@/entities/PdfUpload";
import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import * as api from "yaarxiv-api/article/update";
import createError from "http-errors";

export async function updateArticleRoute(fastify: FastifyInstance) {
  route<api.UpdateArticleSchema>(fastify, api.endpoint, "UpdateArticleSchema", { authOption: true })(
    async (req) => {
      // validate the pdfToken first.
      let pdf: PdfUpload | null = null;
      if (req.body.pdfToken) {
        const pdfRepo = req.em.getRepository(PdfUpload);
        pdf = await pdfRepo.findOne(req.body.pdfToken);
        if (!pdf) {
          throw createError(400, "PDF token is invalid.");
        }
      }

      const articleRepo = req.em.getRepository(Article);

      const article = await articleRepo.findOne({ id: Number(req.params.articleId) });

      if (!article) {
        return { 404: { } };
      }

      if (article.owner.id !== req.userId()) {
        return { 403: { } };
      }

      const revRepo = req.em.getRepository(ArticleRevision);

      const latestRev = await revRepo.findOne({
        $and: [
          { article: { id: article.id } } ,
          { revisionNumber: article.latestRevisionNumber },
        ],
      }, ["pdf"]);

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

      article.latestRevisionNumber = revNumber;

      req.em.persist(article);
      req.em.persist(rev);
      await req.em.flush();

      return { 201: { revisionNumber: revNumber } };

    });
}

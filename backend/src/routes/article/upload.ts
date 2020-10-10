import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { PdfUpload } from "@/entities/PdfUpload";
import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import * as api from "yaarxiv-api/article/upload";
import createError from "http-errors";

export async function uploadArticleRoute(fastify: FastifyInstance) {
  route<api.UploadArticleSchema>(fastify, api.endpoint, "UploadArticleSchema", { authOption: true })(
    async (req) => {
      // validate the pdfToken first.

      const pdfRepo = fastify.orm.getRepository(PdfUpload);
      const pdf = await pdfRepo.findOne(req.body.pdfToken);
      if (!pdf) {
        throw createError(400, "PDF token is invalid.");
      }

      const articleRepo = fastify.orm.getRepository(Article);

      const createTime = new Date();
      const article = new Article();
      article.createTime = createTime;
      article.lastUpdateTime = createTime;
      article.latestRevisionNumber = 1;
      article.ownerId = req.userId();

      const rev = new ArticleRevision();
      rev.abstract = req.body.abstract;
      rev.authors = req.body.authors.map((x) => ({ name: x }));
      rev.article = article;
      rev.category = "";
      rev.keywords = req.body.keywords;
      rev.pdf = pdf;
      rev.revisionNumber = 1;
      rev.title = req.body.title;
      rev.time = createTime;
      rev.codeLink = req.body.codeLink;

      article.revisions = [rev];

      await articleRepo.save(article);

      return { 201: { id: article.id + "" } };

    });
}

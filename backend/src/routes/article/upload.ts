import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { PdfUpload } from "@/entities/PdfUpload";
import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import * as api from "yaarxiv-api/article/upload";
import createError from "http-errors";
import { User } from "@/entities/User";

export async function uploadArticleRoute(fastify: FastifyInstance) {
  route<api.UploadArticleSchema>(fastify, api.endpoint, "UploadArticleSchema", { authOption: true })(
    async (req) => {
      // validate the pdfToken first.

      const pdfRepo = req.em.getRepository(PdfUpload);
      const pdf = await pdfRepo.findOne(req.body.pdfToken);
      if (!pdf) {
        throw createError(400, "PDF token is invalid.");
      }

      const articleRepo = req.em.getRepository(Article);

      const createTime = new Date();
      const article = new Article();
      article.createTime = createTime;
      article.lastUpdateTime = createTime;
      article.latestRevisionNumber = 1;
      article.owner = req.em.getReference(User, req.userId());

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

      article.revisions.add(rev);

      await articleRepo.persistAndFlush(article);

      return { 201: { id: article.id + "" } };

    });
}

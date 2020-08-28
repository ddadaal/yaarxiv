import { FastifyInstance } from "fastify";
import * as get from "yaarxiv-api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";

export async function getArticleRoute(fastify: FastifyInstance) {
  route<get.GetArticleSchema>(fastify, get.endpoint, "GetArticleSchema", {})(
    async (req) => {
      const { articleId } = req.params;
      const { revision } = req.query;

      const repo = fastify.orm.getRepository(Article);
      const revisionRepo = fastify.orm.getRepository(ArticleRevision);

      const article = await repo.findOne(articleId);

      const articlesRevisionInfo = await revisionRepo
        .createQueryBuilder("r")
        .where("r.articleId = :aid", { aid: articleId })
        .select("r.revisionNumber", "number")
        .addSelect("r.time", "time")
        .getMany();

      if (!article) {
        return { 404: { notFound: "article" } };
      }

      const targetRevisionNumber =revision ?? article.latestRevisionNumber;

      const targetRevision = await revisionRepo
        .createQueryBuilder("r")
        .where("r.articleId = :aid", { aid: articleId })
        .andWhere("r.revisionNumber = :rn", { rn: targetRevisionNumber })
        .getOne();

      if (!targetRevision) {
        return { 404: { notFound: "revision" } };
      }

      return {
        200: {
          article: {
            id: articleId,
            revisionNumber: targetRevisionNumber,
            currentRevision: {
              abstract: targetRevision.abstract,
              authors: targetRevision.authors,
              category: targetRevision.category,
              keywords: targetRevision.keywords,
              pdfLink: targetRevision.pdfLink,
              title: targetRevision.title,
            },
            revisions: articlesRevisionInfo.map((x) => ({
              time: x.time.toISOString(),
              number: x.revisionNumber,
            })),
          },
        },
      };

    },
  );

}
import { FastifyInstance } from "fastify";
import * as get from "yaarxiv-api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function getArticleRoute(fastify: FastifyInstance) {
  route<get.GetArticleSchema>(fastify, get.endpoint, "GetArticleSchema", {})(
    async (req, reply) => {
      const { articleId } = req.params;
      const { revision } = req.query;

      const numArticleId = articleId + "";

      const repo = fastify.orm.getRepository(Article);

      const article = await repo.findOne(numArticleId, { relations: ["revisions"]});

      if (!article) {
        return { 404: { notFound: "article" } };
      }

      const targetRevisionNumber = revision ?? article.latestRevisionNumber;

      const targetRevision = article.revisions.find((x) =>
        x.revisionNumber === targetRevisionNumber);

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
            revisions: article.revisions.map((r) => ({
              number: r.revisionNumber,
              time: r.time.toISOString(),
            })),
          },
        },
      };

    },
  );

}

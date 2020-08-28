import { FastifyInstance } from "fastify";
import * as get from "yaarxiv-api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function getArticleRoute(fastify: FastifyInstance) {
  route<get.GetArticleSchema>(fastify, get.endpoint, "GetArticleSchema", {})(
    async (req, reply) => {
      const { articleId } = req.params;
      const { revision } = req.query;

      const repo = req.orm.getRepository(Article);

      const article = await repo.findOne(parseInt(articleId), ["latestRevision"]);

      if (!article) {
        return { 404: { notFound: "article" } };
      }

      const targetRevision = revision
        ? article.revisions.getItems().find((x) =>
          x.revisionNumber === revision)
        : article.latestRevision;

      if (!targetRevision) {
        return { 404: { notFound: "revision" } };
      }

      return {
        200: {
          article: {
            id: articleId,
            revisionNumber: targetRevision.revisionNumber,
            currentRevision: {
              abstract: targetRevision.abstract,
              authors: targetRevision.authors,
              category: targetRevision.category,
              keywords: targetRevision.keywords,
              pdfLink: targetRevision.pdfLink,
              title: targetRevision.title,
            },
            revisions: article.revisions.getItems().map((r) => ({
              number: r.revisionNumber,
              time: r.time.toISOString(),
            })),
          },
        },
      };

    },
  );

}

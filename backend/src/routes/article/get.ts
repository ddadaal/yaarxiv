import { FastifyInstance } from "fastify";
import * as get from "yaarxiv-api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { QueryOrder } from "@mikro-orm/core";

export async function getArticleRoute(fastify: FastifyInstance) {
  route<get.GetArticleSchema>(fastify, get.endpoint, "GetArticleSchema", {})(
    async (req) => {
      const { articleId } = req.params;
      const { revision } = req.query;

      const numId = Number(articleId);

      const repo = req.em.getRepository(Article);

      const article = await repo.findOne({ id: numId });

      if (!article) {
        return { 404: { notFound: "article" } };
      }

      const revisionRepo = req.em.getRepository(ArticleRevision);
      const articlesRevisionInfo = await revisionRepo.find({
        article: { id: numId },
      }, {
        orderBy: { time: QueryOrder.DESC },
      });

      const targetRevisionNumber = revision ?? article.latestRevisionNumber;

      const targetRevision = await revisionRepo.findOne({
        $and: [
          { article: { id: numId } },
          { revisionNumber: targetRevisionNumber },
        ],
      }, ["pdf"]);

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
              pdfLink: targetRevision.pdf.pdfUrl,
              title: targetRevision.title,
            },
            revisions: articlesRevisionInfo.map((x) => ({
              time: x.time.toISOString(),
              number: x.revisionNumber,
            })),
            ownerId: article.owner.id,
            createTime: article.createTime.toISOString(),
          },
        },
      };

    },
  );

}

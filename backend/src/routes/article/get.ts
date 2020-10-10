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

      if (!article) {
        return { 404: { notFound: "article" } };
      }

      // if the logged in user is the owner or an admin,
      // then it can get the article if the article is not public,
      // else, return 404 as if the article does not exist.
      if (!article.adminSetPublicity || !article.ownerSetPublicity) {
        const token = await req.tryGetToken();
        if (!(token && (token.role === "admin" || article.ownerId === token.id))) {
          return { 404: { notFound: "article" } };
        }
      }


      const articlesRevisionInfo = await revisionRepo
        .createQueryBuilder("r")
        .where("r.articleId = :aid", { aid: articleId })
        .orderBy("r.revisionNumber")
        .select([
          "r.time",
          "r.revisionNumber",
        ])
        .getMany();


      const targetRevisionNumber =revision ?? article.latestRevisionNumber;

      const targetRevision = await revisionRepo
        .createQueryBuilder("r")
        .where("r.articleId = :aid", { aid: articleId })
        .andWhere("r.revisionNumber = :rn", { rn: targetRevisionNumber })
        .leftJoinAndSelect("r.pdf", "a")
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
              pdfLink: targetRevision.pdf.pdfUrl,
              title: targetRevision.title,
              codeLink: targetRevision.codeLink,
            },
            revisions: articlesRevisionInfo.map((x) => ({
              time: x.time.toISOString(),
              number: x.revisionNumber,
            })),
            ownerId: article.ownerId,
            createTime: article.createTime.toISOString(),
          },
        },
      };

    },
  );

}

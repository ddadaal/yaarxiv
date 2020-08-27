import { FastifyInstance } from "fastify";
import * as search from "yaarxiv-api/article/search";
import * as get from "yaarxiv-api/article/get";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function articlesRoutes(fastify: FastifyInstance) {
  route<search.SearchArticleSchema>(fastify, search.endpoint, "SearchArticleSchema", { summary: search.summary })(
    async (req, reply) => {

      const { searchText, page, keywords, authorNames, startYear, endYear } = req.query;

      const repo = fastify.orm.getRepository(Article);

      const builder = repo.createQueryBuilder("a")
        .leftJoinAndSelect("a.revisions", "r")
        .where("r.revisionNumber = a.latestRevisionNumber");


      if (startYear) {
        builder.andWhere("a.createTime >= :start", { start: `${startYear}-01-01` });
      }

      if (endYear) {
        builder.andWhere("a.createTime < :end", { end: `${endYear + 1}-01-01` });
      }

      if (searchText) {
        builder.andWhere("r.title LIKE :text", { text: `%${searchText}%` });
      }

      const [results, count] = await builder
        .skip(((page ?? 1) - 1) * 10)
        .take(10)
        .orderBy("a.lastUpdateTime", "DESC")
        .getManyAndCount();

      return {
        200: {
          totalCount: count,
          results: results.map((x) => {
            const rev = x.revisions[0];
            return {
              articleId: x.id + "",
              title: rev.title,
              createTime: x.createTime.toISOString(),
              lastUpdateTime: x.lastUpdateTime.toISOString(),
              abstract: rev.abstract,
              authors: rev.authors,
              keywords: rev.keywords,
              category: rev.category,
              commentCount: 0,
              pdfLink: rev.pdfLink,
            };
          }),
        },
      };

    });

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

  // route<uploadPDF.UploadPDFSchema>(fastify, uploadPDF.endpoint, "UploadPDFSchema", {
  //   consumes: ["multipart/form-data"],
  //   // eslint-disable-next-line object-curly-newline
  // })(
  //   async (req, reply) => {
  //     const file = req.body.file;
  //     reply.code(201);
  //     return { token: "123" };
  //   },
  // );
}

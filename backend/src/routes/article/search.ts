import { FastifyInstance } from "fastify";
import * as search from "yaarxiv-api/article/search";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

// Must add async
export async function searchArticleRoute(fastify: FastifyInstance) {
  route<search.SearchArticleSchema>(fastify, search.endpoint, "SearchArticleSchema", { summary: search.summary })(
    async (req) => {

      const { searchText, page, startYear, endYear } = req.query;

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

}
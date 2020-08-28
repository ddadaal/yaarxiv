import { FastifyInstance } from "fastify";
import * as search from "yaarxiv-api/article/search";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { QueryOrder } from "@mikro-orm/core";

// Must add async
export async function searchArticleRoute(fastify: FastifyInstance) {
  route<search.SearchArticleSchema>(fastify, search.endpoint, "SearchArticleSchema", { summary: search.summary })(
    async (req, reply) => {

      const { searchText, page, keywords, authorNames, startYear, endYear } = req.query;

      const repo = req.getEm().getRepository(Article);

      const builder =repo.createQueryBuilder("a")
        .leftJoin("a.latestRevision", "r");

      if (startYear) {
        builder.andWhere("a.createTime >= ?", [`${startYear}-01-01`]);
      }

      if (endYear) {
        builder.andWhere("a.createTime < ?", [ `${endYear + 1}-01-01` ]);
      }

      if (searchText) {
        builder.andWhere("r.title LIKE ?", [ `%${searchText}%` ]);
      }

      const count: number = await builder.clone().count().execute("all", false);

      const results = await builder
        .offset(((page ?? 1) - 1) * 10)
        .limit(10)
        .orderBy({ createTime: QueryOrder.DESC })
        .getResult();

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

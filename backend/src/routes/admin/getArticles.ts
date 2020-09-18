import * as api from "yaarxiv-api/admin/getArticles";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function adminGetArticlesRoute(fastify: FastifyInstance) {
  route<api.AdminGetArticlesSchema>(fastify, api.endpoint, "AdminGetArticlesSchema", {
    authOption: ["admin"],
    summary: api.summary,
  })(
    async (req) => {

      const { page, searchWord } = req.query;

      const repo = req.em.getRepository(Article);

      const builder = repo.createQueryBuilder("a")
        .leftJoin("a.revisions", "r")
        .where("r.revisionNumber = a.latestRevisionNumber");

      if (searchWord) {
        builder.andWhere("r.title LIKE ?", [`%${searchWord}%`]);
      }

      const articles = await builder
        .orderBy("a.createTime")
        .offset(((page ?? 1) - 1) * 10)
        .limit(10)
        .getResult();

      return {
        200: {
          articles: articles.map((x) => ({
            id: x.id + "",
            createTime: x.createTime.toISOString(),
            lastUpdatedTime: x.lastUpdateTime.toISOString(),
            revisionCount: x.latestRevisionNumber,
            title: x.revisions[0].title,
          })),
          totalCount: 0,
        },
      };
    });

}

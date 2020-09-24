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

      const repo = fastify.orm.getRepository(Article);

      const builder = repo.createQueryBuilder("a")
        .leftJoinAndSelect("a.revisions", "r")
        .leftJoinAndSelect("a.owner","o")
        .where("r.revisionNumber = a.latestRevisionNumber");

      if (searchWord) {
        builder.andWhere("r.title LIKE :text", { text: `%${searchWord}%` });
      }

      const [articles, count] = await builder
        .orderBy("a.createTime", "DESC")
        .skip(((page ?? 1) - 1) * 10)
        .take(10)
        .getManyAndCount();

      return {
        200: {
          articles: articles.map((x) => ({
            id: x.id + "",
            createTime: x.createTime.toISOString(),
            lastUpdatedTime: x.lastUpdateTime.toISOString(),
            revisionCount: x.latestRevisionNumber,
            title: x.revisions[0].title,
            ownerSetPublicity: x.ownerSetPublicity,
            adminSetPublicity: x.adminSetPublicity,
            owner: {
              id: x.owner.id,
              name: x.owner.name,
            },
          })),
          totalCount: count,
        },
      };
    });

}

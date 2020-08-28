import * as api from "yaarxiv-api/admin/getArticles";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function adminGetArticlesRoute(fastify: FastifyInstance) {
  route<api.AdminGetArticlesSchema>(fastify, api.endpoint, "AdminGetArticlesSchema", {
    jwtAuth: true,
    summary: api.summary,
  })(
    async (req) => {

      if ((await req.dbUser()).role !== "admin") { return { 403: {} };}

      const { page, searchWord } = req.query;

      const repo = fastify.orm.getRepository(Article);

      const builder = repo.createQueryBuilder("a")
        .leftJoinAndSelect("a.revisions", "r")
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
          })),
          totalCount: count,
        },
      };
    });

}
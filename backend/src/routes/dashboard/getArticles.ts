import * as api from "yaarxiv-api/dashboard/getArticles";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function dashboardGetArticlesRoute(fastify: FastifyInstance) {
  route<api.UserGetArticleInfoSchema>(fastify, api.endpoint, "UserGetArticleInfoSchema", {
    authOption: true,
    summary: api.summary,
  })(
    async (req) => {

      const { page }  = req.query;
      const repo = req.em.getRepository(Article);

      const user =await req.dbUser();

      const [articles, count] = await repo.createQueryBuilder("a")
        .leftJoin("a.revisions", "r")
        .where("r.revisionNumber = a.latestRevisionNumber")
        .andWhere("a.ownerId = ?",  [ user.id ])
        .offset(((page ?? 1) - 1) * 10)
        .limit(10)
        .getResultList();

      const articlesRevisionCount = await repo.createQueryBuilder("a")
        .leftJoin("a.revisions", "r")
        .where("a.ownerId = ?",  [user.id])
        .andWhere("a.id in (:...ids)", { ids: articles.map((x) => x.id) })
        .groupBy("a.id")
        .select("a.id", "aid")
        .addSelect("COUNT(r.id)", "rcount")
        .getRawMany() as { aid: number; rcount: number }[];

      const countMap = articlesRevisionCount.reduce((prev, curr) => {
        prev[curr.aid] = curr.rcount;
        return prev;
      }, {});

      return {
        200: {
          articles: articles.map((x) => ({
            id: x.id + "",
            createTime: x.createTime.toISOString(),
            lastUpdatedTime: x.lastUpdateTime.toISOString(),
            revisionCount: countMap[x.id],
            title: x.revisions[0].title,
          })),
          totalCount: count,
        },
      };


    });

}

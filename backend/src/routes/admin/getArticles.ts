import * as api from "yaarxiv-api/api/admin/getArticles";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { QueryOrder } from "@mikro-orm/core";
import { paginationProps } from "@/utils/pagination";

export const adminGetArticlesRoute = route(
  api, "AdminGetArticlesSchema",
  async (req) => {

    const { page, searchWord } = req.query;

    const [articles, count] = await req.em.findAndCount(Article,
      searchWord
        ? { latestRevision: { title: { $like: `%${searchWord}%` } } }
        : {},
      {
        populate: ["revisions", "latestRevision", "owner"],
        orderBy: { createTime: QueryOrder.DESC },
        ...paginationProps(page),
      });

    const users = articles.map((x) => x.owner);

    return {
      200: {
        articles: articles.map((x) => ({
          id: x.id,
          createTime: x.createTime.toISOString(),
          lastUpdatedTime: x.lastUpdateTime.toISOString(),
          revisionCount: x.revisions.length,
          title: x.latestRevision.getEntity().title,
          ownerSetPublicity: x.ownerSetPublicity,
          adminSetPublicity: x.adminSetPublicity,
          owner: {
            id: x.owner.get().id,
            name: x.owner.get().name,
          },
        })),
        totalCount: count,
      },
    };
  });

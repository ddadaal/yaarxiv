import * as api from "yaarxiv-api/api/admin/getArticles";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";
import { QueryOrder } from "@mikro-orm/core";
import { paginationProps } from "@/utils/orm";

export const adminGetArticlesRoute = route(
  api, "AdminGetArticlesSchema",
  async (req) => {

    const { page, searchWord } = req.query;

    const [articles, count] = await req.em.findAndCount(Article,
      searchWord
        ? { latestRevision: {
          $or: [
            { cnTitle: { $like: `%${searchWord}%` } },
            { enTitle: { $like: `%${searchWord}%` } },
          ],
        },
        }
        : {},
      {
        populate: ["revisions", "latestRevision", "owner"],
        orderBy: { createTime: QueryOrder.DESC },
        ...paginationProps(page),
      });

    return {
      200: {
        articles: articles.map((x) => ({
          id: x.id,
          createTime: x.createTime.toISOString(),
          lastUpdatedTime: x.lastUpdateTime.toISOString(),
          revisionCount: x.revisions.length,
          cnTitle: x.latestRevision.getEntity().cnTitle,
          enTitle: x.latestRevision.getEntity().enTitle,
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

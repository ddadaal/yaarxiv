import * as api from "yaarxiv-api/api/dashboard/getArticles";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { paginationProps } from "@/utils/pagination";

export const dashboardGetArticlesRoute = route(
  api, "UserGetArticleInfoSchema",
  async (req) => {

    const { page }  = req.query;

    const user = await req.dbUser();

    const [articles, count] = await req.em.findAndCount(Article, {
      owner: { id: user.id },
    }, {
      populate: ["latestRevision", "revisions"],
      ...paginationProps(page),
    });

    return {
      200: {
        articles: articles.map((x) => ({
          id: x.id,
          createTime: x.createTime.toISOString(),
          lastUpdatedTime: x.lastUpdateTime.toISOString(),
          revisionCount: x.revisions.length,
          ownerSetPublicity: x.ownerSetPublicity,
          adminSetPublicity: x.adminSetPublicity,
          title: x.latestRevision.getEntity().title,
        })),
        totalCount: count,
      },
    };


  });


import * as api from "yaarxiv-api/api/article/search";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { QueryOrder } from "@mikro-orm/core";
import { config } from "@/utils/config";

// Must add async
export const searchArticleRoute = route(
  api, "SearchArticleSchema",
  async (req) => {

    const { searchText, page, startYear, endYear, keywords, authorNames } = req.query;

    const builder = req.em.createQueryBuilder(Article, "a")
      .select("*")
      .joinAndSelect("a.latestRevision", "l")
      .where({ "a.ownerSetPublicity":  true })
      .andWhere({ "a.adminSetPublicity": true });

    if (startYear) {
      builder.andWhere({ "a.createTime": { $gte: `${startYear}-01-01` } });
    }

    if (endYear) {
      builder.andWhere({ "a.createTime": { $lt: `${endYear + 1}-01-01` } });
    }

    if (searchText) {
      builder.andWhere({ "l.title": { $like: `%${searchText}%` } });
    }

    // ALL of specified keywords
    // Allows search part of keyword ("Computer" -> "Computer Science")
    if (keywords) {
      keywords.forEach((k) => {
        builder.andWhere( { "l.keywords": { $like:`%${k}%` } });
      });
    }

    // ALL of specified authors
    // Does not allow search part of keywords ("CJ" does not match "CJD")
    // TODO limit the author input
    if (authorNames) {
      authorNames.forEach((k) => {
        builder.andWhere( { "l.authors": { $like:`%{"name": "${k}"%` } });
      });
    }

    builder.orderBy({ "a.lastUpdateTime": QueryOrder.DESC });

    const { count } = await builder.clone().count("id").execute("get") as { count: number };

    builder.offset(((page ?? 1) - 1) * config.defaultPageSize)
      .limit(config.defaultPageSize);

    const results = await builder.getResult();

    return {
      200: {
        totalCount: count,
        results: results.map((x) => {
          const rev = x.latestRevision.getEntity();
          return {
            articleId: x.id,
            title: rev.title,
            createTime: x.createTime.toISOString(),
            lastUpdateTime: x.lastUpdateTime.toISOString(),
            abstract: rev.abstract,
            authors: rev.authors,
            keywords: rev.keywords,
            category: rev.category,
            codeLink: rev.codeLink,
            commentCount: 0,
          };
        }),
      },
    };

  });

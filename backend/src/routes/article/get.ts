import * as api from "yaarxiv-api/api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export const getArticleRoute = route(
  api, "GetArticleSchema",
  async (req) => {
    const { articleId } = req.params;
    const { revision } = req.query;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    if (!article || !article.checkAccessibility(await req.tryGetUser())) {
      return { 404: { notFound: "article" } as const };
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { 404: { notFound: "revision" } as const };
    }

    await req.em.populate(targetRevision, ["pdf"]);

    return {
      200: {
        article: {
          id: articleId,
          revisionNumber: targetRevision.revisionNumber,
          currentRevision: {
            abstract: targetRevision.abstract,
            authors: targetRevision.authors,
            category: targetRevision.category,
            cnKeywords: targetRevision.cnKeywords,
            cnTitle: targetRevision.cnTitle,
            enKeywords: targetRevision.enKeywords,
            enTitle: targetRevision.enTitle,
            codeLink: targetRevision.codeLink,
            doi: targetRevision.doi,
          },
          retractTime: article.retractTime?.toISOString(),
          revisions: article.revisions.getItems().map((x) => ({
            time: x.time.toISOString(),
            number: x.revisionNumber,
          })),
          ownerId: article.owner.id,
          createTime: article.createTime.toISOString(),
        },
      },
    };

  },
);

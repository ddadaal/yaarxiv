import * as api from "yaarxiv-api/api/article/get";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";
import { ScriptFormat } from "yaarxiv-api/api/article/models";

export const getArticleRoute = route(
  api, "GetArticleSchema",
  async (req) => {
    const { articleId } = req.params;
    const { revision } = req.query;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    if (!article || !article.checkAccessibility(await req.tryJwtVerify())) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { "404": { code: "REVISION_NOT_FOUND" } } as const;
    }

    const rev = await req.em.populate(targetRevision, ["script"]);

    return {
      200: {
        article: {
          id: articleId,
          revisionNumber: rev.revisionNumber,
          currentRevision: {
            abstract: rev.abstract,
            authors: rev.authors,
            category: rev.category,
            cnKeywords: rev.cnKeywords,
            cnTitle: rev.cnTitle,
            enKeywords: rev.enKeywords,
            enTitle: rev.enTitle,
            codeLink: rev.codeLink,
            doi: rev.doi,
            scriptFormat: rev.script.$.extname as ScriptFormat,
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

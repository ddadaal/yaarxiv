import * as api from "yaarxiv-api/api/article/getScript";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";
import { ArticleId } from "yaarxiv-api/api/article/models";

export const getArticleScriptRoute = route(
  api, "GetArticleScriptSchema",
  async (req, fastify, resp) => {
    const { revision, token } = req.query;

    const tokenInfo = await fastify.accessToken.validate<{ articleId: ArticleId }>("GET_ARTICLE_SCRIPT", token);

    if (!tokenInfo) {
      return { "403": { code: "TOKEN_INVALID" as const } };
    }

    const article = await req.em.findOne(Article, { id: tokenInfo.articleId }, {
      populate: ["revisions", "latestRevision"],
    });


    if (!article) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.isRetracted) {
      return { "403": { code: "ARTICLE_RETRACTED" } } as const;
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { "404": { code: "REVISION_NOT_FOUND" } } as const;
    }

    // load pdf link
    const script = await targetRevision.script.load();

    await resp.serveFile(script.filePath);

    return { 200: undefined };
  });

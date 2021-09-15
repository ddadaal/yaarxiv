import * as api from "yaarxiv-api/api/article/getScript";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";

export const getArticleScriptRoute = route(
  api, "GetArticleScriptSchema",
  async (req, fastify, resp) => {
    const { articleId } = req.params;
    const { revision, token } = req.query;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    const tokenInfo = token ? fastify.jwtTryDecodeToken(token) : undefined;

    if (!article || !article.checkAccessibility(tokenInfo)) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.retractTime) {
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

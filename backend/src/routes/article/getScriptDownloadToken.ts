import * as api from "yaarxiv-api/api/article/getScriptDownloadToken";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";

export const GET_ARTICLE_SCRIPT_TOKEN_VALID_TIME = "30min";
export const GET_ARTICLE_SCRIPT_ACTION = "GET_ARTICLE_SCRIPT";

export const getArticleScriptDownloadTokenRoute = route(
  api, "GetArticleScriptDownloadTokenSchema",
  async (req, fastify) => {
    const { articleId } = req.params;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    const tokenInfo = await req.tryJwtVerify();

    if (!article || !article.checkAccessibility(tokenInfo)) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.isRetracted) {
      return { "403": { code: "ARTICLE_RETRACTED" } } as const;
    }

    const token = fastify.accessToken.generate(
      GET_ARTICLE_SCRIPT_ACTION, { articleId }, GET_ARTICLE_SCRIPT_TOKEN_VALID_TIME);

    return { 200: token };
  });

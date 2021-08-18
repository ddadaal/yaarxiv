import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/delete";
import { Article } from "@/entities/Article";
import { getArticleBasePath } from "@/utils/articleFiles";

export const deleteArticleRoute = route(
  api, "DeleteArticleSchema",
  async (req, fastify) => {
    const { articleId } = req.params;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions.script"],
    });

    if (!article) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    await req.em.removeAndFlush(article);

    // delete the /{user.id}/{article.id} folder
    await fastify.storage.rmdir(getArticleBasePath(article));

    return { 204: null };
  },
);

import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/delete";
import { Article } from "@/entities/Article";
import { getArticleBasePath } from "@/services/articleFiles";

export const deleteArticleRoute = route(
  api, "DeleteArticleSchema",
  async (req, fastify) => {
    const { articleId } = req.params;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions.pdf"],
    });

    if (!article) {
      return { 404: null };
    }

    await req.em.removeAndFlush(article);

    // delete the /{user.id}/{article.id} folder
    await fastify.storage.rmdir(getArticleBasePath(article));

    return { 204: null };
  },
);

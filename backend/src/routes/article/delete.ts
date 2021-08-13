import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/delete";
import { Article } from "@/entities/Article";
import { removeArticleFiles } from "@/services/removeArticleFiles";

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

    const remove = removeArticleFiles(article);

    await req.em.removeAndFlush(article);

    await remove(fastify);

    return { 204: null };
  },
);

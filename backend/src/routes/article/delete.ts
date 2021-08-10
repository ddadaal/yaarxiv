import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/delete";
import { Article } from "@/entities/Article";

export const deleteArticleRoute = route(
  api, "DeleteArticleSchema",
  async (req) => {
    const { articleId } = req.params;

    const article = await req.em.findOne(Article, { id: articleId });

    if (!article) {
      return { 404: null };
    }

    await req.em.removeAndFlush(article);

    return { 204: null };
  },
);

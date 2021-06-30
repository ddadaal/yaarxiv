import { route } from "@/utils/route";
import * as api from "yaarxiv-api/article/delete";
import { Article } from "@/entities/Article";
import { UserRole } from "@/entities/User";

export const deleteArticleRoute = route(
  api, "DeleteArticleSchema",
  async (req) => {
    const { articleId } = req.params;

    const user = await req.dbUser();

    const article = await req.em.findOne(Article, { id: articleId });

    if (!article) {
      return { 404: null };
    }

    if (article.owner.id !== user.id && user.role !== UserRole.Admin) {
      return { 403: null };
    }

    await req.em.removeAndFlush(article);

    return { 204: null };
  },
);

import * as api from "yaarxiv-api/api/admin/changeArticlePublicity";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export const changeArticleAdminSetPublicityRoute = route(
  api, "ChangeArticleAdminSetPublicitySchema",
  async (req) => {

    const { articleId } = req.params;

    const { publicity } = req.body;

    const numId = Number(articleId);

    const repo = req.em.getRepository(Article);

    const article = await repo.findOne(numId);

    if (!article) {
      return { 404: null };
    }

    article.adminSetPublicity = publicity;

    await repo.persistAndFlush(article);

    return { 200: { publicity: article.adminSetPublicity } };

  });

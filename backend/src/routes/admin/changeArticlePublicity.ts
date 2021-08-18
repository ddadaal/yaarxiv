import * as api from "yaarxiv-api/api/admin/changeArticlePublicity";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";

export const changeArticleAdminSetPublicityRoute = route(
  api, "ChangeArticleAdminSetPublicitySchema",
  async (req) => {

    const { articleId } = req.params;

    const { publicity } = req.body;

    const repo = req.em.getRepository(Article);

    const article = await repo.findOne({ id: articleId });

    if (!article) {
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    article.adminSetPublicity = publicity;

    await repo.persistAndFlush(article);

    return { 200: { publicity: article.adminSetPublicity } };

  });

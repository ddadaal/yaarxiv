import * as api from "yaarxiv-api/api/dashboard/changeArticlePublicity";
import { route } from "@/core/route";
import { Article } from "@/entities/Article";

export const changeArticleOwnerSetPublicityRoute = route(
  api, "ChangeArticleOwnerSetPublicitySchema",
  async (req) => {

    const { articleId } = req.params;
    const { publicity } = req.body;

    const repo = req.em.getRepository(Article);

    const article = await repo.findOne({ id: articleId });

    if (!article) {
      return { 404: { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.owner.id !== req.userId()){
      return { 403: { code: "NOT_OWNER" } } as const;
    }

    article.ownerSetPublicity = publicity;

    await req.em.flush();

    return { 200: { publicity: article.ownerSetPublicity } };

  });

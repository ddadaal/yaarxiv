import * as api from "yaarxiv-api/dashboard/changeArticlePublicity";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export const changeArticleOwnerSetPublicityRoute = route(
  api, "ChangeArticleOwnerSetPublicitySchema",
  async (req) => {

    const { articleId } = req.params;
    const { publicity } = req.body;

    const repo = req.em.getRepository(Article);

    const article = await repo.findOne({ id: articleId });

    if (!article) {
      return { 404: { } };
    }

    if (article.owner.id !== req.userId()){
      return { 403: { } };
    }

    article.ownerSetPublicity = publicity;

    await req.em.flush();

    return { 200: { publicity: article.ownerSetPublicity } };

  });

import * as api from "yaarxiv-api/dashboard/changeArticlePublicity";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function changeArticleOwnerSetPublicityRoute(fastify: FastifyInstance) {
  route<api.ChangeArticleOwnerSetPublicitySchema>(fastify, api.endpoint, "ChangeArticleOwnerSetPublicitySchema", {
    authOption: ["user"],
  })(
    async (req) => {

      const { articleId } = req.params;
      const { publicity } = req.body;

      const numId = Number(articleId);

      const repo = fastify.orm.getRepository(Article);

      const article = await repo.findOne(numId);

      if (!article) {
        return { 404: { } };
      }

      if (article.ownerId !== req.userId()){
        return { 403: { } };
      }

      article.ownerSetPublicity = publicity;

      await repo.save(article);

      return { 200: { publicity: article.ownerSetPublicity } };

    });

}

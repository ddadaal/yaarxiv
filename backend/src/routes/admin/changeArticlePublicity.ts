import * as api from "yaarxiv-api/admin/changeArticlePublicity";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export async function changeArticleAdminSetPublicityRoute(fastify: FastifyInstance) {
  route<api.ChangeArticleAdminSetPublicitySchema>(fastify, api.endpoint, "ChangeArticleAdminSetPublicitySchema", {
    authOption: ["admin"],
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

      article.adminSetPublicity = publicity;

      await repo.save(article);

      return { 200: { publicity: article.adminSetPublicity } };

    });

}

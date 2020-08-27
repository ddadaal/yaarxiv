import { route } from "@/utils/route";
import * as deleteArticle from "yaarxiv-api/article/delete";
import { FastifyInstance } from "fastify";
import { Article } from "@/entities/Article";
import { User } from "@/entities/User";

export async function deleteArticleRoute(fastify: FastifyInstance) {
  route<deleteArticle.DeleteArticleSchema>(fastify, deleteArticle.endpoint, "DeleteArticleSchema", {
    summary: deleteArticle.summary,
    jwtAuth: true,
  })(
    async (req, rep) => {
      const { articleId } = req.params;
      const numArticleId = Number(articleId);

      const user = await req.dbUser();

      const repo = fastify.orm.getRepository(Article);
      const article = await repo.findOne(numArticleId);

      if (!article) {
        return { 404: {} };
      }

      if (article.ownerId !== user.id && user.role !== "admin") {
        return { 403: {} };
      }

      await repo.remove(article);

      return { 200: {} };
    },
  );
}

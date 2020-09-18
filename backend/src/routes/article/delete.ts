import { route } from "@/utils/route";
import * as deleteArticle from "yaarxiv-api/article/delete";
import { FastifyInstance } from "fastify";
import { Article } from "@/entities/Article";

export async function deleteArticleRoute(fastify: FastifyInstance) {
  route<deleteArticle.DeleteArticleSchema>(fastify, deleteArticle.endpoint, "DeleteArticleSchema", {
    summary: deleteArticle.summary,
    authOption: true,
  })(
    async (req) => {
      const { articleId } = req.params;
      const numId = Number(articleId);

      const user = await req.dbUser();

      const repo = req.em.getRepository(Article);
      const article = await repo.findOne({ id: numId });

      if (!article) {
        return { 404: {} };
      }

      if (article.owner !== user && user.role !== "admin") {
        return { 403: {} };
      }

      await repo.removeAndFlush(article);

      return { 200: {} };
    },
  );
}

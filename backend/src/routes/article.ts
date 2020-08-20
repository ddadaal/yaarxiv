import { FastifyInstance } from "fastify";
import { endpoint, SearchArticleSchema, summary } from "yaarxiv-api/article/search";
import { route } from "@/utils/route";

export async function articlesRoutes(fastify: FastifyInstance) {
  route<SearchArticleSchema>(fastify, endpoint, "SearchArticleSchema", { summary })
  (async (req, reply) => {
    return { results: [], totalCount: 0 };
  });
}

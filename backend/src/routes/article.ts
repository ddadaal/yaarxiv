import { FastifyInstance } from "fastify";
import { api, schema, Schema, summary } from "yaarxiv-api/article/search";
import { route } from "@/utils/route";

export async function loginRoutes(fastify: FastifyInstance) {
  route<Schema>(fastify, { api, schema, summary }, async (req, reply) => {
    return { results: [], totalCount: 0 };
  });

}

export { schema };

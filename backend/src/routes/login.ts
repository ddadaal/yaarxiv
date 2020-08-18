import { FastifyInstance } from "fastify";
import { api, schema, Schema, summary } from "yaarxiv-api/auth/login";
import { route } from "@/utils/route";

export async function loginRoutes(fastify: FastifyInstance) {
  route<Schema>(fastify, { api, schema, summary }, async (req, reply) => {
    const { id, password } = req.query;
    if (id === password) {
      return { token: id };
    }
    else {
      reply.statusCode = 403;
      return { reason: 403 };
    }
  });

}

import { FastifyInstance } from "fastify";
import { api, schema, Schema } from "yaarxiv-api/auth/login";
import { route } from "@/utils/route";

export async function loginRoutes(fastify: FastifyInstance) {
  route<Schema>(fastify, api, schema, async (req, reply) => {
    const { username, password } = req.query;
    if (username === password) {
      return { token: username };
    }
    else {
      reply.statusCode = 403;
      return { reason: 403 };
    }
  });

}

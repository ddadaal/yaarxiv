import { FastifyInstance } from "fastify";
import loginApi from "yaarxiv-api/src/auth/login";
import { route } from "@/utils/route";

export async function loginRoutes(fastify: FastifyInstance) {

  route(fastify, loginApi, async (req, reply) => {
    const { username, password } = req.query;
    if (username === password) {
      // @ts-ignore
      return { token: username };
    } else {
      reply.statusCode = 403;
      return { reason: "403" };
    }
  });

}

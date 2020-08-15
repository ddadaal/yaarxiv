import { FastifyInstance, HTTPMethods } from "fastify";
import Schema from "schemas/login.route.json";
import { Static } from "@sinclair/typebox";
import { Querystring, SuccessResponse, FailedResponse } from "types/login.route";
import loginApi from "yaarxiv-api/src/auth/login";
import { route } from "@/utils/route";

type t = typeof loginApi;

export async function loginRoutes(fastify: FastifyInstance) {

  route(fastify, loginApi, async (req, reply) => {
    const { username, password } = req.query;
    if (username === password) {
      return { token: username };
    } else {
      reply.statusCode = 403;
      return { reason: "403" };
    }
  });

}

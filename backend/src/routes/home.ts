import { FastifyInstance } from "fastify";

import Schema from "schemas/home.route.json";
import { Querystring, Headers, Response } from "types/home.route";

async function homeRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: Querystring,
    Headers: Headers,
    // Response: Response,
  }>("/", {
    schema: {
      querystring: Schema.definitions.Querystring,
      headers: Schema.definitions.Headers,
      // response: Schema.definitions.Response,
    },
  }, async (req, reply) => {
    return { hello: "world" };
  });
}

export default homeRoutes;

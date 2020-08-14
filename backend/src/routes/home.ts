import { FastifyInstance } from "fastify";

import Schema from "schemas/home.route.json";
import { Querystring } from "types/home.route";

export async function homeRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: Querystring,
    // Response: Response,
  }>("/", {
    schema: {
      querystring: Schema.definitions.Querystring,
      // response: Schema.definitions.Response,
    },
  }, async (req, reply) => {
    return { hello: req.query.username };
  });
}

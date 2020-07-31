import { FastifyInstance } from "fastify";

import Schema from "schemas/login.route.json";
import { Querystring, SuccessResponse, FailedResponse } from "types/login.route";

async function loginRoutes(fastify: FastifyInstance) {
  fastify.route<{
    Querystring: Querystring,
  }>({
    method: "GET",
    url: "/login",
    schema: {
      description: "Login",
      querystring: Schema.definitions.Querystring,
      response: {
        200: Schema.definitions.SuccessResponse,
        403: Schema.definitions.FailedResponse,
      },
    },
    handler: async (req, reply): Promise<SuccessResponse | FailedResponse> => {
      const { username, password } = req.query;
      if (username === password) {
        return { token:  username };
      } else {
        reply.statusCode = 403;
        return { reason: 403 };
      }
    },
  });
}

export default loginRoutes;

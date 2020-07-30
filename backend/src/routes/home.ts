import { FastifyInstance } from "fastify";

async function homeRoutes(fastify: FastifyInstance, options) {
  fastify.get("/", async (req, reply) => {
    return { hello: "world" };
  });
}

export default homeRoutes;

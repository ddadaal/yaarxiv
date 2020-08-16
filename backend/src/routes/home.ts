import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import { api, schema, Schema } from "yaarxiv-api/home/greeting";

export async function homeRoutes(fastify: FastifyInstance) {
  route<Schema>(fastify, api, schema, async (req, reply) => {
    const { username } = req.query;
    return { hello: username };
  });
}

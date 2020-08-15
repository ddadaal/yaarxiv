import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import homeGreetingApi from "yaarxiv-api/home/greeting";

export async function homeRoutes(fastify: FastifyInstance) {
  route(fastify, homeGreetingApi, async (req, reply) => {
    const { username } = req.query;
    return { hello: username };
  });
}

import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import { endpoint, GreetingSchema } from "yaarxiv-api/home/greeting";

export async function homeRoutes(fastify: FastifyInstance) {
  route<GreetingSchema>(fastify, endpoint, "GreetingSchema")
  (async (req, reply) => {
    const { username } = req.query;
    return { hello: username };
  });
}


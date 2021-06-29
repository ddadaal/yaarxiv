import { config } from "@/utils/config";
import fp from "fastify-plugin";
import redis from "fastify-redis";

export const redisPlugin = fp(async (fastify) => {
  fastify.register(redis, {
    host: config.redis.host,
  });
});
// 

import fp from "fastify-plugin";
import multipartPlugin from "fastify-multipart";

export const uploadPlugin = fp(async (fastify) => {
  await fastify.register(multipartPlugin, {});
});


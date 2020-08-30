import fp from "fastify-plugin";
import FastifyMultipart from "fastify-multipart";
import { config } from "node-config-ts";
import { FastifyRequest, FastifyReply } from "fastify";

const sharedSchemaId = "File";

export const uploadPlugin = fp(async (fastify) => {

  fastify.register(FastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId,
    limits: { fileSize: config.upload.maxFileSize },
  });
});


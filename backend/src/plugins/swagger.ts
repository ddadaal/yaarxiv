import fp from "fastify-plugin";
import { config } from "@/utils/config";
import fastifySwagger from "fastify-swagger";

export const swaggerPlugin = fp(async (fastify) => {
  if (config.loadSwagger) {
    fastify.register(fastifySwagger, {
      routePrefix: "/swagger",
      exposeRoute: true,
      swagger: {
        info: {
          title: "yaarxiv API",
          description: "The API spec for yaarxiv, the modern and open-source preprint platform",
          version: "1.0",
        },
        consumes: ["application/json"],
        produces: ["application/json"],
        securityDefinitions: {
          apiKey: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
          },
        },
      },
    });
  }
});

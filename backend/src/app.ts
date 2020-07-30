import "reflect-metadata";
import { createConnection } from "typeorm";
import homeRoutes from "./routes/home";

import fastify from "fastify";
import fastifyTypeormPlugin from "fastify-typeorm-plugin";
import fastifySwagger from "fastify-swagger";

interface InitOptions {
  loadSwagger: boolean;
  db: Parameters<typeof createConnection>[0];
  fastify: Parameters<typeof fastify>[0];
}

export async function buildApp({ loadSwagger, db, fastify: fastifyOpts }: InitOptions) {

  const dbConnection = await createConnection(db);

  const server = fastify(fastifyOpts);

  if (loadSwagger) {
    server.register(fastifySwagger, {
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
      },
    });
  }


  server.register(fastifyTypeormPlugin, { connection: dbConnection });

  server.register(homeRoutes);

  return server;


}


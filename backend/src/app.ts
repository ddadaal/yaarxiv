import "reflect-metadata";
import { createConnection } from "typeorm";
import homeRoutes from "./routes/home";

import fastify from "fastify";
import fastifyTypeormPlugin from "fastify-typeorm-plugin";
import fastifySwagger from "fastify-swagger";
import { getConfig, applyConfigurations } from "./utils/config";

applyConfigurations();

export async function startApp(start = true) {

  const dbConnection = await createConnection();

  const server = fastify({ logger: getConfig("fastify.logger", "boolean") });

  if (getConfig("loadSwagger", "boolean")) {
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

  if (start) {

    try {
      await server.listen(getConfig("port", "number"));
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  }

  return server;

}


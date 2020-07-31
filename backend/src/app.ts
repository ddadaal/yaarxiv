import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import homeRoutes from "./routes/home";
import loginRoutes from "./routes/login";

import fastify from "fastify";
import fastifyTypeormPlugin from "fastify-typeorm-plugin";
import fastifySwagger from "fastify-swagger";
import { getConfig } from "./utils/config";
import { TypeormPinoLogger } from "./utils/TypeormPinoLogger";

export async function startApp(start = true) {

  const server = fastify({ logger: getConfig((c) => c.logger) });

  const dbConnection = await createConnection(
    {
      ...getConfig((c) => c.typeorm) as ConnectionOptions,
      logger: new TypeormPinoLogger(server.log),
    });

  if (getConfig((c) => c.loadSwagger)) {
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
  server.register(loginRoutes);

  if (start) {
    try {
      await server.listen(getConfig((c) => c.port));
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  }

  return server;

}


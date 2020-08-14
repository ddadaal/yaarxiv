import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";

import fastify from "fastify";
import FastifyTypeormPlugin from "fastify-typeorm-plugin";
import FastifySwagger from "fastify-swagger";
import { getConfig } from "./utils/config";
import { TypeormPinoLogger } from "./utils/TypeormPinoLogger";
import auth from "./utils/auth";
import { routes } from "./routes";

export async function startApp(start = true) {

  const server = fastify({ logger: getConfig((c) => c.logger) });

  const dbConnection = await createConnection(
    {
      ...getConfig((c) => c.typeorm) as ConnectionOptions,
      logger: new TypeormPinoLogger(server.log),
    });

  if (getConfig((c) => c.loadSwagger)) {
    server.register(FastifySwagger, {
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

  server.register(auth, { secret: getConfig((c) => c.jwtSecret ) });
  server.register(FastifyTypeormPlugin, { connection: dbConnection });

  routes.forEach((r) => server.register(r));

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


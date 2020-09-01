import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";

import fastify from "fastify";
import FastifyTypeormPlugin from "fastify-typeorm-plugin";
import FastifySwagger from "fastify-swagger";
import { TypeormPinoLogger } from "./utils/TypeormPinoLogger";
import { jwtAuthPlugin } from "./utils/auth";
import { routes }  from "./routes";
import { Config, config as envConfig } from "node-config-ts";
import { models } from "./utils/schemas";
import { uploadPlugin } from "./utils/upload";
import fastifyCorsPlugin from "fastify-cors";
import fastifyStatic from "fastify-static";
import path from "path";
import urljoin from "url-join";
import { entities } from "./entities";

export async function startApp(config: Config = envConfig, start = true) {

  const server = fastify({ logger: config.logger });

  server.log.info(`Loaded config: \n${JSON.stringify(config, null, 2)}`);

  const dbConnection = await createConnection({
    ...(config.typeorm) as ConnectionOptions,
    logger: new TypeormPinoLogger(server.log),
    entities,
  });

  server.register(fastifyCorsPlugin);

  Object.values(models).forEach((s) => server.addSchema(s));

  if (config.loadSwagger) {
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

  // serve upload file
  server.register(fastifyStatic, {
    root: path.join(__dirname, "..", config.upload.path),
    prefix: "/" + urljoin(config.staticPrefix, config.upload.path),
  });

  server.register(uploadPlugin);
  server.register(jwtAuthPlugin);
  server.register(FastifyTypeormPlugin, { connection: dbConnection });

  routes.forEach((r) => server.register(r));

  if (start) {
    try {
      await server.listen(config.port, "0.0.0.0");
    } catch (err) {
      server.log.error(err);
      throw err;
    }
  }

  return server;

}


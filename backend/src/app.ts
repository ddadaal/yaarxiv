import "reflect-metadata";
import { createConnection } from "typeorm";
import fastify from "fastify";
import FastifyTypeormPlugin from "fastify-typeorm-plugin";
import FastifySwagger from "fastify-swagger";
import { TypeormPinoLogger } from "./utils/TypeormPinoLogger";
import { jwtAuthPlugin } from "./plugins/auth";
import { routes }  from "./routes";
import { models } from "./utils/schemas";
import { uploadPlugin } from "./plugins/upload";
import fastifyCorsPlugin from "fastify-cors";
import { entities } from "./entities";
import { config, getConfig } from "./utils/config";
import { staticPlugin } from "./plugins/static";
import gracefulShutdown from "fastify-graceful-shutdown";

export async function startApp(start = true) {

  const server = fastify({ logger: getConfig("logger") });

  server.log.info(`Loaded config: \n${JSON.stringify(config, null, 2)}`);

  const dbConnection = await createConnection({
    ...(getConfig("typeorm")),
    logger: new TypeormPinoLogger(server.log),
    entities,
  });

  server.register(fastifyCorsPlugin);

  Object.values(models).forEach((s) => server.addSchema(s));

  if (getConfig("loadSwagger")) {
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

  server.register(gracefulShutdown);
  server.register(staticPlugin);
  server.register(uploadPlugin);
  server.register(jwtAuthPlugin);
  server.register(FastifyTypeormPlugin, { connection: dbConnection });

  routes.forEach((r) => server.register(r));

  if (start) {
    try {
      await server.listen(getConfig("port"), "0.0.0.0");
    } catch (err) {
      server.log.error(err);
      throw err;
    }
  }

  return server;

}


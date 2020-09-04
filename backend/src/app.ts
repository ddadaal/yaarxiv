import "reflect-metadata";
import fastify from "fastify";
import FastifySwagger from "fastify-swagger";
import { jwtAuthPlugin } from "./plugins/auth";
import { routes }  from "./routes";
import { models } from "./utils/schemas";
import { uploadPlugin } from "./plugins/upload";
import fastifyCorsPlugin from "fastify-cors";
import { config, getConfig } from "./utils/config";
import { staticPlugin } from "./plugins/static";
import { ormPlugin } from "./plugins/orm";

export async function startApp(start = true) {

  const server = fastify({ logger: getConfig("logger") });

  server.log.info(`Loaded config: \n${JSON.stringify(config, null, 2)}`);


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

  server.register(staticPlugin);
  server.register(uploadPlugin);
  server.register(ormPlugin);
  server.register(jwtAuthPlugin);

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


import "reflect-metadata";
import fastify from "fastify";
import { jwtAuthPlugin } from "./plugins/auth";
import { routes }  from "./routes";
import { models } from "./utils/schemas";
import { uploadPlugin } from "./plugins/upload";
import fastifyCorsPlugin from "fastify-cors";
import { config } from "./utils/config";
import { staticPlugin } from "./plugins/static";
import { ormPlugin } from "./plugins/orm";
import { swaggerPlugin } from "./plugins/swagger";
import { mailPlugin } from "./plugins/mail";

export async function startApp() {

  const server = fastify({ logger: config.logger });

  server.log.info(`Loaded config: \n${JSON.stringify(config, null, 2)}`);

  server.register(fastifyCorsPlugin);

  Object.values(models).forEach((s) => server.addSchema(s));

  server.register(swaggerPlugin);
  server.register(staticPlugin);
  server.register(uploadPlugin);
  server.register(ormPlugin);
  server.register(mailPlugin);
  server.register(jwtAuthPlugin);

  routes.forEach((r) => server.register(r));

  try {
    await server.listen(config.port, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    throw err;
  }

  return server;
}


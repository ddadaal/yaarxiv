import "reflect-metadata";
import { createConnection } from "typeorm";
import homeRoutes from "./routes/home";

import fastify from "fastify";
import fastifyTypeormPlugin from "fastify-typeorm-plugin";

interface InitOptions {
  db: Parameters<typeof createConnection>[0];
  fastify: Parameters<typeof fastify>[0];
}

export async function buildApp({ db, fastify: fastifyOpts }: InitOptions) {

  const dbConnection = await createConnection(db);

  const server = fastify(fastifyOpts);

  server.register(fastifyTypeormPlugin, { connection: dbConnection });

  server.register(homeRoutes);

  try {
    await server.listen(3000);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

}


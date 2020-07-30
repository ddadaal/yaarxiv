import { User } from "./entities/User";
import { buildApp } from "./app";

async function init() {

  const server = await buildApp({
    loadSwagger: true,
    db: {
      type: "sqlite",
      database: "./db.db",
      entities: [User],
      synchronize: true,
    },
    fastify: { logger: true },
  });

  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

init();

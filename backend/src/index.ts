import { User } from "./entities/User";
import { buildApp } from "./app";

buildApp({
  db: {
    type: "sqlite",
    database: "./db.db",
    entities: [User],
    synchronize: true,
  },
  fastify: { logger: true },
});

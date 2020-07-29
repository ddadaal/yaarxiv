import Koa from "koa";
import { koadi, Dep, singleton } from "@/utils/di";
import { applyRouters } from "./utils/router";
import logger from "koa-logger";

import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import homeRouter from "./routes/home";
export const dep1 = singleton(1);

export const dep2: Dep<number> = (getDeps) => getDeps(dep1) + 1;

async function init() {

  await createConnection({
    type: "sqlite",
    database: "./db.db",
    entities: [User],
    synchronize: true,
  });

  const app = new Koa();

  app.use(logger());
  app.use(koadi(dep1, dep2));

  applyRouters(app, homeRouter);

  app.listen(2333, () => {
    console.log();
  });

}

init();

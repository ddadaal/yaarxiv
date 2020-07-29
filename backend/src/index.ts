import Koa from "koa";
import { koadi, Dep, singleton } from "@/utils/di";
import homeRouter from "@/routes/home";
import { applyRouters } from "./utils/router";

const app = new Koa();

export const dep1 = singleton(1);

export const dep2: Dep<number> = (getDeps) => getDeps(dep1) + 1;

app.use(koadi(dep1, dep2));

applyRouters(app, homeRouter);

app.listen(2333, () => {
  console.log();
});


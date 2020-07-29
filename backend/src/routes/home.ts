import Router from "koa-router";
import { dep1, dep2 } from "..";
import { routerHandler } from "@/utils/router";

const homeRouter = new Router();

homeRouter.get("/", routerHandler(async (ctx, useDep) => {
  const dep1Value = useDep(dep1);
  const dep2Value = useDep(dep2);
  ctx.response.body = `1: ${dep1Value}; 2: ${dep2Value}`;
}));

export default homeRouter;

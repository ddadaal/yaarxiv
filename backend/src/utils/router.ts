import Koa, { Context } from "koa";
import { useDep, Dep } from "./di";
import type Router from "koa-router";

export function routerHandler(
  handler: (ctx: Context, useDep: <T>(dep: Dep<T>) => T) => Promise<void>,
): (ctx: Context) => Promise<void> {
  return (ctx: Context) => handler(ctx, (dep) => useDep(ctx, dep));
}

export function applyRouters(app: Koa, ...routers: Router[]): void {
  routers.forEach((router) => {
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
}


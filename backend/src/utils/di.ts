import { Context, Middleware, Next } from "koa";

export type Dep<TReturnValue> = (getDep: <T>(dep: Dep<T>) => T) => TReturnValue;

export function useDep<T>(ctx: Context, dep: Dep<T>): T {
  return ctx.state.deps.get(dep);
}

export function koadi(...deps: Dep<unknown>[]): Middleware {
  return async (ctx: Context, next: Next) => {
    // convert deps array to Map
    const depsMap = new Map<Dep<unknown>, unknown>();
    const getDep = <T>(dep: Dep<T>) => depsMap.get(dep) as T;
    deps.forEach((v) => depsMap.set(v, v(getDep)));
    ctx.state.deps = depsMap;

    await next();
  };
}

export function singleton<T>(obj: T): Dep<T> {
  return () => obj;
}

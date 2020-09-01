import type { HttpError } from "./fetch";

class Event<TArgs> {
  handlers = [] as Array<(args: TArgs) => void>;

  register = (handler: (args: TArgs) => void) => {
    this.handlers.push(handler);
  };

  execute =  (args: TArgs) => {
    this.handlers.forEach((h: (arg0: TArgs) => void) => h(args));
  };

  unregister = (handler: (args: TArgs) => void) => {
    this.handlers = this.handlers.filter((x) => x !== handler);
  };
}

export const prefetchEvent = new Event<undefined>();
export const successEvent = new Event<{ status: number; data: any }>();
export const failEvent = new Event<HttpError>();
export const finallyEvent = new Event<undefined>();


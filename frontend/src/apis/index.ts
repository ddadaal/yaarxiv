import {
  jsonFetch, fullFetch,  JsonFetch,
  FullFetch, HttpError, makeHttpError,
} from "./fetch";
import { authApis } from "./auth";
import { delay } from "src/utils/delay";
import { articleApis } from "./article";
import { isServer } from "src/utils/isServer";
import { decrementRequest, incrementRequest } from "src/components/TopProgressBar";
import { articleApisMock } from "./article.mock";
import { authApisMock } from "./auth.mock";
import { dashboardApis } from "./dashboard";
import { dashboardApisMock } from "./dashboard.mock";
import { adminApis } from "./admin";
import { adminApisMock } from "./admin.mock";

export type ApiArgs = {
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
  makeHttpError: <T>(data: T, status: number) => HttpError<T>,
};

export type Api<T> = (actions: ApiArgs) => Record<string, T>;

export type MockApi<TApi extends (actions: ApiArgs) => any> =
  (actions: Pick<ApiArgs, "makeHttpError">) => ReturnType<TApi>;

export function createMockApi<T extends (actions: ApiArgs) => any>
(mock: MockApi<T>): MockApi<T> {
  const functions = (mock as any)({ makeHttpError });
  return Object
    .keys(functions)
    .reduce((prev, curr) => ({
      ...prev, [curr]: async (...args: any) => {
        if (!isServer()) {
          incrementRequest();
        }
        await delay(1000);
        return functions[curr](...args)
          .finally(() => {
            if (!isServer()) {
              decrementRequest();
            }});
      },
    }), {}) as T;
}

// changing this line during development to set USE_MOCK dynamically
const USE_MOCK = process.env.USE_MOCK === "true";
// const USE_MOCK = true;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
// Attempted to write mock and api in the same file,
// but the mock won't be stripped.

const apis = [
  [authApis, USE_MOCK ? authApisMock : authApis],
  [articleApis, USE_MOCK ? articleApisMock : articleApis],
  [dashboardApis, USE_MOCK ? dashboardApisMock : dashboardApis],
  [adminApis, USE_MOCK ? adminApisMock : adminApis],
];

const computedApis = new Map<unknown, unknown>();
for (const [key, value] of apis) {
  computedApis.set(key,
    USE_MOCK
      ? createMockApi((value as MockApi<any>))
      : (value as Api<any>)({ jsonFetch, fullFetch, makeHttpError }),
  );
}


export function getApi<TR, T extends Api<TR>>(service: T): ReturnType<T> {
  return computedApis.get(service) as ReturnType<T>;
}
